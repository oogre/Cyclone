/*----------------------------------------*\
  midiFighter - Player.js
  @author Evrard Vincent (vincent@ogre.be)
  @Date:   2023-02-21 14:27:31
  @Last Modified time: 2023-02-22 02:03:34
\*----------------------------------------*/

import {wait} from "./common/tools.js";
import EventHandler from "./common/EventHandler.js";

class Interval{
	constructor(name, min, max, value){
		this.name = name;
		this.min = min;
		this.max = max;
		this.value = value;
	}
	isInside(other){
		return this.min <= other && other <= this.max;
	}
}

export default class Player extends EventHandler {
	constructor(){
		super();
		super.createHandler("tic");
		super.createHandler("play");
		super.createHandler("stop");
		super.createHandler("pause");

		super.createHandler("pmChange");
		this._track = [];
		this._trackArchive = [];
		this._timeScale = 1;
		this._playMode = Player.NORMAL;
		this.isPlaying = false;
		this.stopAsked = false;
	}

	set timeScale(val){
		let tmp = 128-val;
		if(tmp < 64){
			tmp = Math.sqrt(tmp*0.015625)
		}else{
			tmp = (tmp-64)*0.015625;
			tmp = (tmp * tmp * 9) + 1
		}
		this._timeScale = Math.min(Math.max(tmp, 0.1), 10);
	}

	set playMode(val){
		if(this._playMode!=Player.NORMAL && Player.NORMAL.isInside(val)){
			this._playMode = Player.NORMAL;
			this._track = [...this._trackArchive];
			this.trig("pmChange", this);
		}else if(this._playMode!=Player.REVERSE && Player.REVERSE.isInside(val)){
			this._playMode = Player.REVERSE;
			this._track = [...this._trackArchive].reverse();
			this.trig("pmChange", this);
		}else if(this._playMode!=Player.PING_PONG && Player.PING_PONG.isInside(val)){
			this._playMode = Player.PING_PONG;
			this._track = [...this._trackArchive, ...[...this._trackArchive].reverse()];
			this.trig("pmChange", this);
		}else if(this._playMode!=Player.RANDOM && Player.RANDOM.isInside(val)){
			this._playMode = Player.RANDOM;
			this._track = [...this._trackArchive].sort((a, b) => 0.5 - Math.random());
			this.trig("pmChange", this);
		}
	}

	get playMode(){
		return this._playMode.value;
	}

	set track(val){
		this._track = val;
		this._trackArchive = [...this._track];
		this.play();
	}

	get track(){
		this._track;
	}

	async loop(){
		if(!this.isPlaying) return;
		try{
			let {value, delay} = this._track[0];
			if(delay > 0){
				await wait(delay * this._timeScale);
			}
			super.trig("tic", {value});

			switch(this._playMode){
				case Player.RANDOM:
					if(Math.random() < 0.1){
						this._track.sort((a, b) => 0.5 - Math.random());	
					}
				case Player.NORMAL:
				case Player.PING_PONG:
				case Player.REVERSE:
					this._track.push(this._track.shift());
				break;
			}

			if(this.stopAsked){
				this.stopAsked = false;
				this._track.length = 0;
    		this._trackArchive.length = 0;
			}

			if(this.isPlaying){
				await this.loop();	
			}
		}catch(error){
			this.pause();
		}
	}

	get isLoaded(){
		return this._track.length > 0;
	}

  stop(){
    super.trig("stop");
    this.isPlaying = false;
    this._track.length = 0;
    this._trackArchive.length = 0;
    this.stopAsked = true;
  }

	pause(){
    super.trig("pause");
		this.isPlaying = false;
	}

	play(){
    super.trig("play");
		this.isPlaying = true;
		this.loop();
	}

	static NORMAL = new Interval("NORMAL", 0, 31, 1);
	static REVERSE = new Interval("REVERSE",32, 63, 40);
	static PING_PONG = new Interval("PING_PONG", 64, 95, 86);
	static RANDOM = new Interval("RANDOM", 96, 127, 127);
}

