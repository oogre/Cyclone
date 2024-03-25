/*----------------------------------------*\
  MFT - index.js
  @author Evrard Vincent (vincent@ogre.be)
  @Date:   2024-03-25 00:45:52
  @Last Modified time: 2024-03-25 01:02:53
\*----------------------------------------*/

import Pannel from '../../Bases/Pannel.js';
import Recorder from './Recorder.js';
import Controler from './Controler.js';


export default class SequencerPannel extends Pannel{
	constructor(id, midiDisplay, midiOut){
		super(id, midiDisplay);
		this.recorders = this.knobs
			.filter((knob, id)=>id % 4 == 0 || id % 4 == 3)
			.map( knob => new Recorder(knob, midiOut))
		this.speeds = this.knobs
			.filter((knob, id)=>id % 4 == 1 || id % 4 == 2)
			.map( knob => new Controler(knob, midiOut))
			.map( (controler, id) => {
				controler.onSpeeder( value => this.recorders[id].speed = value);
				controler.onOrderer( value => this.recorders[id].order = value);
			});
	}
}