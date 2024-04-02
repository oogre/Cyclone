/*----------------------------------------*\
  MFT - Orderer.js
  @author Evrard Vincent (vincent@ogre.be)
  @Date:   2024-03-25 19:45:42
  @Last Modified time: 2024-04-02 19:31:15
\*----------------------------------------*/

import {wait} from "../../../common/tools.js";

export default class Orderer{
	constructor(knob, midiOut){
		
		this.knob = knob;
		this.color = [0, 255, 0];
		this._active = false;
		this.changeHandler = ()=>{};
		this.onTurn = async (inc) => {
			this.value = (this.value + inc + 128) % 128;
			await this.setCurrent();
			this.knob.value = this.value;
			midiOut(this.knob.id, this.knob.value);
		};
		this._orders = [{
			type : "NORMAL",
			limits : [0, 32],
			anim : async () => {
				for(let v = 0 ; v < 128 ; v++){
					this.knob.value =  v;
					await wait(2);
				}	
			},
			develop : values => [...values]
		}, {
			type : "REVERSE",
			limits : [32, 64],
			anim : async () => {
				for(let v = 127 ; v >= 0 ; v--){
					this.knob.value =  v;
					await wait(2);
				}	
			},
			develop : values => [...values].reverse()
		}, {
			type : "PING_PONG",
			limits : [64, 96],
			anim : async () => {
				for(let v = 0 ; v < 128 ; v++){
					this.knob.value =  v;
					await wait(2);
				}	
				for(let v = 127 ; v >= 0 ; v--){
					this.knob.value =  v;
					await wait(2);
				}	
			},
			develop : values => [...values, ...[...values].reverse()]
		}, {
			type : "RANDOM",
			limits : [96, 128],
			anim : async () => {
				const values = new Array(128)
					.fill(0)
					.map((_, id)=>id)
					.sort(()=>Math.random() - 0.5);
				for (const v of values) {
   				this.knob.value =  v;
					await wait(2);
			  }
			},
			develop : values => [...values].sort(()=>Math.random() - 0.5)
		}];
		this.reset();
	}
	async reset(){
		this.value = 0;
		await this.setCurrent();
		this.changeHandler && this.changeHandler(this.current);
	}
	async setCurrent (forceAnim = false){
		const current = this._orders.find(({limits}) => this.value >= limits[0] && this.value < limits[1] );
		if(forceAnim || !this._currentOrder || this._currentOrder.type != current.type){
			this._currentOrder = current;
			if(this._active || forceAnim){
				await this._currentOrder.anim();
			}
		}
	}

	get current(){
		return this._currentOrder;
	}

	disactive(){
		this.changeHandler(this.current);
		this._active = false;
	}

	async active(){
		this._active = true;
		this.knob.color = this.color;
		await this.setCurrent(true);
		this.knob.value = this.value;
		this.knob.onTurn(this.onTurn);
		return this;
	}
	onChange(handler){
		this.changeHandler = handler;
		return this;
	}
}