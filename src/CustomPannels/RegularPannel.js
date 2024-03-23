/*----------------------------------------*\
  MFT - RegularPannel.js
  @author Evrard Vincent (vincent@ogre.be)
  @Date:   2024-03-23 21:18:05
  @Last Modified time: 2024-03-24 00:17:33
\*----------------------------------------*/

import Pannel from '../Bases/Pannel.js';

export default class RegularPannel extends Pannel{
	constructor(id, midiDisplay, midiOut){
		super(id, midiDisplay);
		this.knobs.map( knob => {
			knob.onTurn( inc => {
				knob.value = (knob.value + inc + 128) % 128;
				midiOut(knob.id, knob.value)
			});
		});
	}
}