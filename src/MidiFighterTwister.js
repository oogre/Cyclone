import { 
	connectInput as MidiInConnect, 
	connectOutput as MidiOutConnect,
	sendCC as MidiSendCC
} from './common/MidiTools.js';
import conf from "./common/config.js";
import Button from "./Bases/Button.js";
import * as Pannels from "./CustomPannels";

const {
	MIDI_DEVICE_NAME:midiName, 
	PANNELS:pannels
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

		this._pannels = pannels
			.filter(({type})=>!!Pannels[type])
			.map(({type, midiDeviceName, midiChannel}, id)=>{
				const PannelType = Pannels[type];
				const pannel = new PannelType(id, 
					/* MFT DISPLAY */ 
					(channel, id, value) => {
						MidiSendCC(this.displayInterface, channel, id, value);
					}, 
					/* MIDI OUT */ 
					(id, value) => {
						MidiSendCC(pannel.midiOut, midiChannel, id, value);
					});
				pannel.midiOut = MidiOutConnect(midiDeviceName);
				return pannel;
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
		return this._pannels[this.currentPannelId];
	}

	get currentPannelId(){
		return this._currentPannelId;
	}

	set currentPannelId(value){
		return this._currentPannelId = value;
	}
}