/*----------------------------------------*\
  midiFighter - MultiFuncKnob.js
  @author Evrard Vincent (vincent@ogre.be)
  @Date:   2023-02-20 22:05:35
  @Last Modified time: 2023-02-21 00:50:00
\*----------------------------------------*/

import Button from "./Button.js";
import Value from "./Value.js";
import Display from "./Display.js";
import EventHandler from "./common/EventHandler.js";

import {lerp} from "./common/tools.js";
import conf from "./common/config.js";

const {
	BANK:bankLenght,
	KNOB_PER_BANK:knobPerBank
} = conf;

const {
	KNOB_COLORS:knobColors
} = conf.UI;

export default class MultiFuncKnob extends EventHandler {
	constructor(id, value = 0, displaySender){
		super();
		this.id = id;
		this.display = new Display((channel, value)=>{
			displaySender(channel, id, value);
		});
		this._mode = MultiFuncKnob.MODES.DEFAULT;
		this.btn = new Button(this.id)
			.on("doublePressed", () => {
				switch(this.mode){
				case MultiFuncKnob.MODES.RECORD : 
					break;
				case MultiFuncKnob.MODES.PLAY : 
					break;
				case MultiFuncKnob.MODES.TIMESCALE : 
					break;
				default : 
					this.value.resetValue();
					break;
				}
			})
			.on("longPressed", () => {
				switch(this.mode){
				case MultiFuncKnob.MODES.RECORD : 
					break;
				case MultiFuncKnob.MODES.PLAY : 
					break;
				case MultiFuncKnob.MODES.TIMESCALE : 
					break;
				default : 
					this.value.resetInitValue();
					break;
				}
			});

		this.value = new Value(value)
			.on("change", ({target})=>{
				switch(this.mode){
				case MultiFuncKnob.MODES.RECORD : 
					break;
				case MultiFuncKnob.MODES.PLAY : 
					break;
				case MultiFuncKnob.MODES.TIMESCALE : 
					break;
				default : 
					this.display.value = target._value;
					break;
				}
			})
			.on("reset", ()=>{
				switch(this.mode){
				case MultiFuncKnob.MODES.RECORD : 
					break;
				case MultiFuncKnob.MODES.PLAY : 
					break;
				case MultiFuncKnob.MODES.TIMESCALE : 
					break;
				default : 
					this.display.anims.reset();
					break;
				}
			})
			.on("store", ()=>{
				switch(this.mode){
				case MultiFuncKnob.MODES.RECORD : 
					break;
				case MultiFuncKnob.MODES.PLAY : 
					break;
				case MultiFuncKnob.MODES.TIMESCALE : 
					break;
				default : 
					this.display.anims.store();
					break;
				}
			});

		this.timeScale = new Value(64, false)
			.on("change", ({target})=>{
				switch(this.mode){
				case MultiFuncKnob.MODES.RECORD : 
					break;
				case MultiFuncKnob.MODES.PLAY : 
					break;
				case MultiFuncKnob.MODES.TIMESCALE : 
					this.display.value = target._value;
					break;
				default : 
					break;
				}
			})
			.on("reset", ()=>{
				switch(this.mode){
				case MultiFuncKnob.MODES.RECORD : 
					break;
				case MultiFuncKnob.MODES.PLAY : 
					break;
				case MultiFuncKnob.MODES.TIMESCALE : 
					this.display.anims.reset();
					break;
				default : 
					break;
				}
			})
			.on("store", ()=>{
				switch(this.mode){
				case MultiFuncKnob.MODES.RECORD : 
					break;
				case MultiFuncKnob.MODES.PLAY : 
					break;
				case MultiFuncKnob.MODES.TIMESCALE : 
					break;
				default : 
					break;
				}
			});
	}

	set mode(value){
		switch(value){
		case MultiFuncKnob.MODES.RECORD : 
			this._mode = MultiFuncKnob.MODES.RECORD;
			this.display.stateColor = 80;
			break;
		case MultiFuncKnob.MODES.PLAY : 
			this._mode = MultiFuncKnob.MODES.PLAY;
			break;
		case MultiFuncKnob.MODES.TIMESCALE : 
			this._mode = MultiFuncKnob.MODES.TIMESCALE;
			this.display.stateColor = 100;
			this.display.value = this.timeScale.value;
			break;
		default : 
			this._mode = MultiFuncKnob.MODES.DEFAULT;
			this.display.value = 0;
			this.display.anims.fadeOut(this.id * 5).then(()=>{
				this.display.stateColor = 120;
				this.display.anims.fadeIn(this.id * 5);
				this.display.value = this.value.value;
			});
			break;
		}
	}

	get mode(){
		return this._mode;
	}

	update(channel, value){
		const isSwitch = channel == 1;
		switch(this.mode){
		case MultiFuncKnob.MODES.RECORD : 
			break;
		case MultiFuncKnob.MODES.PLAY : 
			break;
		case MultiFuncKnob.MODES.TIMESCALE : 
			if(isSwitch)
				this.timeScale.resetValue();
			else if( Value.INC_VALUE == value )
				this.timeScale.increase();
			else if( Value.DEC_VALUE == value )
				this.timeScale.decrease();
			break;
		default : 
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
		PLAY:      Symbol("PLAY"),
		TIMESCALE: Symbol("TIMESCALE")
	});
}
