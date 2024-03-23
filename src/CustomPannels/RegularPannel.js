/*----------------------------------------*\
  MFT - RegularPannel.js
  @author Evrard Vincent (vincent@ogre.be)
  @Date:   2024-03-23 21:18:05
  @Last Modified time: 2024-03-23 21:30:12
\*----------------------------------------*/

import Pannel from '../Bases/Pannel.js';

export default class RegularPannel extends Pannel{
	constructor(...params){
		super(...params);
		this.knobs.map((knob) => {
			knob.onTurn((knob, inc) => knob.value = (knob.value + inc + 128) % 128)
				.onPressed((knob) => console.log("Pressed"))
				.onReleased((knob) => console.log("Released"))
				.onLongClick((knob) => console.log("LongClick"))
				.onDoubleClick((knob) => console.log("DoubleClick"));
		});
	}
}