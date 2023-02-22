/*----------------------------------------*\
  midiFighter - Recorder.js
  @author Evrard Vincent (vincent@ogre.be)
  @Date:   2023-02-21 13:29:27
  @Last Modified time: 2023-02-21 15:41:49
\*----------------------------------------*/

import {wait} from "./common/tools.js";
import EventHandler from "./common/EventHandler.js";

export default class Recorder extends EventHandler {
	constructor(value){
		super();
		super.createHandler("newRecord");
		this.enableRec = true;
		this.records = [];
		this.value = value;
	}

	startRecord(){
		if(!this.value)return;
		this.records = [this.entry("start")];
		this.record(this.entry("change"));
		this.value.on("change", this.record.bind(this));
	}

	stopRecord(){
		if(!this.value)return;

		this.value.off("change", this.record.bind(this));
		this.record(this.entry("change"));
		this.records = this.records.filter(({eventName}) => eventName != "start");
		if(this.records.length<=2){
			return false;
		}
		const record = this.records.map(({delay, value})=>{return {delay, value};});
		super.trig("newRecord", {record});
	}

	entry(name) {
		return {
			eventName : name, 
			time : new Date().getTime(),
			target : this.value
		}
	}

	record(event){
		const prevEvt = this.records[this.records.length-1];
		if(prevEvt.value == event.target._value)
			return;
		this.records.push({
			eventName : event.eventName,
			time : event.time,
			delay : event.time - prevEvt.time,
			value : event.target._value
		});
	}
}