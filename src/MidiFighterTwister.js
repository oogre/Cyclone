import { 
	connectInput as MidiInConnect, 
	connectOutput as MidiOutConnect, 
	sendCC as MidiSendCC
} from './common/MidiTools.js';
import conf from "./common/config.js";
import { Container } from "./common/tools.js";

import Button from "./Bases/Button.js";

import "./CustomPannels";
console.log("Pannel");

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
			"3-12" : new Button().onPressed( () => this.currentPannel = this.currentPannel.next()),
			"3-9" : new Button().onPressed( () => this.currentPannel = this.currentPannel.prev()),
		};



		this._pannels = Container(RegularPannel, bankLength, /* midiSender */(channel, id, value) => {
			MidiSendCC(this.displayInterface, channel, id, value);
		});

		this.currentPannel = this._pannels[0];
	}

	set currentPannel(value){
		if(value == this._currentPannel)return;
		if(this._currentPannel) this._currentPannel.enable = false;
		this._currentPannel = value
		this._currentPannel.enable = true;
	}

	get currentPannel(){
		return this._currentPannel;
	}
}