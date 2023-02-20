/*----------------------------------------*\
  midiFighter - Knobs.js
  @author Evrard Vincent (vincent@ogre.be)
  @Date:   2023-02-15 16:23:06
  @Last Modified time: 2023-02-20 21:52:47
\*----------------------------------------*/

import EventHandler from "./common/EventHandler.js";
import RecordableKnob from "./RecordableKnob.js";
import conf from "./common/config.js";

const {
	BANK:bankLenght,
	KNOB_PER_BANK:knobPerBank
} = conf;

const {
	STROB_DELAY:strobDebay,
	RECORD_COLOR:recordColor,
	REVERSE_COLOR:reverseColor
} = conf.UI;

export default class Knobs extends EventHandler {
	constructor(){
		super();
		super.createHandler("changeValue");
		super.createHandler("pressed");
		super.createHandler("released");
		super.createHandler("resetValue");
		super.createHandler("storeValue");
		super.createHandler("created");
		super.createHandler("startRec");
		super.createHandler("stopRec");
		super.createHandler("startTS");
		super.createHandler("stopTS");
		
		this.knobs = new Array(knobPerBank * bankLenght).fill(0).map((_, k)=>{
			return new RecordableKnob(k)
				.on("*", (event)=> {
					super.trig(event.eventName, event.target);
				});
		});
	}
	getKnob(id){
		id = Math.abs(id);
		id %= this.knobs.length;
		return this.knobs[id % this.knobs.length];
	}

	getKnobByMidiAddress(midiNumber){
		return this.getKnob(Math.floor(Math.abs(midiNumber)))
	}

	map(action){
		return this.knobs.map(action);
	}

	update(channel, midiNumber, value){
		const isSwitch = channel == 1;
		const knob = this.getKnobByMidiAddress(midiNumber);
		
		if(isSwitch){
			if(value == 127){
				knob.pressed = true;	
			}
			else if(value == 0){
				knob.pressed = false;
			}
		}else{
			if(value == 63){
				knob.decrease();	
			}
			else if(value == 65){
				knob.increase();	
			}	
		}
	}
}