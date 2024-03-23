"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _Knob = _interopRequireDefault(require("./Knob.js"));
var _OscHelper = _interopRequireDefault(require("./OscHelper.js"));
var _config = _interopRequireDefault(require("../common/config.js"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
/*----------------------------------------*\
  cyclone - Pannel.js
  @author Evrard Vincent (vincent@ogre.be)
  @Date:   2024-03-22 10:11:07
  @Last Modified time: 2024-03-23 23:54:28
\*----------------------------------------*/

const {
  KNOB_PER_BANK: knobPerPannel
} = _config.default;
class Pannel {
  constructor(id, midiSender, midiOut) {
    this._id = id;
    this._active = false;
    this.knobs = new Array(knobPerPannel).fill(0).map((_, id) => {
      return new _Knob.default(id, midiSender, midiOut).onTurn((knob, inc) => console.log("Turn")).onPressed(knob => console.log("Pressed")).onReleased(knob => console.log("Released")).onLongClick(knob => console.log("LongClick")).onDoubleClick(knob => console.log("DoubleClick"));
    });
  }
  onCC(channel, number, value, deltaTime) {
    const knob = this.knobs[number];
    if (!knob) return;
    const action = knob.getAction(channel);
    if (!action) return;
    action(value, deltaTime);
  }
  set enable(value) {
    this._active = !!value;
    this.knobs.map(k => k.enable = this._active);
  }
  get enable() {
    return this._active;
  }
}
exports.default = Pannel;