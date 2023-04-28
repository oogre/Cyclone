"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _midi = _interopRequireDefault(require("midi"));
var _SideButtons = _interopRequireDefault(require("./SideButtons.js"));
var _MultiFuncKnob = _interopRequireDefault(require("./MultiFuncKnob.js"));
var _tools = require("./common/tools.js");
var _config = _interopRequireDefault(require("./common/config.js"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
/*----------------------------------------*\
  midiFighter - MidiFighterTwister.js
  @author Evrard Vincent (vincent@ogre.be)
  @Date:   2023-02-15 16:35:32
  @Last Modified time: 2023-04-26 15:18:13
\*----------------------------------------*/

const {
  MIDI_DEVICE_NAME: midiName,
  VIRTUAL_MIDI_DEVICE_NAME: midiOutName,
  WATCHDOG_INTERVAL: watchdogInterval,
  KNOB_PER_BANK: knobPerBank,
  BANK: bankLength
} = _config.default;
const MIDI_MESSAGE = {
  NOTE_OFF: 0x80,
  NOTE_ON: 0x90,
  KEY_PRESSURE: 0xA0,
  CONTROL_CHANGE: 0xB0,
  PROGRAM_CHANGE: 0xC0,
  CHANNEL_PRESSURE: 0xD0,
  PITCH_BEND: 0xE0
};
class MidiFighterTwister {
  constructor() {
    this.sideButtons = new _SideButtons.default().on("startRec", async event => {
      this.knobs.map(knob => knob.mode = _MultiFuncKnob.default.MODES.RECORD);
    }).on("startTimeScale", event => {
      this.knobs.map(knob => knob.mode = _MultiFuncKnob.default.MODES.TIMESCALE);
    }).on("startPlayMode", event => {
      this.knobs.map(knob => knob.mode = _MultiFuncKnob.default.MODES.PLAYMODE);
    }).on("stop", async event => {
      this.knobs.map(knob => knob.mode = _MultiFuncKnob.default.MODES.DEFAULT);
    }).on("save", async event => {
      const data = JSON.stringify(this.knobs.map(knob => knob.toObject()));
      try {
        await (0, _tools.save)(data);
      } catch (error) {
        console.log(error);
      }
    });
    try {
      console.log("YOOO");
      this.inputMidi = new _midi.default.Input().on('message', (deltaTime, [status, number, value]) => {
        const [type, channel] = [status & 0xF0, status & 0x0F];
        // console.log(`c: ${channel} n: ${number} v: ${value} d: ${deltaTime}`);
        switch (type) {
          case MIDI_MESSAGE.CONTROL_CHANGE:
            if (channel == 0 || channel == 1) {
              this.knobs[number].update(channel, value);
            } else if (channel == 3) {
              this.sideButtons.update(number, value, deltaTime);
            }
            break;
        }
      });
      console.log("hello");
      console.log(this.inputMidi);
    } catch (error) {
      console.log("error");
      console.log(error);
      process.exit();
    }
    console.log("C");
    this.inputVirtual = new _midi.default.Input().on('message', (deltaTime, [status, number, value]) => {
      const [type, channel] = [status & 0xF0, status & 0x0F];
      switch (type) {
        case MIDI_MESSAGE.CONTROL_CHANGE:
          // load(`${conf.directory}/cc.${channel}.${number}.cycl`)
          // 	.then((confs, id) => {
          // 		confs.map(conf=>this.knobs[conf.id].setup(conf))
          // 	});
          break;
      }
    });
    console.log("D");
    this.outputDisplay = new _midi.default.Output();
    this.outputVirtual = new _midi.default.Output();
    console.log("E");
    const [inID, outID] = this.getMidiID(midiName);
    if (inID < 0 || outID < 0) throw new Error(`MIDI_DEVICE (${midiName}) not found`);
    console.log("F");
    this.inputMidi.openPort(inID);
    this.outputDisplay.openPort(outID);
    console.log("G");
    const [inBID, outBID] = this.getMidiID(midiOutName);
    if (inBID < 0 || outBID < 0) {
      console.log("H");
      console.log(`MIDI_DEVICE (${midiOutName}) not found`);
      this.inputVirtual.openVirtualPort(midiOutName);
      this.outputVirtual.openVirtualPort(midiOutName);
      console.log("I");
    } else {
      console.log("J");
      this.inputVirtual.openPort(inBID);
      this.outputVirtual.openPort(outBID);
      console.log("K");
    }
    this.knobs = new Array(knobPerBank).fill(0).map((_, id) => new _MultiFuncKnob.default(id, 0, this.display.bind(this), this.virtualMidi.bind(this)));
    this.knobs.map(knob => knob.mode = _MultiFuncKnob.default.MODES.DEFAULT);
    console.log("L");
  }
  display(channel, id, value) {
    this.outputDisplay.sendMessage([MIDI_MESSAGE.CONTROL_CHANGE | channel, id, value]);
  }
  virtualMidi(channel, id, value) {
    this.outputVirtual.sendMessage([MIDI_MESSAGE.CONTROL_CHANGE | channel, id, value]);
  }
  getMidiID(midiName) {
    return [new Array(this.inputMidi.getPortCount()).fill(0).map((_, id) => this.inputMidi.getPortName(id)).findIndex(value => midiName == value), new Array(this.outputDisplay.getPortCount()).fill(0).map((_, id) => this.outputDisplay.getPortName(id)).findIndex(value => midiName == value)];
  }
  async watchdog() {
    const [inID, outID] = this.getMidiID(midiName);
    if (inID < 0 || outID < 0) throw new Error(`MIDI_DEVICE (${midiName}) HAS BEEN DISCONNECTED`);
    await (0, _tools.wait)(watchdogInterval);
    return this.watchdog();
  }
}
exports.default = MidiFighterTwister;