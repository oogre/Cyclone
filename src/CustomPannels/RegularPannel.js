/*----------------------------------------*\
  MFT - RegularPannel.js
  @author Evrard Vincent (vincent@ogre.be)
  @Date:   2024-03-23 21:18:05
  @Last Modified time: 2024-04-02 20:02:14
\*----------------------------------------*/

import Pannel from '../Bases/Pannel.js';

import conf from "../common/config.js";

import Button from "../Bases/Button.js";


export default class RegularPannel extends Pannel{
	constructor(id, midiDisplay, midiOut){
		super(id, midiDisplay);
		const COLOR = conf.PANNELS[id].COLOR
		this.knobs.map( knob => {
			knob.color = COLOR;
			knob.onTurn( inc => {
				knob.value = (knob.value + inc + 128) % 128;
				midiOut(knob.id, knob.value)
			})
			.onReleased( (releasedType) => {
				if(releasedType == Button.RELEASED_TYPE.DOUBLE){
					knob.value = 0;
					midiOut(knob.id, knob.value)
				}
			});
		});
	}
}