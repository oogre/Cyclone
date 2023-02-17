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
  @Last Modified time: 2023-02-17 01:28:28
\*----------------------------------------*/

const {
  MIDI_DEVICE_NAME: midiName,
  VIRTUAL_MIDI_DEVICE_NAME: midiOutName
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
    this.sideButtons = new _SideButtons.default().on("startRec", async event => {
      this.recorder.start();
    }).on("stopRec", async event => {
      this.recorder.stop();
    }).on("reverse", async event => {
      this.recorder.reverse();
    });
    this.knobs = new _Knobs.default().on("changeValue", ({
      target: {
        id,
        _value
      }
    }) => {
      this.changeValue(id, _value);
    }).on("pressed", async ({
      target: {
        id,
        color
      }
    }) => {
      this.recorder.removeAll(id);
      this.changeColor(id, clearRecColor);
      await (0, _tools.wait)(strobDebay);
      this.changeColor(id, color);
    }).on("storeValue", async ({
      target: {
        id,
        color
      }
    }) => {
      this.changeColor(id, storeColor);
      await (0, _tools.wait)(strobDebay);
      this.changeColor(id, color);
    }).on("resetValue", async ({
      target: {
        id,
        color
      }
    }) => {
      this.changeColor(id, resetColor);
      await (0, _tools.wait)(strobDebay);
      this.changeColor(id, color);
    }).on("created", ({
      target: {
        id,
        color
      }
    }) => {
      this.changeColor(id, color);
      this.changeValue(id, color);
    });
    this.recorder = new _Recorder.default().plug(this.knobs).on("reverse", async () => {
      this.knobs.map(({
        id
      }) => this.changeColor(id, reverseColor));
      await (0, _tools.wait)(strobDebay);
      this.knobs.map(({
        id,
        color
      }) => this.changeColor(id, color));
    }).on("startRec", async () => {
      this.knobs.map(({
        id
      }) => this.changeColor(id, recordColor));
    }).on("stopRec", async () => {
      this.knobs.map(({
        id,
        color
      }) => this.changeColor(id, color));
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
      switch (type) {
        case MIDI_MESSAGE.CONTROL_CHANGE:
          // console.log(`c: ${channel} n: ${number} v: ${value} d: ${deltaTime}`);
          if (channel == 0) {
            this.knobs.update(number, value, deltaTime);
          } else if (channel == 3) {
            this.sideButtons.update(number, value, deltaTime);
          }
          break;
      }
    });
    this.outputDisplay = new _midi.default.Output();
    this.outputVirtual = new _midi.default.Output();
    const [inID, outID] = this.getMidiFighterTwisterID();
    this.inputMidi.openPort(inID);
    this.outputDisplay.openPort(outID);
    this.outputVirtual.openVirtualPort(midiOutName);
  }
  getMidiFighterTwisterID() {
    return [new Array(this.inputMidi.getPortCount()).fill(0).map((_, id) => this.inputMidi.getPortName(id)).findIndex(value => midiName == value), new Array(this.outputDisplay.getPortCount()).fill(0).map((_, id) => this.outputDisplay.getPortName(id)).findIndex(value => midiName == value)];
  }
  changeValue(knobID, value) {
    this.sendCC(this.outputVirtual, knobID, value);
    this.sendCC(this.outputDisplay, knobID * 2 + 1, value);
  }
  changeColor(knobID, color) {
    this.sendCC(this.outputDisplay, knobID * 2, color);
  }
  sendCC(output, id, value) {
    output.sendMessage([MIDI_MESSAGE.CONTROL_CHANGE | 0x00, id, value]);
  }
}
exports.default = MidiFighterTwister;