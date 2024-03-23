/*----------------------------------------*\
  cyclone - Knob.js
  @author Evrard Vincent (vincent@ogre.be)
  @Date:   2024-03-21 15:11:59
  @Last Modified time: 2024-03-24 00:15:52
\*----------------------------------------*/
import Pixel from "./Pixel.js";
import Button from "./Button.js";
import {MultiHeritage} from "../common/tools.js"

const getTime = ()=>(new Date()).getTime();


export default class Knob extends MultiHeritage.inherit(Pixel, Button) {
	constructor (...params){
		super(...params);
		this.turnHandler=()=>{};
		this.actions = {
			channel_0 : value =>this.turnHandler(value-64),
			channel_1 : value =>this.update(value)
		}
	}

	getAction(channel){
		return this.actions[`channel_${channel}`];
	}

	onTurn(handler){
		this.turnHandler = handler;
		return this;
	}
	
}