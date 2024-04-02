import { 
	connectInput as MidiInConnect, 
	connectOutput as MidiOutConnect,
	sendCC as MidiSendCC,
	getID as getMidiId
} from './common/MidiTools.js';
import {wait} from "./common/tools.js";
import conf from "./common/config.js";
import Button from "./Bases/Button.js";
import * as Pannels from "./CustomPannels";


conf.PANNELS = conf.PANNELS.filter(({type})=>{
	const res = !!Pannels[type];
	if(!res){
		console.log(`Pannel Type "${type}" does not exists`);
	}
	return res;
}).map(pannel => {
	pannel.PannelType = Pannels[pannel.type];
	return pannel;
});

const {
	MIDI_DEVICE_NAME:midiName, 
	PANNELS:pannelsConf
} = conf;

export default class MidiFighterTwister{
	constructor(){
		this.displayInterface = MidiOutConnect(midiName);
		this.midiInterface = MidiInConnect(midiName);
		this.midiInterface.onCC((channel, number, value, deltaTime)=>{
			const button = this.buttons[`${channel}-${number}`];
			button && button.update(value);
			this.currentPannel.onCC(channel, number, value, deltaTime);
		});

		this.buttons = {
			"3-12" : new Button().onPressed( () => this.nextPannel()),
			"3-9" : new Button().onPressed( () => this.prevPannel()),
		};

		this._pannels = pannelsConf.map(({PannelType, midiDeviceName, midiChannel = 0 , color = null}, id)=>{
				const pannel = new PannelType(id, 
					/* MFT DISPLAY */ 
					(channel, id, value) => {
						MidiSendCC(this.displayInterface, channel, id, value);
					}, 
					/* MIDI OUT */ 
					(id, value) => {
						MidiSendCC(pannel.midiOut, midiChannel, id, value);
				});
				pannel.midiOut = MidiOutConnect(midiDeviceName);
				return pannel;
			});
		this.currentPannel = 0;
	}

	nextPannel(){
		this.currentPannel = (this.currentPannelId + 1 + this._pannels.length) % this._pannels.length
	}
	prevPannel(){
		this.currentPannel = (this.currentPannelId - 1 + this._pannels.length) % this._pannels.length
	}

	set currentPannel(pannelId){
		if(pannelId == this._currentPannelId)return;
		if(this.currentPannel) this.currentPannel.enable = false;
		this.currentPannelId = pannelId
		this.currentPannel.enable = true;
	}

	get currentPannel(){
		return this._pannels[this.currentPannelId];
	}

	get currentPannelId(){
		return this._currentPannelId;
	}

	set currentPannelId(value){
		return this._currentPannelId = value;
	}
	async watchdog(interval){
		const [inID, outID] = getMidiId(midiName);
		if(inID < 0 || outID < 0)throw new Error(`MIDI_DEVICE (${midiName}) HAS BEEN DISCONNECTED`);
		await wait(interval);
		return this.watchdog(interval);
	}
}