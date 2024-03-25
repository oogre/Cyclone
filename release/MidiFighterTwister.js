"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _MidiTools = require("./common/MidiTools.js");
var _tools = require("./common/tools.js");
var _config = _interopRequireDefault(require("./common/config.js"));
var _Button = _interopRequireDefault(require("./Bases/Button.js"));
var Pannels = _interopRequireWildcard(require("./CustomPannels"));
function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
console.log(Pannels);
_config.default.PANNELS = _config.default.PANNELS.filter(({
  type
}) => {
  const res = !!Pannels[type];
  if (!res) {
    console.log(`Pannel Type "${type}" does not exists`);
  }
  return res;
}).map(pannel => {
  pannel.PannelType = Pannels[pannel.type];
  return pannel;
});
const {
  MIDI_DEVICE_NAME: midiName,
  PANNELS: pannelsConf
} = _config.default;
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
    this._pannels = pannelsConf.map(({
      PannelType,
      midiDeviceName,
      midiChannel = 0,
      color = null
    }, id) => {
      const pannel = new PannelType(id, /* MFT DISPLAY */
      (channel, id, value) => {
        (0, _MidiTools.sendCC)(this.displayInterface, channel, id, value);
      }, /* MIDI OUT */
      (id, value) => {
        (0, _MidiTools.sendCC)(pannel.midiOut, midiChannel, id, value);
      });
      pannel.midiOut = (0, _MidiTools.connectOutput)(midiDeviceName);
      return pannel;
    });
    this.currentPannel = 0;
  }
  nextPannel() {
    this.currentPannel = (this.currentPannelId + 1 + this._pannels.length) % this._pannels.length;
  }
  prevPannel() {
    this.currentPannel = (this.currentPannelId - 1 + this._pannels.length) % this._pannels.length;
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
  async watchdog(interval) {
    const [inID, outID] = (0, _MidiTools.getID)(midiName);
    if (inID < 0 || outID < 0) throw new Error(`MIDI_DEVICE (${midiName}) HAS BEEN DISCONNECTED`);
    await (0, _tools.wait)(interval);
    return this.watchdog(interval);
  }
}
exports.default = MidiFighterTwister;