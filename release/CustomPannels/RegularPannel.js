"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _Pannel = _interopRequireDefault(require("../Bases/Pannel.js"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
/*----------------------------------------*\
  MFT - RegularPannel.js
  @author Evrard Vincent (vincent@ogre.be)
  @Date:   2024-03-23 21:18:05
  @Last Modified time: 2024-03-24 00:17:33
\*----------------------------------------*/

class RegularPannel extends _Pannel.default {
  constructor(id, midiDisplay, midiOut) {
    super(id, midiDisplay);
    this.knobs.map(knob => {
      knob.onTurn(inc => {
        knob.value = (knob.value + inc + 128) % 128;
        midiOut(knob.id, knob.value);
      });
    });
  }
}
exports.default = RegularPannel;