"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _Pixel = _interopRequireDefault(require("./Pixel.js"));
var _Button = _interopRequireDefault(require("./Button.js"));
var _tools = require("../common/tools.js");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
/*----------------------------------------*\
  cyclone - Knob.js
  @author Evrard Vincent (vincent@ogre.be)
  @Date:   2024-03-21 15:11:59
  @Last Modified time: 2024-03-23 21:16:55
\*----------------------------------------*/

const getTime = () => new Date().getTime();
class Knob extends _tools.MultiHeritage.inherit(_Pixel.default, _Button.default) {
  constructor(id, midiSender) {
    super(id, midiSender);
    this.turnHandler = () => {};
    this.actions = {
      channel_0: value => this.turnHandler(this, value - 64),
      channel_1: value => this.update(value)
    };
  }
  getAction(channel) {
    return this.actions[`channel_${channel}`];
  }
  onTurn(handler) {
    this.turnHandler = handler;
    return this;
  }
}
exports.default = Knob;