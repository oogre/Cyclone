/*----------------------------------------*\
  cyclone - Pannel.js
  @author Evrard Vincent (vincent@ogre.be)
  @Date:   2024-03-22 10:11:07
  @Last Modified time: 2024-03-24 00:17:09
\*----------------------------------------*/
import Knob from "./Knob.js";
import OSC from "./OscHelper.js";
import conf from "../common/config.js";

const {
  KNOB_PER_BANK:knobPerPannel,
} = conf;

export default class Pannel{
	constructor(id, ...params){
		this._id = id;
		this._active = false;
		this.knobs = new Array(knobPerPannel).fill(0).map((_, id) => {
				return new Knob(id, ...params)
					.onTurn( inc => console.log("Turn") )
					.onPressed( () => console.log("Pressed") )
					.onReleased( () => console.log("Released") )
					.onLongClick( () => console.log("LongClick") )
					.onDoubleClick( () => console.log("DoubleClick") );
		});
	}
	onCC(channel, number, value, deltaTime){
		const knob = this.knobs[number];
		if(!knob)return;
		const action = knob.getAction(channel);
		if(!action)return;
		action(value, deltaTime);
	}
	set enable(value){
		this._active = !!value;
		this.knobs.map(k=>k.enable = this._active)
	}
	
	get enable(){
		return this._active;
	}
	
}