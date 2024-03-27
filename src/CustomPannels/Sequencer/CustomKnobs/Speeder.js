/*----------------------------------------*\
  MFT - Speeder.js
  @author Evrard Vincent (vincent@ogre.be)
  @Date:   2024-03-25 19:46:30
  @Last Modified time: 2024-03-26 16:35:04
\*----------------------------------------*/

import {constrain} from "../../../common/tools.js";

export default class Speeder{
	constructor(knob, midiOut){
		this.reset();
		this.knob = knob;
		this.color = [255, 0, 255];
		this.onTurn = (inc) => {
			this.value = constrain(0, 128, this.value + inc);
			this.knob.value = this.value;
			midiOut(this.knob.id, this.knob.value);
			this.changeHandler(this.knob.value);
		};
		this.changeHandler = ()=>{};
	}

	reset(){
		this.value = 64;
		this.changeHandler && this.changeHandler(this.value);
	}

	disactive(){
		
	}
	async active(){
		this.knob.value = this.value;
		this.knob.color = this.color;
		this.knob.onTurn(this.onTurn);
		return this;
	}
	onChange(handler){
		this.changeHandler = handler;
		return this;
	}
}