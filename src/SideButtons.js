/*----------------------------------------*\
  midiFighter - SideButtons.js
  @author Evrard Vincent (vincent@ogre.be)
  @Date:   2023-02-15 18:26:28
  @Last Modified time: 2023-02-16 13:36:06
\*----------------------------------------*/

import EventHandler from "./common/EventHandler.js";
import Button from "./Button.js";
import conf from "./common/config.js";

const {
	HOLD_TO_RECORD:holdToRecord,
	SIDE_BTN_DICT:sideBtnDict,
	SIDE_BTN_ACTION:sideBtnAction
} = conf;

export default class SideButtons extends EventHandler {
	constructor(){
		super();
		super.createHandler("startRec");
		super.createHandler("stopRec");
		super.createHandler("reverse");
		this.buttons = new Array(sideBtnDict.length).fill(0).map((_, k)=>{
			return new Button(k)
				.on("*", (event)=> {
					super.trig(event.eventName, event.target);
				})
				.on("pressed", ({target:{id, _isActive}}) => {
					switch(id){
						case sideBtnAction.indexOf("RECORD") :
							if(holdToRecord || _isActive){
								super.trig("startRec");
							}else{
								super.trig("stopRec");
							}
						break;
						case sideBtnAction.indexOf("reverse") :
							super.trig("reverse");
							break;
					}
				})
				.on("released", ({target:{id}}) => {
					if(holdToRecord && id == sideBtnAction.indexOf("RECORD")) {
						super.trig("stopRec");
					}
				});
		});
	}

	getButton(id){
		id = Math.abs(id);
		id %= this.buttons.length;
		return this.buttons[id % this.buttons.length];
	}

	getKnobByMidiAddress(midiNumber){
		return this.getButton(sideBtnDict.indexOf(midiNumber))
	}

	update(midiNumber, value){
		const button = this.getKnobByMidiAddress(midiNumber);
		if(value == 127){
			button.pressed = true;	
		}
		else if(value == 0){
			button.pressed = false;
		}
	}
}