/*----------------------------------------*\
  midiFighter - Button.js
  @author Evrard Vincent (vincent@ogre.be)
  @Date:   2023-02-15 18:13:39
  @Last Modified time: 2023-02-15 19:51:01
\*----------------------------------------*/

import EventHandler from "./common/EventHandler.js";

const LONG_PRESS_TIMEOUT = 333;
const DOUBLE_PRESS_TIMEOUT = 333;

export default class Button extends EventHandler {
	constructor(id){
		super();
		super.createHandler("pressed");
		super.createHandler("released");
		super.createHandler("longPressed");
		super.createHandler("doublePressed");
		this._counter = 0;
		this.id = id;
		this._isActive = false;
		this._isPressed = false;
		this._wasPressed = false;
		this._pressTimer;
		this._pressAt = 0;
	}

	isActive(){
		return this.counter %2 ==1
	}
	
	set counter (val){
		this._counter = val;
		this._isActive = this._counter % 2 ==1;
	}
	get counter (){
		return this._counter;
	}

	set pressed(val){
		this._wasPressed = this._isPressed;
		this._isPressed = !!val;
		if(this._isPressed && !this._wasPressed){
			const now = new Date().getTime();
			const pressDelay = now - this._pressAt;
			this._pressAt = now;
			if(pressDelay < DOUBLE_PRESS_TIMEOUT){
				super.trig("doublePressed", this);
			}else{
				super.trig("pressed", this);
				this._pressTimer = setTimeout(() => super.trig("longPressed", this), LONG_PRESS_TIMEOUT);	
			}
		}
		if(!this._isPressed && this._wasPressed){
			clearTimeout(this._pressTimer);
			super.trig("released", this);
			this.counter ++;
		}
	}

	get pressed(){
		return this._isPressed;
	}
}