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
  @Last Modified time: 2024-03-24 00:05:58
\*----------------------------------------*/

class RegularPannel extends _Pannel.default {
  constructor(id, midiDisplay, midiOut) {
    super(id, midiDisplay);
    this.knobs.map(knob => {
      knob.onTurn((knob, inc) => {
        knob.value = (knob.value + inc + 128) % 128;
        midiOut(knob.id, knob.value);
      }).onPressed(knob => console.log("Pressed")).onReleased(knob => console.log("Released")).onLongClick(knob => console.log("LongClick")).onDoubleClick(knob => console.log("DoubleClick"));
    });
  }
}
exports.default = RegularPannel;