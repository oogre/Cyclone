/*----------------------------------------*\
  midiFighter - Knob.js
  @author Evrard Vincent (vincent@ogre.be)
  @Date:   2023-02-15 16:22:22
  @Last Modified time: 2023-02-18 23:03:31
\*----------------------------------------*/

import Button from "./Button.js";
import {lerp} from "./common/tools.js";
import conf from "./common/config.js";

const {
	BANK:bankLenght,
	KNOB_PER_BANK:knobPerBank
} = conf;

const {
	KNOB_COLORS:knobColors
} = conf.UI;

export default class Knob extends Button {
	constructor(id, value = 0){
		super(id);
		super.createHandler("created");
		super.createHandler("changeValue");
		super.createHandler("resetValue");
		super.createHandler("storeValue");
		const mix = Math.floor(id / (knobPerBank)) / (bankLenght-1);
		this.color = lerp(knobColors[0], knobColors[1], mix);
		this._initValue = value;
		this._value = this.initValue;
		this.on("doublePressed", () => this.resetValue());
		this.on("longPressed", () => this.resetInitValue());
		this.enableRec = true;
		setTimeout(()=>super.trig("created", this), 20);
		setTimeout(()=>super.trig("changeValue", this), 20);
	}
	
	increase(step = 1){
		this.value += step;
	}
	
	decrease(step = 1){
		this.value -= step;
	}
	
	resetValue(){
		this.value = this.initValue;
		super.trig("resetValue", this);
	}

	resetInitValue(){
		this.initValue = this.value;
		super.trig("storeValue", this);
	}

	set valueUnrecordable(val){
		this.enableRec = false;
		this.value = val;
		this.enableRec = true;;
	}

	set value(val){
		this._value = (val + 128) % 128;
		super.trig("changeValue", this);
	}

	get value(){
		return this._value;
	}

	set initValue(val){
		this._initValue = (val + 128) % 128;
	}
	get initValue(){
		return this._initValue;
	}
}