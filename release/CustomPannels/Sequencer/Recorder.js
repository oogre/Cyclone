// /*----------------------------------------*\
//   MFT - Recorder.js
//   @author Evrard Vincent (vincent@ogre.be)
//   @Date:   2024-03-25 00:46:20
//   @Last Modified time: 2024-03-26 11:10:11
// \*----------------------------------------*/

// import {getTime, wait, capitalize} from "../../common/tools.js";

// export default class Recorder {
// 	static STATES = {
// 		stop : 0,
// 		record : 1,
// 		play : 2,
// 		pause : 3
// 	};
// 	Recorder.STATES.includes = value => Object.values(Recorder.STATES).includes(value);
// 	Recorder.STATES.toString = () => `{${Object.keys(Recorder.STATES).map(key=>`${key} : ${Recorder.STATES[key]}`).join(", ")}}` ;
// 	set state(value){
// 		if(!Recorder.STATES.includes.includes(value))throw new Error(`Recorder : try set state to unknown (${value}) accepted : ${Recorder.STATES.toString()} `);
// 		if(this._state == value)return;
// 		const stateName = Object.keys(Recorder.STATES)[value];
// 		this._old_state = this._state;
// 		this._state = value;
// 		this[`on${capitalize(stateName)}`]();
// 	}

// 	get state(){
// 		return this._state;
// 	}

// 	get isStopping(){
// 		return this._state == Recorder.STATES.stop;
// 	}
// 	get isRecording(){
// 		return this._state == Recorder.STATES.record;
// 	}
// 	get isPlaying(){
// 		return this._state == Recorder.STATES.play;
// 	}
// 	get isPlausing(){
// 		return this._state == Recorder.STATES.pause;
// 	}

// 	get wasStopping(){
// 		return this._old_state == Recorder.STATES.stop;
// 	}
// 	get wasRecording(){
// 		return this._old_state == Recorder.STATES.record;
// 	}
// 	get wasPlaying(){
// 		return this._old_state == Recorder.STATES.play;
// 	}
// 	get wasPlausing(){
// 		return this._old_state == Recorder.STATES.pause;
// 	}

// 	async onStop(){
// 		console.log("onStop");
// 		this.knob.color = [0, 64, 255];
// 		// knob.color = [255, 255, 0];
// 		await this.askToStop();
// 	}
// 	onPlay(){
// 		console.log("onPlay");
// 		this.knob.color = [0, 64, 255];

// 		this.playBand = this._order.develop(this.masterBand.length>1 ? this.masterBand : this.oldBand);
// 		this.oldBand = [...this.masterBand];
// 		this.masterBand.length = 0 ;
// 		console.log(this.playBand);
// 		this.play();
// 	}
// 	async onPause(){
// 		console.log("onPause");
// 		await this.askToStop();
// 		this.knob.color = [0, 255, 255];
// 	}
// 	onRecord(){
// 		console.log("onRecord");
// 		this.knob.color = [255, 0, 0];
// 		// this.oldBand = [...this.masterBand];
// 		// this.masterBand.length = 0 ;
// 		this.record("start", this.knob.value);
// 	}
// 	constructor(knob, midiOut){

// 		this.knob = knob;
// 		this.midiOut = midiOut;
// 		this._old_state;
// 		this.state = Recorder.STATES.stop;

// 		this.hasToStop = null;

// 		this.band = [];
// 		this._order;
// 		this.oldBand = []; 	 // to recover if master is empty so set play/pause by simple click
// 		this.masterBand = []; // the record is apply on this
// 		this.playBand = []; 	 // this is a copy of the master to play with order functionnality
// 		this._timeScale = 1;

// 		knob.onPressed( async () => {
// 				this.state = Recorder.STATES.record;
// 				// this.isRecording = true;
// 				// knob.color = [255, 0, 0];
// 				// this.isPlaying && await this.askToStop();
// 				// this.oldBand = [...this.masterBand];
// 				// this.masterBand.length = 0 ;
// 				// this.record("start", knob.value);
// 		})
// 		.onReleased( () => {
// 			if(this.masterBand.length == 1 && this.wasPlaying){
// 				this.state = Recorder.STATES.pause;
// 			}else{
// 				this.state = Recorder.STATES.play;	
// 			}

// 			// this.isRecording = false;
// 			// knob.color = [0, 64, 255];
// 			// this.record("stop", knob.value);

// 			// this.playBand = this._order.develop(this.masterBand);
// 			// this.play();
// 			// this.isPlaying = true;
// 		})
// 		.onDoubleClick(async ()=>{
// 			this.state = Recorder.STATES.stop;
// 			// knob.color = [255, 255, 0];
// 			// this.isPlaying && await this.askToStop();
// 			// this.oldBand = [...this.masterBand];
// 			// this.masterBand.length = 0 ;
// 			// knob.color = [0, 64, 255];
// 		})
// 		.onTurn( inc => {
// 			knob.value = (knob.value + inc + 128) % 128;
// 			this.isRecording && this.record("change", knob.value);
// 			midiOut(knob.id, knob.value)
// 		});

// 	}
// 	record(name, value){
// 		this.masterBand.push({
// 			eventName : name, 
// 			time : getTime(),
// 			value : value
// 		});
// 	}

// 	async play(){
// 		this.knob.strobTag = 0.5;
// 		const current = this.playBand[0];
// 		const next = this.playBand[1%this.playBand.length];
// 		if(current && next){
// 			this.knob.value = current.value;
// 			this.midiOut(this.knob.id, this.knob.value);
// 			this.playBand.push(this.playBand.shift());
// 			await wait((next.time - current.time) * this._timeScale);
// 		}else if(this.hasToStop == null){
// 			this.state = Recorder.STATES.stop;
// 		}
// 		if(this.hasToStop != null) {
// 			this.knob.strobTag = 0.0;
// 			this.hasToStop();
// 			this.hasToStop = null;
// 		}else{
// 			this.play();	
// 		}
// 	}
// 	async askToStop(){
// 		await new Promise((resolve, reject)=>{
// 			this.hasToStop = resolve;
// 		});
// 	}
// 	set order(value){
// 		this._order = value;
// 	}
// 	get order(){
// 		return this._order;
// 	}
// 	set speed(value){
// 		let tmp = 128-value;
// 		if(tmp < 64){
// 			tmp = Math.pow(tmp*0.015625, 5)
// 		}else{
// 			tmp = (tmp-64)*0.015625;
// 			tmp = (tmp * tmp * 9) + 1
// 		}
// 		this._timeScale = Math.min(Math.max(tmp, 0.1), 10);
// 	}
// }
"use strict";