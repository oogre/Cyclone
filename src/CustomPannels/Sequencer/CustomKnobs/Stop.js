/*----------------------------------------*\
  MFT - Speeder.js
  @author Evrard Vincent (vincent@ogre.be)
  @Date:   2024-03-25 19:46:30
  @Last Modified time: 2024-03-26 16:22:36
\*----------------------------------------*/

import {constrain} from "../../../common/tools.js";

export default class Stop{
	constructor(knob, midiOut){
		this.knob = knob;
		this.color = [0, 0, 255];
		this.changeHandler = ()=>{};
	}

	disactive(){
	}

	async active(){
		this.knob.color = this.color;
		this.changeHandler();
		return this;
	}
	onChange(handler){
		this.changeHandler = handler;
		return this;
	}
}