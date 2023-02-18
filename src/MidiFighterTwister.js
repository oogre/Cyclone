/*----------------------------------------*\
  midiFighter - MidiFighterTwister.js
  @author Evrard Vincent (vincent@ogre.be)
  @Date:   2023-02-15 16:35:32
  @Last Modified time: 2023-02-18 23:32:27
\*----------------------------------------*/
import midi from 'midi';
import EventHandler from "./common/EventHandler.js";
import Knobs from "./Knobs.js";
import SideButtons from "./SideButtons.js";
import Recorder from "./Recorder.js";
import {wait, lerp} from "./common/tools.js";
import conf from "./common/config.js";


const {
	MIDI_DEVICE_NAME:midiName, 
	VIRTUAL_MIDI_DEVICE_NAME:midiOutName,
	WATCHDOG_INTERVAL:watchdogInterval,
	KNOB_PER_BANK:knobPerBank,
	BANK:bankLength
} = conf;

const {
	STROB_DELAY:strobDebay,
	RECORD_COLOR:recordColor,
	REVERSE_COLOR:reverseColor,
	RESET_COLOR:resetColor,
	STORE_COLOR:storeColor,
	CLEAR_REC_COLOR:clearRecColor
} = conf.UI;

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
		this.currentBANK = 0;
		this.sideButtons = new SideButtons()
			.on("startRec", async event => {
				this.recorder.start();	
			})
			.on("stopRec", async event => {
				this.recorder.stop();	
			})
			.on("reverse", async event => {
				this.recorder.reverse();	
			})
			.on("nextBank", async event => {
					this.currentBANK ++;
					this.currentBANK %= bankLength;
					this.knobs.map(({id, color}) => this.changeColor(id, color));
					this.knobs.map(({id, _value}) => this.changeValue(id, _value));
			})
			.on("prevBank", async event => {
					this.currentBANK += bankLength-1;
					this.currentBANK %= bankLength;
					this.knobs.map(({id, color}) => this.changeColor(id, color));
					this.knobs.map(({id, _value}) => this.changeValue(id, _value));
			});

		this.knobs = new Knobs()
			.on("changeValue", ({target:{id, _value}}) => {
				this.changeValue(id, _value);
			})
			.on("pressed", async ({target:{id, color}}) => {
				this.recorder.removeAll(id);
				this.changeColor(id, color+clearRecColor);
				await wait(strobDebay);
				this.changeColor(id, color);
			})
			.on("storeValue", async ({target:{id, color}}) => {
				this.changeColor(id, storeColor);
				await wait(strobDebay);
				this.changeColor(id, color);
			})
			.on("resetValue", async ({target:{id, color}}) => {
				this.changeColor(id, resetColor);
				await wait(strobDebay);
				this.changeColor(id, color);
			})
			.on("created", ({target:{id, color}}) => {
				this.changeColor(id, color);
				this.changeValue(id, 64);
			});

		this.recorder = new Recorder()
			.plug(this.knobs)
			.on("reverse", async ()=>{
				this.knobs.map(({id}) => this.changeColor(id, reverseColor));
				await wait(strobDebay);
				this.knobs.map(({id, color}) => this.changeColor(id, color));
			})
			.on("startRec", async ()=>{
				this.knobs.map(({id}) => this.changeColor(id, recordColor));
			})
			.on("stopRec", async ()=>{
				this.knobs.map(({id, color})=> this.changeColor(id, color));
			})
			.on("playEvent", ({target:{knobId, value}})=>{
				this.knobs.getKnob(knobId).valueUnrecordable = value;
			});

		this.inputMidi = new midi.Input()
			.on('message', (deltaTime, [status, number, value]) => {
				const [type, channel] = [status & 0xF0 , status & 0x0F];
				// console.log(`c: ${channel} n: ${number} v: ${value} d: ${deltaTime}`);
				switch(type){
				case MIDI_MESSAGE.CONTROL_CHANGE : 
					if(channel == 0 || channel == 1){
						this.knobs.update(channel, number +knobPerBank * this.currentBANK, value, deltaTime);			
					}else if(channel == 3){
						this.sideButtons.update(number, value, deltaTime);			
					}
					break;
				}
			});

		this.outputDisplay = new midi.Output();
		this.outputVirtual = new midi.Output();

		const [inID, outID] = this.getMidiFighterTwisterID();
		if(inID < 0 || outID < 0)throw new Error(`MIDI_DEVICE (${midiName}) not found`);
		this.inputMidi.openPort(inID);
		this.outputDisplay.openPort(outID);
		this.outputVirtual.openVirtualPort(midiOutName);

		this.startAnim()	
	}

	async startAnim(){
		this.knobs.map(async ({id, color}, k)=>{
			this.changeIntensity(id, 0);
			this.changeColor(id, color);
			await wait(k * 150);
			(async()=>{
				for(let j = 0 ; j <= 1 ; j += 0.02){
					this.changeIntensity(id, j);
					await wait(5)
				}
			})();
		});
	}

	getMidiFighterTwisterID () {
		return [
			new Array(this.inputMidi.getPortCount()).fill(0).map((_, id)=>this.inputMidi.getPortName(id)).findIndex(value => midiName == value),
			new Array(this.outputDisplay.getPortCount()).fill(0).map((_, id)=>this.outputDisplay.getPortName(id)).findIndex(value => midiName == value)
		];
	}
	hasToBeDisplayed(knobID){
		const minKobID = this.currentBANK * knobPerBank;
		const maxKobID = this.currentBANK * knobPerBank + knobPerBank;
		return knobID >= minKobID &&  knobID < maxKobID;
	}
	changeValue(knobID, value){
		if(this.hasToBeDisplayed(knobID)){
			this.sendCC(this.outputDisplay, 0x00, knobID - knobPerBank * this.currentBANK, value);
		}

		this.sendCC(this.outputVirtual, 0x00, knobID, value);
		
	}
	changeColor(knobID, color){
		if(this.hasToBeDisplayed(knobID)){
			this.sendCC(this.outputDisplay, 0x01, knobID - knobPerBank * this.currentBANK, color % 128);
		}
	}

	changeIntensity(knobID, intensity){
		intensity = Math.min(Math.max(intensity, 0), 1);
		if(this.hasToBeDisplayed(knobID)){
			this.sendCC(this.outputDisplay, 0x02, knobID - knobPerBank * this.currentBANK, lerp(17, 49	, intensity));
		}
	}

	sendCC(output, channel, id, value){
		output.sendMessage([MIDI_MESSAGE.CONTROL_CHANGE|channel, id, value]);	
	}

	async watchdog(){
		const [inID, outID] = this.getMidiFighterTwisterID();
		if(inID < 0 || outID < 0)throw new Error(`MIDI_DEVICE (${midiName}) HAS BEEN DISCONNECTED`);
		await wait(1000);
		return this.watchdog();
	}
}

