import { 
	connectInput as MidiInConnect, 
	connectOutput as MidiOutConnect, 
	sendCC as MidiSendCC
} from './common/MidiTools.js';
import conf from "./common/config.js";
import { Container } from "./common/tools.js";

import Button from "./Bases/Button.js";

import * as Pannels from "./CustomPannels";
console.log(Pannels);

const {
	MIDI_DEVICE_NAME:midiName, 
	BANKS:banks
} = conf;

const colors = [
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

export default class MidiFighterTwister{
	constructor(){
		this.displayInterface = MidiOutConnect(midiName);
		this.midiInterface = MidiInConnect(midiName);
		this.midiInterface.onCC((channel, number, value, deltaTime)=>{
			const button = this.buttons[`${channel}-${number}`];
			button && button.update(value);
			
			this.currentPannel.onCC(channel, number, value, deltaTime);
		});

		this.buttons = {
			"3-12" : new Button().onPressed( () => this.nextPannel()),
			"3-9" : new Button().onPressed( () => this.prevPannel()),
		};

		this._pannels = banks.filter(bankType=>!!Pannels[bankType]).map((bankType, id)=>{
			return new Pannels[bankType](id, (channel, id, value) => {
				MidiSendCC(this.displayInterface, channel, id, value);
			});
		});
		this.currentPannel = 0;
	}

	nextPannel(){
		this.currentPannelId = (this.currentPannelId + 1 + this._pannels.length) % this._pannels.length
	}
	prevPannel(){
		this.currentPannelId = (this.currentPannelId - 1 + this._pannels.length) % this._pannels.length
	}

	set currentPannel(pannelId){
		if(pannelId == this._currentPannelId)return;
		if(this.currentPannel) this.currentPannel.enable = false;
		this.currentPannelId = pannelId
		this.currentPannel.enable = true;
	}

	get currentPannel(){
		console.log(this.currentPannelId);
		return this._pannels[this.currentPannelId];
	}

	get currentPannelId(){
		return this._currentPannelId;
	}

	set currentPannelId(value){
		return this._currentPannelId = value;
	}
}