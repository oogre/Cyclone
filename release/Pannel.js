"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _Knob = _interopRequireDefault(require("./Knob.js"));
var _OscHelper = _interopRequireDefault(require("./OscHelper.js"));
var _tools = require("./common/tools.js");
var _config = _interopRequireDefault(require("./common/config.js"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
/*----------------------------------------*\
  cyclone - Pannel.js
  @author Evrard Vincent (vincent@ogre.be)
  @Date:   2024-03-22 10:11:07
  @Last Modified time: 2024-03-22 20:02:47
\*----------------------------------------*/

const {
  KNOB_PER_BANK: knobPerPannel
} = _config.default;
class Pannel {
  constructor(id, midiSender) {
    this._id = id;
    this.knobs = (0, _tools.Container)(_Knob.default, knobPerPannel, midiSender);
    this.knobs.map(knob => {
      _OscHelper.default.on(`/pannel/${id}/knob/${knob.id}/value`, ([address, value]) => {
        this.knobs[knob.id].value = value;
      });
    });
    this._active = false;
  }
  onCC(channel, number, value, deltaTime) {
    if (number < 0 || number > this.knobs.length) return;
    this.knobs[number].input = [channel, value, deltaTime];
  }
  set enable(value) {
    this._active = !!value;
    this.knobs.enable = this._active;
  }
  get enable() {
    return this._active;
  }
}
exports.default = Pannel;