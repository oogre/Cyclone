"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _MidiTools = require("./common/MidiTools.js");
var _config = _interopRequireDefault(require("./common/config.js"));
var _Button = _interopRequireDefault(require("./Bases/Button.js"));
var Pannels = _interopRequireWildcard(require("./CustomPannels"));
function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
const {
  MIDI_DEVICE_NAME: midiName,
  PANNELS: pannels
} = _config.default;
const colors = [[255, 0, 0], [255, 64, 0], [255, 128, 0], [255, 192, 0], [255, 255, 0], [192, 255, 0], [128, 255, 0], [64, 255, 0], [0, 255, 0], [0, 255, 64], [0, 255, 128], [0, 255, 192], [0, 255, 255], [0, 192, 255], [0, 128, 255], [0, 64, 255], [0, 0, 255], [64, 0, 255], [128, 0, 255], [192, 0, 255], [255, 0, 255], [255, 0, 192], [255, 0, 128], [255, 0, 64]];
class MidiFighterTwister {
  constructor() {
    this.displayInterface = (0, _MidiTools.connectOutput)(midiName);
    this.midiInterface = (0, _MidiTools.connectInput)(midiName);
    this.midiInterface.onCC((channel, number, value, deltaTime) => {
      const button = this.buttons[`${channel}-${number}`];
      button && button.update(value);
      this.currentPannel.onCC(channel, number, value, deltaTime);
    });
    this.buttons = {
      "3-12": new _Button.default().onPressed(() => this.nextPannel()),
      "3-9": new _Button.default().onPressed(() => this.prevPannel())
    };
    this._pannels = pannels.filter(({
      type
    }) => !!Pannels[type]).map(({
      type,
      midiDeviceName,
      midiChannel
    }, _id) => {
      const pannel = new Pannels[type](_id, /* MFT DISPLAY */(channel, id, value) => {
        (0, _MidiTools.sendCC)(this.displayInterface, channel, id, value);
      }, /* MIDI OUT */(id, value) => {
        (0, _MidiTools.sendCC)(pannel.midiOut, midiChannel, id, value);
      });
      pannel.midiOut = (0, _MidiTools.connectOutput)(midiDeviceName);
      return pannel;
    });
    this.currentPannel = 0;
  }
  nextPannel() {
    this.currentPannelId = (this.currentPannelId + 1 + this._pannels.length) % this._pannels.length;
  }
  prevPannel() {
    this.currentPannelId = (this.currentPannelId - 1 + this._pannels.length) % this._pannels.length;
  }
  set currentPannel(pannelId) {
    if (pannelId == this._currentPannelId) return;
    if (this.currentPannel) this.currentPannel.enable = false;
    this.currentPannelId = pannelId;
    this.currentPannel.enable = true;
  }
  get currentPannel() {
    return this._pannels[this.currentPannelId];
  }
  get currentPannelId() {
    return this._currentPannelId;
  }
  set currentPannelId(value) {
    return this._currentPannelId = value;
  }
}
exports.default = MidiFighterTwister;