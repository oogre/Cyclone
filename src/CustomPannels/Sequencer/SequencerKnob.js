/*----------------------------------------*\
  MFT - SequencerKnob.js
  @author Evrard Vincent (vincent@ogre.be)
  @Date:   2024-03-25 19:49:56
  @Last Modified time: 2024-04-02 19:50:04
\*----------------------------------------*/

import Recorder from "./CustomKnobs/Recorder.js";
import Player from "./CustomKnobs/Player.js";
import Pause from "./CustomKnobs/Pause.js";
import Stop from "./CustomKnobs/Stop.js";
import Button from "../../Bases/Button.js";


export default class SequencerKnob{
	constructor(knob, midiOut){
		this.recorder = new Recorder(knob, midiOut);
		this.player = new Player(knob, midiOut);
		this.pause = new Pause(knob, midiOut);
		this.stop = new Stop(knob, midiOut);
		this.value = 0;
		this.current = this.stop;
		knob.onPressed(() => {
					this.current = this.recorder;
				})
				.onReleased(releasedType => {
					if(releasedType == Button.RELEASED_TYPE.DOUBLE){
						knob.value = this.value = 0;
						return this.current = this.stop;
					}else if(this.recorder.isValid()){
						this.player.band = this.recorder.band;
						return this.current = this.player;
					}else if(this.previous == this.player){
						return this.current = this.pause;
					}else if(this.previous == this.pause){
						return this.current = this.player;
					}
					this.current = this.stop;
				})
				.onTurn(inc => {
					this.value = (this.value + inc + 128) % 128;
					knob.value = this.value;
					if(this.current == this.recorder){
						this.current.record("change", this.value);
					}
					midiOut(knob.id, knob.value);
				});
	}
	set order(value){
		this.player.order = value;
	}
	set speed(value){
		this.player.speed = value;
	}
	set current(value){
		if(this._current != value){
			if(!!this._current){
				this._current.disactive();
				this._previous = this._current;
			}
			this._current = value;
			this._current.active();
		}
	}
	set color (value){
		this.stop.color = value;
	}
	get current (){
		return this._current;
	}
	get previous (){
		return this._previous;
	}
	onStop(handler){
		this.stop.onChange(handler);
		return this;
	}
}