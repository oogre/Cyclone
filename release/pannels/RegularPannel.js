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
  @Last Modified time: 2024-03-23 21:30:12
\*----------------------------------------*/

class RegularPannel extends _Pannel.default {
  constructor(...params) {
    super(...params);
    this.knobs.map(knob => {
      knob.onTurn((knob, inc) => knob.value = (knob.value + inc + 128) % 128).onPressed(knob => console.log("Pressed")).onReleased(knob => console.log("Released")).onLongClick(knob => console.log("LongClick")).onDoubleClick(knob => console.log("DoubleClick"));
    });
  }
}
exports.default = RegularPannel;