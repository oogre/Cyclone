/*----------------------------------------*\
  cyclone - Pixel.js
  @author Evrard Vincent (vincent@ogre.be)
  @Date:   2024-03-21 01:59:40
  @Last Modified time: 2024-03-24 18:25:21
\*----------------------------------------*/
import {RGB2HUE, lerp, constrain} from "../common/tools.js";
import OSC from "./OscHelper.js";

const RING_CHANNEL = 0x00;
const COLOR_CHANNEL = 0x01;
const TAG_CHANNEL = 0x02;
const VALUE_CHANNEL = 0x05;

export default class Pixel{
	constructor(id, midiDisplay){
		this.midiDisplay = midiDisplay;
		this._id = id;
		this._color = 0;
		this._lumTag = 0;
		this._blinkTag = 0;
		this._strobTag = 0;
		this._value = 0;
		this._lumValue = 0;
		this._blinkValue = 0;
		this._strobValue = 0;
		this._demo = 0;
		this._next = 0;
		this._active = false;

		OSC.on(`/pixel/${this._id}/value`, ([address, value]) => this.value = value );
		OSC.on(`/pixel/${this._id}/value/luminosity`, ([address, value]) => this.lumValue = value );
		OSC.on(`/pixel/${this._id}/value/blink`, ([address, value]) => this.blinkValue = value );
		OSC.on(`/pixel/${this._id}/value/stob`, ([address, value]) => this.strobValue = value );

		OSC.on(`/pixel/${this._id}/tag/luminosity`, ([address, value]) => this.lumTag = value );
		OSC.on(`/pixel/${this._id}/tag/blink`, ([address, value]) => this.blinkTag = value );
		OSC.on(`/pixel/${this._id}/tag/stob`, ([address, value]) => this.strobTag = value );

		OSC.on(`/pixel/${this._id}/tag/hue`, ([address, value]) => this.hue = value );
		OSC.on(`/pixel/${this._id}/tag/black`, ([address, value]) => this.black = value );
		OSC.on(`/pixel/${this._id}/tag/color`, ([address, red, green, blue]) => this.color = [red, green, blue] );
	}

	get id (){
		return this._id;
	}

	set enable(v){
		this._active = !!v;
		
		this.enable && this.midiDisplay(RING_CHANNEL, this._id, this._value)
		this.enable && this.midiDisplay(VALUE_CHANNEL, this._id, this._blinkValue)
		this.enable && this.midiDisplay(VALUE_CHANNEL, this._id, this._strobValue)
		this.enable && this.midiDisplay(TAG_CHANNEL, this._id, this._lumTag)
		this.enable && this.midiDisplay(TAG_CHANNEL, this._id, this._blinkTag)
		this.enable && this.midiDisplay(TAG_CHANNEL, this._id, this._strobTag)
		this.enable && this.midiDisplay(COLOR_CHANNEL, this._id, this._color)
	}
	
	get enable(){
		return this._active;
	}
	
	set value(value){
		this._value = constrain(0, 127, value);
		this.enable && this.midiDisplay(RING_CHANNEL, this._id, this._value)
	}
	get value(){
		return this._value;
	}

	set lumValue(value){
		this._lumValue = lerp(65, 97, value);
		this.enable && this.midiDisplay(VALUE_CHANNEL, this._id, this._lumValue)
	}
	get lumValue(){
		return this._lumValue;
	}

	set blinkValue(value){
		this._blinkValue = lerp(48, 56, value);
		this.enable && this.midiDisplay(VALUE_CHANNEL, this._id, this._blinkValue)
	}
	get blinkValue(){
		return this._blinkValue;
	}

	set strobValue(value){
		this._strobValue = lerp(57, 64, value);
		this.enable && this.midiDisplay(VALUE_CHANNEL, this._id, this._strobValue)
	}
	get strobValue(){
		return this._strobValue;
	}

	set lumTag(value){
		this._lumTag = lerp(17, 48, value);
		this.enable && this.midiDisplay(TAG_CHANNEL, this._id, this._lumTag)
	}
	get lumTag(){
		return this._lumTag;
	}

	set blinkTag(value){
		this._blinkTag = lerp(0, 8, value);;
		this.enable && this.midiDisplay(TAG_CHANNEL, this._id, this._blinkTag)
	}
	get blinkTag(){
		return this._blinkTag;
	}

	set strobTag(value){
		this._strobTag = lerp(9, 16, value);;
		this.enable && this.midiDisplay(TAG_CHANNEL, this._id, this._strobTag)
	}
	get strobTag(){
		return this._strobTag;
	}

	set black(value){
		this.enable && this.midiDisplay(COLOR_CHANNEL, this._id, (!!value) ? 0 : this._color)
	}

	set hue(value){
		this._color = lerp(1, 127, value);
		this.enable && this.midiDisplay(COLOR_CHANNEL, this._id, this._color)
	}

	set color([red, green, blue]){
		//invert red and blue to match MIDI Fighter Twister colorMode
		[red, blue] = [blue, red];
		this.hue = RGB2HUE(red, green, blue) / 360;
	}
	get color(){
		return this._colorTag;
	}

	set demo(value){
		this._demo = !!value;
		this.enable && this.midiDisplay(TAG_CHANNEL, this._id, this._demo * 127)
	}
	get demo(){
		return this._demo;
	}
}

Pixel.TAG_COLORS = [
	[255, 0  , 0  ],
	[255, 64 , 0  ],
	[255, 128, 0  ],
	[255, 192, 0  ],
	[255, 255, 0  ],
	[192, 255, 0  ],
	[128, 255, 0  ],
	[64 , 255, 0  ],
	[0  , 255, 0  ],
	[0  , 255, 64 ],
	[0  , 255, 128],
	[0  , 255, 192],
	[0  , 255, 255],
	[0  , 192, 255],
	[0  , 128, 255],
	[0  , 64 , 255],
	[0  , 0  , 255],
	[64 , 0  , 255],
	[128, 0  , 255],
	[192, 0  , 255],
	[255, 0  , 255],
	[255, 0  , 192],
	[255, 0  , 128],
	[255, 0  , 64 ]
];