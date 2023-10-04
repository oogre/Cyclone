/*----------------------------------------*\
  midiFighter - Display.js
  @author Evrard Vincent (vincent@ogre.be)
  @Date:   2023-02-20 22:17:43
  @Last Modified time: 2023-10-04 15:14:58
\*----------------------------------------*/

import conf from "./common/config.js";
import {wait, lerp} from "./common/tools.js";

const {
	STROB_DELAY:strobDebay,
	RECORD_COLOR:recordColor,
	REVERSE_COLOR:reverseColor,
	RESET_COLOR:resetColor,
	STORE_COLOR:storeColor,
	CLEAR_REC_COLOR:clearRecColor,
	TIMESCALE_COLOR:timescaleColor
} = conf.UI;

export default class Display {
	constructor(send){
		this._stateColor = 0;
		this._value= 0;
		this.send = send;
		this.anims = {
			reset : async ()=>{
				this.displayColor(resetColor);
				await wait(strobDebay);
				this.displayColor(this._stateColor);
			},
			store : async () => {
				this.displayColor(storeColor);
				await wait(strobDebay);
				this.displayColor(this._stateColor);
			},
			fadeIn : async (delay = 0) => {
				await wait(delay);
				for(let j = 0 ; j <= 1 ; j += 0.02){
					this.displayIntensity(j);
					await wait(5)
				}
			},
			fadeOut : async (delay = 0) => {
				await wait(delay);
				for(let j = 0 ; j <= 1 ; j += 0.02){
					this.displayIntensity(1-j);
					await wait(5)
				}
			},
			gradiant : async (delay = 0, color) => {
				await wait(delay);
				for(let j = 0 ; j <= 1 ; j += 0.02){
					this.displayColor(lerp(this._stateColor, color, j));
					await wait(5)
				}
				this.stateColor = color;
			},
			playMode : {
				NORMAL : async (step = 1) => {
					for(let j = 0 ; j < 128 ; j ++){
						this.value = j;
						await wait(step);
					}
				},
				REVERSE : async (step = 1) => {
					for(let j = 127 ; j >= 0 ; j --){
						this.value = j;
						await wait(step);
					}
				},
				PING_PONG : async (step = 1) => {
					await this.anims.playMode.NORMAL(1);
					await wait(step);
					await this.anims.playMode.REVERSE(1);
				},
				RANDOM : async (step = 1) => {
					for(let j = 0 ; j < 128 ; j ++){
						this.value = Math.floor(Math.random() * 128);
						await wait(step);
					}
				}
			}
		}
	}

	set stateColor (color){
		this._stateColor = color;
		this.displayColor(this._stateColor);
	}

	set value (val){
		this._value = val;
		this.displayValue(this._value);
	}

	displayValue(value){
		this.send(Display.RING_CHANNEL, value);
	}

	displayColor(color){
		color = color % 128
		this.send(Display.COLOR_CHANNEL, color);
	}

	displayIntensity(intensity){
		intensity = lerp(
			Display.INTENSITY_MIN, 
			Display.INTENSITY_MAX, 
			Math.min(Math.max(intensity, 0), 1)
		)
		this.send(Display.INTENSITY_CHANNEL, intensity);
	}

	displayStrob(intensity){
		intensity = lerp(
			Display.STROB_MIN, 
			Display.STROB_MAX, 
			Math.min(Math.max(intensity, 0), 1)
		)
		this.send(Display.INTENSITY_CHANNEL, intensity);
	}


	displayIntensity(intensity){
		intensity = lerp(
			Display.INTENSITY_MIN, 
			Display.INTENSITY_MAX, 
			Math.min(Math.max(intensity, 0), 1)
		)
		this.send(Display.INTENSITY_CHANNEL, intensity);
	}

	static RING_CHANNEL = 0x00;
	static COLOR_CHANNEL = 0x01;
	static INTENSITY_CHANNEL = 0x02;
	static INTENSITY_MIN = 17;
	static INTENSITY_MAX = 48;
	static STROB_MIN = 1;
	static STROB_MAX = 16;
}