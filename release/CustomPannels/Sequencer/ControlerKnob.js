"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _Speeder = _interopRequireDefault(require("./CustomKnobs/Speeder.js"));
var _Orderer = _interopRequireDefault(require("./CustomKnobs/Orderer.js"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
/*----------------------------------------*\
  MFT - Controler.js
  @author Evrard Vincent (vincent@ogre.be)
  @Date:   2024-03-25 00:47:44
  @Last Modified time: 2024-03-26 16:29:01
\*----------------------------------------*/

class ControlerKnob {
  constructor(knob, midiOut) {
    this.speeder = new _Speeder.default(knob, midiOut);
    this.orderer = new _Orderer.default(knob, midiOut);
    this.current = this.speeder;
    knob.onPressed(() => this.current = this.orderer).onReleased(() => this.current = this.speeder);
  }
  reset() {
    this.speeder.reset();
    this.speeder.active();
    this.orderer.reset();
  }
  set current(value) {
    if (this._current != value) {
      if (!!this._current) this._current.disactive();
      this._current = value;
      this._current.active();
    }
  }
  onSpeeder(handler) {
    this.speeder.onChange(handler);
    return this;
  }
  onOrderer(handler) {
    this.orderer.onChange(handler);
    return this;
  }
}
exports.default = ControlerKnob;