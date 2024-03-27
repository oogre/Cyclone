/*----------------------------------------*\
  MFT - Speeder.js
  @author Evrard Vincent (vincent@ogre.be)
  @Date:   2024-03-25 19:46:30
  @Last Modified time: 2024-03-26 16:15:17
\*----------------------------------------*/

import {constrain} from "../../../common/tools.js";

export default class Pause{
	constructor(knob, midiOut){
		this.knob = knob;
		this.color = [0, 255, 255];
	}

	disactive(){
		
	}
	async active(){
		this.knob.color = this.color;
		
		return this;
	}
}