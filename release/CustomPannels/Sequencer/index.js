"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _Pannel = _interopRequireDefault(require("../../Bases/Pannel.js"));
var _Recorder = _interopRequireDefault(require("./Recorder.js"));
var _Controler = _interopRequireDefault(require("./Controler.js"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
/*----------------------------------------*\
  MFT - index.js
  @author Evrard Vincent (vincent@ogre.be)
  @Date:   2024-03-25 00:45:52
  @Last Modified time: 2024-03-25 18:03:26
\*----------------------------------------*/

class SequencerPannel extends _Pannel.default {
  constructor(id, midiDisplay, midiOut) {
    super(id, midiDisplay);
    this.recorders = this.knobs.filter((knob, id) => id % 4 == 0 || id % 4 == 3).map(knob => new _Recorder.default(knob, midiOut));
    this.controler = this.knobs.filter((knob, id) => id % 4 == 1 || id % 4 == 2).map(knob => new _Controler.default(knob, midiOut)).map((controler, id) => {
      controler.onSpeeder(value => this.recorders[id].speed = value);
      controler.onOrderer(value => this.recorders[id].order = value);
      return controler;
    });
    this.recorders = this.recorders.map((recorder, id) => {
      recorder.order = this.controler[id].orderer.current;
      return recorder;
    });
  }
}
exports.default = SequencerPannel;