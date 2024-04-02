"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _Pannel = _interopRequireDefault(require("../../Bases/Pannel.js"));
var _ControlerKnob = _interopRequireDefault(require("./ControlerKnob.js"));
var _SequencerKnob = _interopRequireDefault(require("./SequencerKnob.js"));
var _config = _interopRequireDefault(require("../../common/config.js"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
/*----------------------------------------*\
  MFT - index.js
  @author Evrard Vincent (vincent@ogre.be)
  @Date:   2024-03-25 00:45:52
  @Last Modified time: 2024-04-02 19:49:34
\*----------------------------------------*/

class SequencerPannel extends _Pannel.default {
  constructor(id, midiDisplay, midiOut) {
    super(id, midiDisplay);
    const COLOR = _config.default.PANNELS[id].COLOR;
    this.controlers = this.knobs.filter((knob, id) => id % 4 == 1 || id % 4 == 2).map(knob => new _ControlerKnob.default(knob, midiOut)).map((controler, id) => controler.onSpeeder(value => this.sequencers[id].speed = value).onOrderer(value => this.sequencers[id].order = value));
    this.sequencers = this.knobs.filter((knob, id) => id % 4 == 0 || id % 4 == 3).map(knob => new _SequencerKnob.default(knob, midiOut)).map((sequencer, id) => {
      sequencer.onStop(() => this.controlers[id].reset());
      sequencer.order = this.controlers[id].orderer.current;
      sequencer.color = COLOR;
      return sequencer;
    });
  }
}
exports.default = SequencerPannel;