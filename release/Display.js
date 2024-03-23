"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _MidiTools = require("./common/MidiTools.js");
var _Pannel = _interopRequireDefault(require("./Pannel.js"));
var _Button = _interopRequireDefault(require("./Button.js"));
var _OscHelper = _interopRequireDefault(require("./OscHelper.js"));
var _tools = require("./common/tools.js");
var _config = _interopRequireDefault(require("./common/config.js"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
const {
  MIDI_DEVICE_NAME: midiName,
  BANK: bankLength
} = _config.default;
const colors = [[255, 0, 0], [255, 64, 0], [255, 128, 0], [255, 192, 0], [255, 255, 0], [192, 255, 0], [128, 255, 0], [64, 255, 0], [0, 255, 0], [0, 255, 64], [0, 255, 128], [0, 255, 192], [0, 255, 255], [0, 192, 255], [0, 128, 255], [0, 64, 255], [0, 0, 255], [64, 0, 255], [128, 0, 255], [192, 0, 255], [255, 0, 255], [255, 0, 192], [255, 0, 128], [255, 0, 64]];
class Display {
  constructor() {
    this.displayInterface = (0, _MidiTools.connectOutput)(midiName);
    this.midiInterface = (0, _MidiTools.connectInput)(midiName);
    this.midiInterface.onCC((channel, number, value, deltaTime) => {
      const button = this.buttons[`${channel}-${number}`];
      button && button.update(value);
      this.currentPannel.onCC(channel, number, value, deltaTime);
    });
    this.buttons = {
      "3-12": new _Button.default().onPressed(() => this.currentPannel = this.currentPannel.next()),
      "3-9": new _Button.default().onPressed(() => this.currentPannel = this.currentPannel.prev())
    };
    this._pannels = (0, _tools.Container)(_Pannel.default, bankLength, /* midiSender */(channel, id, value) => {
      (0, _MidiTools.sendCC)(this.displayInterface, channel, id, value);
    });
    this.currentPannel = this._pannels[0];
  }
  set currentPannel(value) {
    if (value == this._currentPannel) return;
    if (this._currentPannel) this._currentPannel.enable = false;
    this._currentPannel = value;
    this._currentPannel.enable = true;
  }
  get currentPannel() {
    return this._currentPannel;
  }

  // test(){
  // 	let c = 0;
  // 	setInterval(()=>{
  // 		this.knobs.value = Math.random();
  // 		c += 0.1
  // 		c %= 1;
  // 	}, 30);
  // }

  // blackout(){
  // 	this.knobs.black = 1;
  // }

  // demo(){
  // 	this.knobs.demo = !this.knobs.demo.every(v=>v);
  // }

  // rainbow(){
  // 	let c = 0;
  // 	setInterval(()=>{
  // 		// this.knobs.color = colors[c % colors.length];
  // 		this.knobs.hue = c;
  // 		c +=0.01;
  // 		c %= 1;
  // 	}, 30);
  // }
}
exports.default = Display;