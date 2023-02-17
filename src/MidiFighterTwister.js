/*----------------------------------------*\
  midiFighter - MidiFighterTwister.js
  @author Evrard Vincent (vincent@ogre.be)
  @Date:   2023-02-15 16:35:32
  @Last Modified time: 2023-02-17 01:28:28
\*----------------------------------------*/
import midi from 'midi';
import EventHandler from "./common/EventHandler.js";
import Knobs from "./Knobs.js";
import SideButtons from "./SideButtons.js";
import Recorder from "./Recorder.js";
import {wait} from "./common/tools.js";
import conf from "./common/config.js";


const {
	MIDI_DEVICE_NAME:midiName, 
	VIRTUAL_MIDI_DEVICE_NAME:midiOutName
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

		this.sideButtons = new SideButtons()
			.on("startRec", async event => {
				this.recorder.start();	
			})
			.on("stopRec", async event => {
				this.recorder.stop();	
			})
			.on("reverse", async event => {
				this.recorder.reverse();	
			});

		this.knobs = new Knobs()
			.on("changeValue", ({target:{id, _value}}) => {
				this.changeValue(id, _value);
			})
			.on("pressed", async ({target:{id, color}}) => {
				this.recorder.removeAll(id);
				this.changeColor(id, clearRecColor);
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
				this.changeValue(id, color);
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
				switch(type){
				case MIDI_MESSAGE.CONTROL_CHANGE : 
					// console.log(`c: ${channel} n: ${number} v: ${value} d: ${deltaTime}`);
					if(channel == 0){
						this.knobs.update(number, value, deltaTime);			
					}else if(channel == 3){
						this.sideButtons.update(number, value, deltaTime);			
					}
					break;
				}
			});

		this.outputDisplay = new midi.Output();
		this.outputVirtual = new midi.Output();

		const [inID, outID] = this.getMidiFighterTwisterID();
		this.inputMidi.openPort(inID);
		this.outputDisplay.openPort(outID);
		this.outputVirtual.openVirtualPort(midiOutName);
	}
	getMidiFighterTwisterID () {
		return [
			new Array(this.inputMidi.getPortCount()).fill(0).map((_, id)=>this.inputMidi.getPortName(id)).findIndex(value => midiName == value),
			new Array(this.outputDisplay.getPortCount()).fill(0).map((_, id)=>this.outputDisplay.getPortName(id)).findIndex(value => midiName == value)
		];
	}
	changeValue(knobID, value){
		this.sendCC(this.outputVirtual, knobID, value);
		this.sendCC(this.outputDisplay, knobID * 2 + 1, value);
	}
	changeColor(knobID, color){
		this.sendCC(this.outputDisplay, knobID * 2, color);
	}
	sendCC(output, id, value){
		output.sendMessage([MIDI_MESSAGE.CONTROL_CHANGE|0x00, id, value]);	
	}
}

