/*----------------------------------------*\
  MFT - Player.js
  @author Evrard Vincent (vincent@ogre.be)
  @Date:   2024-03-25 20:02:30
  @Last Modified time: 2024-03-26 16:34:34
\*----------------------------------------*/
import {wait, sigmoid, lerp} from "../../../common/tools.js";

export default class Player{
	constructor(knob, midiOut){
		this.knob = knob;
		this.midiOut = midiOut;
		this.color = [0, 255, 255];
		this._masterBand = [];
		this._band = [];
		this._timeScale = 1;
		this._hasToStop == null;
		this._order;
		this._resetWait = new Promise( resolve => this._goNext = resolve);
	}

	async disactive(){
		this.knob.strobTag = 0.0;
		this.askToStop();
	}
	async active(){
		this.knob.strobTag = 0.5;
		this.knob.color = this.color;
		this.play();
		return this;
	}
	async play(){
		if(this._band.length < 1)return;
		const current = this._band[0];
		const next = this._band[1%this._band.length];
		if(current && next){
			this.knob.value = current.value;
			this.midiOut(this.knob.id, this.knob.value);
			this._band.push(this._band.shift());
			await Promise.any([this._resetWait, wait(Math.abs(next.time - current.time) * this._timeScale)]);
		}
		if(this._hasToStop != null) {
			this._hasToStop();
			this._hasToStop = null;
		}else{
			this.play();	
		}
	}
	async askToStop(){
		await new Promise((resolve, reject)=>{
			this._hasToStop = resolve;
		});
	}
	set order (value){
		this._order = value;
		this.band = this._masterBand;
	}
	set speed (value){
		const cursor = sigmoid((value/127) * 12 - 6) * 2 - 1
		if(cursor < 0)this._timeScale = lerp(1, 0.1, Math.abs(cursor));
		else this._timeScale = lerp(1, 10, Math.abs(cursor));
		this._goNext();
		this._resetWait = new Promise( resolve => this._goNext = resolve);
	}
	set band(value){
		this._masterBand = [...value];
		this._band = this._order.develop(value)
	}
}