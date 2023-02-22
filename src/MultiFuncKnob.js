/*----------------------------------------*\
  midiFighter - MultiFuncKnob.js
  @author Evrard Vincent (vincent@ogre.be)
  @Date:   2023-02-20 22:05:35
  @Last Modified time: 2023-02-22 20:04:27
\*----------------------------------------*/

import Button from "./Button.js";
import Value from "./Value.js";
import Display from "./Display.js";
import EventHandler from "./common/EventHandler.js";
import Recorder from "./Recorder.js";
import Player from "./Player.js";
import conf from "./common/config.js";

const {
	BANK:bankLenght,
	KNOB_PER_BANK:knobPerBank,
	VIRTUAL_MIDI_CONTROL_CHANNEL:CONTROL_CHANNEL
} = conf;

const {
	KNOB_COLORS:knobColors
} = conf.UI;

export default class MultiFuncKnob extends EventHandler {
	constructor(id, value = 0, displaySender, virtualMidiSender){
		super();
		this.id = id;
		this._mode = null;
		this.virtualMidiSender = (channel, value)=>{
			virtualMidiSender(channel, id, value);
		};
		this.display = new Display((channel, value)=>{
			displaySender(channel, id, value);
		});
		this.value = new Value(value)
			.on("change", ({target:{_value:value}})=>{
				this.virtualMidiSender(CONTROL_CHANNEL, value);
				switch(this.mode){
					case MultiFuncKnob.MODES.RECORD : 
					case MultiFuncKnob.MODES.DEFAULT : 
						this.display.value = value;
						break;
				}
			})
			.on("reset", ()=>{
				switch(this.mode){
					case MultiFuncKnob.MODES.RECORD : 
					case MultiFuncKnob.MODES.DEFAULT :  
						this.display.anims.reset();
						break;
				}
			})
			.on("store", ()=>{
				switch(this.mode){
					case MultiFuncKnob.MODES.RECORD : 
					case MultiFuncKnob.MODES.DEFAULT :  
						this.display.anims.store();
						break;
				}
			});
		this.timeScale = new Value(64, false)
			.on("change", ({target:{_value:value}})=>{
				this.player.timeScale = value;
				switch(this.mode){
					case MultiFuncKnob.MODES.TIMESCALE : 
						this.display.value = value;
						
						break;
				}
			})
			.on("reset", ()=>{
				switch(this.mode){
					case MultiFuncKnob.MODES.TIMESCALE : 
						this.display.anims.reset();
						break;
					default : 
						break;
				}
			});

		this.playMode = new Value(0)
			.on("change", ({target:{_value:value}})=>{
				this.player.playMode = value;
				switch(this.mode){
					case MultiFuncKnob.MODES.PLAYMODE : 
						this.display.value = this.player.playMode;
						break;
				}
			})
			.on("reset", ()=>{
				switch(this.mode){
					case MultiFuncKnob.MODES.PLAYMODE : 
						this.display.anims.reset();
						break;
				}
			});
		this.btn = new Button(this.id)
			.on("doublePressed", () => {
				switch(this.mode){
					case MultiFuncKnob.MODES.RECORD : 
					case MultiFuncKnob.MODES.DEFAULT :  
						this.value.resetValue();
						break;
				}
			})
			.on("longPressed", () => {
				switch(this.mode){
					case MultiFuncKnob.MODES.DEFAULT : 
						if(this.player.isPlaying){
							this.player.stop();
						}else{
							this.value.resetInitValue();	
						}
						break;
				}
			})
			.on("released", () => {
				switch(this.mode){
					case MultiFuncKnob.MODES.DEFAULT : 
						if(this.player.isPlaying){
							this.player.pause()
						}else{
							this.player.play()
						}
						break;
				}
			});
		this.player = new Player()
			.on("tic", ({target:{value}}) => {
				this.virtualMidiSender(CONTROL_CHANNEL, value);
				switch(this.mode){
					case MultiFuncKnob.MODES.DEFAULT :  
						this.display.value = value;
						break;
				}
			})
			.on("stop", () => {
				this.display.anims.reset();
			})
			.on("pmChange", ({target:{_playMode:{name}}}) => {
				this.display.anims.playMode[name]()
				.then(()=>{
					this.display.value = this.player.playMode;
				});
			});

		this.recorder = new Recorder(this.value)
			.on("newRecord", ({target:{record}}) => {
				this.player.playMode = this.playMode.value = 0;
				this.player.timeScale = this.timeScale.value = 64;
				this.player.track = record;
				this.player.play();
			});
	}

	set mode(value){
		switch(value){
			case MultiFuncKnob.MODES.PLAYMODE : 
				if(!this.player.isLoaded) return;
				this._mode = value;
				this.display.stateColor = 60;
				this.display.anims.playMode[this.player._playMode.name]()
					.then(()=>this.display.value = this.player.playMode);
			break;

			case MultiFuncKnob.MODES.RECORD : 
				if(this.player.isLoaded) return;
				if(this._mode == MultiFuncKnob.MODES.DEFAULT){
					this.recorder.startRecord();
				}
				this._mode = value;
				this.display.stateColor = 80;	
			break;

			case MultiFuncKnob.MODES.TIMESCALE : 
				if(!this.player.isLoaded) return;
				this._mode = value;
				this.display.stateColor = 100;
				this.display.value = this.timeScale.value;	
			break;

			case MultiFuncKnob.MODES.DEFAULT : 
				if(this._mode == null){
					this.display.displayIntensity(0);
					this.display.stateColor = 115;
					this.display.anims.fadeIn(this.id * 20);
				}
				if(!this.player.isLoaded && this._mode == MultiFuncKnob.MODES.RECORD){
					this.recorder.stopRecord();
				}
				this._mode = value;
				this.display.value = 0;
				this.display.stateColor = 120;
				this.display.displayIntensity(1);
				this.display.value = this.value.value;
				break;
		}
	}

	get mode(){
		return this._mode;
	}

	update(channel, value){
		const isSwitch = channel == 1;
		switch(this.mode){

			case MultiFuncKnob.MODES.PLAYMODE : 
				if(isSwitch)
					this.playMode.resetValue();
				else if( Value.INC_VALUE == value )
					this.playMode.increase();
				else if( Value.DEC_VALUE == value )
					this.playMode.decrease();
				break;

			case MultiFuncKnob.MODES.TIMESCALE : 
				if(isSwitch)
					this.timeScale.resetValue();
				else if( Value.INC_VALUE == value )
					this.timeScale.increase();
				else if( Value.DEC_VALUE == value )
					this.timeScale.decrease();
				break;

			case MultiFuncKnob.MODES.RECORD : 
			case MultiFuncKnob.MODES.DEFAULT : 
				if(isSwitch)
					this.btn.pressed = Button.PRESS_VALUE == value;	
				else if( Value.INC_VALUE == value )
					this.value.increase();
				else if( Value.DEC_VALUE == value )
					this.value.decrease();
				break;

		}
	}

	static MODES = Object.freeze({
		DEFAULT:   Symbol("DEFAULT"),
		RECORD:    Symbol("RECORD"),
		TIMESCALE: Symbol("TIMESCALE"),
		PLAYMODE: Symbol("PLAYMODE")
	});

	setup({id, mode, value, timeScale, playMode, player}){

		this.id = id;
		this.value.setup(value);
	
		this.player.setup(player);	
		this.playMode.setup(playMode);
		this.timeScale.setup(timeScale);
		
		this.mode = MultiFuncKnob.MODES[mode];
	}

	toObject(){
		return {
			id : this.id,
			mode : this._mode.description,
			value : this.value.toObject(),
			timeScale : this.timeScale.toObject(),
			playMode : this.playMode.toObject(),
			player : this.player.toObject()
		}
	}
}
