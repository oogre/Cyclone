"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _Pannel = _interopRequireDefault(require("../Bases/Pannel.js"));
var _config = _interopRequireDefault(require("../common/config.js"));
var _Button = _interopRequireDefault(require("../Bases/Button.js"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
/*----------------------------------------*\
  MFT - RegularPannel.js
  @author Evrard Vincent (vincent@ogre.be)
  @Date:   2024-03-23 21:18:05
  @Last Modified time: 2024-04-02 20:02:14
\*----------------------------------------*/

class RegularPannel extends _Pannel.default {
  constructor(id, midiDisplay, midiOut) {
    super(id, midiDisplay);
    const COLOR = _config.default.PANNELS[id].COLOR;
    this.knobs.map(knob => {
      knob.color = COLOR;
      knob.onTurn(inc => {
        knob.value = (knob.value + inc + 128) % 128;
        midiOut(knob.id, knob.value);
      }).onReleased(releasedType => {
        if (releasedType == _Button.default.RELEASED_TYPE.DOUBLE) {
          knob.value = 0;
          midiOut(knob.id, knob.value);
        }
      });
    });
  }
}
exports.default = RegularPannel;