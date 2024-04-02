/*----------------------------------------*\
  MFT - Speeder.js
  @author Evrard Vincent (vincent@ogre.be)
  @Date:   2024-03-25 19:46:30
  @Last Modified time: 2024-04-02 19:50:37
\*----------------------------------------*/

import {constrain} from "../../../common/tools.js";

export default class Stop{
	constructor(knob, midiOut){
		this.knob = knob;
		this._color = [0, 0, 255];
		this.changeHandler = ()=>{};
	}

	disactive(){
	}

	set color(value){
		this._color = value;
		this.knob.color = this._color;	
	}
	async active(){
		this.knob.color = this._color;
		this.changeHandler();
		return this;
	}
	onChange(handler){
		this.changeHandler = handler;
		return this;
	}
}