/*----------------------------------------*\
  MFT - index.js
  @author Evrard Vincent (vincent@ogre.be)
  @Date:   2024-03-25 00:45:52
  @Last Modified time: 2024-03-26 16:27:38
\*----------------------------------------*/


import Pannel from '../../Bases/Pannel.js';
import ControlerKnob from './ControlerKnob.js';
import SequencerKnob from './SequencerKnob.js';

export default class SequencerPannel extends Pannel{
	constructor(id, midiDisplay, midiOut){
		super(id, midiDisplay);

		this.controlers = this.knobs
			.filter((knob, id)=>id % 4 == 1 || id % 4 == 2)
			.map( knob => new ControlerKnob(knob, midiOut))
			.map( (controler, id) => controler
					.onSpeeder( value => this.sequencers[id].speed = value)
					.onOrderer( value => this.sequencers[id].order = value)
			);

		this.sequencers = this.knobs
			.filter((knob, id)=>id % 4 == 0 || id % 4 == 3)
			.map( knob => new SequencerKnob(knob, midiOut))
			.map( (sequencer, id) => {
				sequencer.onStop(()=>this.controlers[id].reset());
				sequencer.order = this.controlers[id].orderer.current;
				return sequencer;
			});
	}
}