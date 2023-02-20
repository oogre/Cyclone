"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _midi = _interopRequireDefault(require("midi"));
var _EventHandler = _interopRequireDefault(require("./common/EventHandler.js"));
var _Knobs = _interopRequireDefault(require("./Knobs.js"));
var _SideButtons = _interopRequireDefault(require("./SideButtons.js"));
var _Recorder = _interopRequireDefault(require("./Recorder.js"));
var _tools = require("./common/tools.js");
var _config = _interopRequireDefault(require("./common/config.js"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
/*----------------------------------------*\
  midiFighter - MidiFighterTwister.js
  @author Evrard Vincent (vincent@ogre.be)
  @Date:   2023-02-15 16:35:32
  @Last Modified time: 2023-02-19 06:29:13
\*----------------------------------------*/

const {
  MIDI_DEVICE_NAME: midiName,
  VIRTUAL_MIDI_DEVICE_NAME: midiOutName,
  WATCHDOG_INTERVAL: watchdogInterval,
  KNOB_PER_BANK: knobPerBank,
  BANK: bankLength
} = _config.default;
const {
  STROB_DELAY: strobDebay,
  RECORD_COLOR: recordColor,
  REVERSE_COLOR: reverseColor,
  RESET_COLOR: resetColor,
  STORE_COLOR: storeColor,
  CLEAR_REC_COLOR: clearRecColor
} = _config.default.UI;
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
    this.currentBANK = 0;
    this.sideButtons = new _SideButtons.default().on("startRec", async event => {
      this.recorder.start();
    }).on("stopRec", async event => {
      this.recorder.stop();
    }).on("reverse", async event => {
      this.recorder.reverse();
    }).on("nextBank", async event => {
      this.currentBANK++;
      this.currentBANK %= bankLength;
      this.knobs.map(({
        id,
        color
      }) => this.displayColor(id, color));
      this.knobs.map(({
        id,
        _value
      }) => this.displayValue(id, _value));
    }).on("prevBank", async event => {
      this.currentBANK += bankLength - 1;
      this.currentBANK %= bankLength;
      this.knobs.map(({
        id,
        color
      }) => this.displayColor(id, color));
      this.knobs.map(({
        id,
        _value
      }) => this.displayValue(id, _value));
    });
    this.knobs = new _Knobs.default().on("changeValue", ({
      target: {
        id,
        _value
      }
    }) => {
      this.displayValue(id, _value);
      this.sendValue(id, _value);
    }).on("pressed", async ({
      target: {
        id,
        color
      }
    }) => {
      this.recorder.removeAll(id);
      this.displayColor(id, color + clearRecColor);
      await (0, _tools.wait)(strobDebay);
      this.displayColor(id, color);
    }).on("storeValue", async ({
      target: {
        id,
        color
      }
    }) => {
      this.displayColor(id, storeColor);
      await (0, _tools.wait)(strobDebay);
      this.displayColor(id, color);
    }).on("resetValue", async ({
      target: {
        id,
        color
      }
    }) => {
      this.displayColor(id, resetColor);
      await (0, _tools.wait)(strobDebay);
      this.displayColor(id, color);
    }).on("created", ({
      target: {
        id,
        color
      }
    }) => {
      this.displayColor(id, color);
      this.displayValue(id, 0);
      this.sendValue(id, 0);
    });
    this.recorder = new _Recorder.default().plug(this.knobs).on("reverse", async () => {
      this.knobs.map(({
        id
      }) => this.displayColor(id, reverseColor));
      await (0, _tools.wait)(strobDebay);
      this.knobs.map(({
        id,
        color
      }) => this.displayColor(id, color));
    }).on("startRec", async () => {
      this.knobs.map(({
        id
      }) => this.displayColor(id, recordColor));
    }).on("stopRec", async () => {
      this.knobs.map(({
        id,
        color
      }) => this.displayColor(id, color));
    }).on("playEvent", ({
      target: {
        knobId,
        value
      }
    }) => {
      this.knobs.getKnob(knobId).valueUnrecordable = value;
    });
    this.inputMidi = new _midi.default.Input().on('message', (deltaTime, [status, number, value]) => {
      const [type, channel] = [status & 0xF0, status & 0x0F];
      // console.log(`c: ${channel} n: ${number} v: ${value} d: ${deltaTime}`);
      switch (type) {
        case MIDI_MESSAGE.CONTROL_CHANGE:
          if (channel == 0 || channel == 1) {
            this.knobs.update(channel, number + knobPerBank * this.currentBANK, value, deltaTime);
          } else if (channel == 3) {
            this.sideButtons.update(number, value, deltaTime);
          }
          break;
      }
    });
    this.outputDisplay = new _midi.default.Output();
    this.outputVirtual = new _midi.default.Output();
    const [inID, outID] = this.getMidiFighterTwisterID();
    if (inID < 0 || outID < 0) throw new Error(`MIDI_DEVICE (${midiName}) not found`);
    this.inputMidi.openPort(inID);
    this.outputDisplay.openPort(outID);
    this.outputVirtual.openVirtualPort(midiOutName);
    this.welcomeAnim();
  }
  async welcomeAnim() {
    this.knobs.map(async ({
      id,
      color
    }, k) => {
      this.displayIntensity(id, 0);
      this.displayColor(id, color);
      await (0, _tools.wait)(k * 150);
      (async () => {
        for (let j = 0; j <= 1; j += 0.02) {
          this.displayIntensity(id, j);
          await (0, _tools.wait)(5);
        }
      })();
    });
  }
  getMidiFighterTwisterID() {
    return [new Array(this.inputMidi.getPortCount()).fill(0).map((_, id) => this.inputMidi.getPortName(id)).findIndex(value => midiName == value), new Array(this.outputDisplay.getPortCount()).fill(0).map((_, id) => this.outputDisplay.getPortName(id)).findIndex(value => midiName == value)];
  }
  hasToBeDisplayed(knobID) {
    const minKobID = this.currentBANK * knobPerBank;
    const maxKobID = this.currentBANK * knobPerBank + knobPerBank;
    return knobID >= minKobID && knobID < maxKobID;
  }
  displayValue(knobID, value) {
    if (this.hasToBeDisplayed(knobID)) {
      this.sendCC(this.outputDisplay, 0x00, knobID - knobPerBank * this.currentBANK, value);
    }
  }
  sendValue(knobID, value) {
    this.sendCC(this.outputVirtual, 0x00, knobID, value);
  }
  displayColor(knobID, color) {
    if (this.hasToBeDisplayed(knobID)) {
      this.sendCC(this.outputDisplay, 0x01, knobID - knobPerBank * this.currentBANK, color % 128);
    }
  }
  displayIntensity(knobID, intensity) {
    intensity = Math.min(Math.max(intensity, 0), 1);
    if (this.hasToBeDisplayed(knobID)) {
      this.sendCC(this.outputDisplay, 0x02, knobID - knobPerBank * this.currentBANK, (0, _tools.lerp)(17, 49, intensity));
    }
  }
  sendCC(output, channel, id, value) {
    output.sendMessage([MIDI_MESSAGE.CONTROL_CHANGE | channel, id, value]);
  }
  async watchdog() {
    const [inID, outID] = this.getMidiFighterTwisterID();
    if (inID < 0 || outID < 0) throw new Error(`MIDI_DEVICE (${midiName}) HAS BEEN DISCONNECTED`);
    await (0, _tools.wait)(1000);
    return this.watchdog();
  }
}
exports.default = MidiFighterTwister;