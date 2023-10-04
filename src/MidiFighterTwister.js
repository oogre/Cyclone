/*----------------------------------------*\
  midiFighter - MidiFighterTwister.js
  @author Evrard Vincent (vincent@ogre.be)
  @Date:   2023-02-15 16:35:32
  @Last Modified time: 2023-10-04 14:50:37
\*----------------------------------------*/
import midi from 'midi';
import SideButtons from "./SideButtons.js";
import MultiFuncKnob from "./MultiFuncKnob.js";
import {wait, save, load} from "./common/tools.js";
import conf from "./common/config.js";

const {

	MIDI_DEVICE_NAME:midiName, 
	VIRTUAL_MIDI_DEVICE_NAME:midiOutName,
	PROCESS_NAME:midiOutName2,
	WATCHDOG_INTERVAL:watchdogInterval,
	KNOB_PER_BANK:knobPerBank,
	BANK:bankLength
} = conf;

const MIDI_MESSAGE = {
	NOTE_OFF : 0x80,
	NOTE_ON : 0x90,
	KEY_PRESSURE : 0xA0,
	CONTROL_CHANGE : 0xB0,
	PROGRAM_CHANGE : 0xC0,
	CHANNEL_PRESSURE : 0xD0,
	PITCH_BEND : 0xE0
};

export default class MidiFighterTwister {
	constructor(){
		this.sideButtons = new SideButtons()
			.on("startRec", async event => {
				this.knobs.map(knob=>knob.mode = MultiFuncKnob.MODES.RECORD)
			})
			.on("startTimeScale", event => {
				this.knobs.map(knob=>knob.mode = MultiFuncKnob.MODES.TIMESCALE)
			})
			.on("startPlayMode", event => {
				this.knobs.map(knob=>knob.mode = MultiFuncKnob.MODES.PLAYMODE)
			})
			.on("stop", async event => {
				this.knobs.map(knob=>knob.mode = MultiFuncKnob.MODES.DEFAULT)
			})
			.on("save", async event => {
				const data = JSON.stringify(this.knobs.map(knob=>knob.toObject()));
				try{
					await save(data);	
				}catch(error){
					console.log(error);
				}
			});
		try{
			this.inputMidi = new midi.Input()
				.on('message', (deltaTime, [status, number, value]) => {
					const [type, channel] = [status & 0xF0 , status & 0x0F];
					// console.log(`c: ${channel} n: ${number} v: ${value} d: ${deltaTime}`);
					switch(type){
					case MIDI_MESSAGE.CONTROL_CHANGE : 
						if(channel == 0 || channel == 1){
							this.knobs[number].update(channel, value)
						}else if(channel == 3){
							this.sideButtons.update(number, value, deltaTime);			
						}
						break;
					}
				});
		}catch(error){
			console.log("error");
			console.log(error);
			process.exit();
		}
		
		this.inputVirtual = new midi.Input()
			.on('message', (deltaTime, [status, number, value]) => {
				const [type, channel] = [status & 0xF0 , status & 0x0F];
				switch(type){
					case MIDI_MESSAGE.CONTROL_CHANGE : 
						// load(`${conf.directory}/cc.${channel}.${number}.cycl`)
						// 	.then((confs, id) => {
						// 		confs.map(conf=>this.knobs[conf.id].setup(conf))
						// 	});
					break;
				}
			});
		this.outputDisplay = new midi.Output();
		this.outputVirtual = new midi.Output();
		this.outputVirtual2 = new midi.Output();
		const [inID, outID] = this.getMidiID(midiName);
		if(inID < 0 || outID < 0)throw new Error(`MIDI_DEVICE (${midiName}) not found`);
		this.inputMidi.openPort(inID);
		this.outputDisplay.openPort(outID);
		const [inBID, outBID] = this.getMidiID(midiOutName);
		if(inBID < 0 || outBID < 0){
			console.log(`MIDI_DEVICE (${midiOutName}) not found`);
			this.inputVirtual.openVirtualPort(midiOutName);
			this.outputVirtual.openVirtualPort(midiOutName);
			this.outputVirtual2.openVirtualPort(midiOutName2);
		}else{
			this.inputVirtual.openPort(inBID);
			this.outputVirtual.openPort(outBID);
			this.outputVirtual2.openVirtualPort(midiOutName2);
		}
		
		this.knobs = new Array(knobPerBank)
			.fill(0)
			.map((_, id) => new MultiFuncKnob(id, 0, this.display.bind(this), this.virtualMidi.bind(this)));
		this.knobs.map(knob=> knob.mode = MultiFuncKnob.MODES.DEFAULT);
	}

	display(channel, id, value){
		this.outputDisplay.sendMessage([MIDI_MESSAGE.CONTROL_CHANGE|channel, id, value]);	
	}

	virtualMidi(channel, id, value){
		this.outputVirtual.sendMessage([MIDI_MESSAGE.CONTROL_CHANGE|channel, id, value]);	
		this.outputVirtual2.sendMessage([MIDI_MESSAGE.CONTROL_CHANGE|channel, id, value]);	
	}

	getMidiID (midiName) {
		return [
			new Array(this.inputMidi.getPortCount()).fill(0).map((_, id)=>this.inputMidi.getPortName(id)).findIndex(value => midiName == value),
			new Array(this.outputDisplay.getPortCount()).fill(0).map((_, id)=>this.outputDisplay.getPortName(id)).findIndex(value => midiName == value)
		];
	}

	async watchdog(){
		const [inID, outID] = this.getMidiID(midiName);
		if(inID < 0 || outID < 0)throw new Error(`MIDI_DEVICE (${midiName}) HAS BEEN DISCONNECTED`);
		await wait(watchdogInterval);
		return this.watchdog();
	}
}

