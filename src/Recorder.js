/*----------------------------------------*\
  midiFighter - Recorder.js
  @author Evrard Vincent (vincent@ogre.be)
  @Date:   2023-02-15 19:18:25
  @Last Modified time: 2023-02-17 01:30:46
\*----------------------------------------*/
import {wait} from "./common/tools.js";
import EventHandler from "./common/EventHandler.js";

export default class Recorder extends EventHandler {
	constructor(){
		super();
		super.createHandler("reverse");
		super.createHandler("startRec");
		super.createHandler("stopRec");
		super.createHandler("playEvent");
		this.recordHandler = (event) => this.record(event);
		this.records = [];
	}

	plug(elems){
		this.elements = elems;
		return this;
	}

	start(){
		this.records.push({
			events : [{
				eventName : "start",
				time : new Date().getTime(),
				target : {}
			}]
		});
		this.elements.on("changeValue", this.recordHandler);
		super.trig("startRec");
	}

	reverse(){
		this.records = this.records.map(rec=>{
			rec.events = rec.events.reverse()
			return rec;
		});
		super.trig("reverse")
	}

	stop(){
		this.elements.off("changeValue", this.recordHandler);
		this.record({
			eventName : "stop", 
			time : new Date().getTime(),
			target : {}
		})
		super.trig("stopRec");
		this.play(this.records.length-1);
	}

	removeAll(id){
		this.records = this.records.map(rec=>{
			rec.events = rec.events.filter(({target}) => target.id != id);
			return rec;
		});
	}

	record(event){
		if(event.target.enableRec){
			const current = this.records[this.records.length-1];
			event.delay = event.time - current.events[current.events.length-1].time;
			current.events.push(event);	
		}
	}

	async play(__ID__){
		try{
			if(__ID__ >= this.records.length) return;
			let {events} = this.records[__ID__];
			if(events.length <= 1) {
				this.records.splice(__ID__, 1);
				return;
			}
			const {eventName, target:{id, _value}, delay} = events[0];

			switch(eventName){
				case "changeValue":
					super.trig("playEvent", { 
						knobId : id, 
						value : _value 
					});
				break;
			}
			events.push(events.shift());
			await wait(events[0].delay);
			await this.play(__ID__);
		}catch(error){
			this.records.splice(__ID__, 1);
		}
	}
}