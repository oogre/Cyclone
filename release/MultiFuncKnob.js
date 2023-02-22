"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _Button = _interopRequireDefault(require("./Button.js"));
var _Value = _interopRequireDefault(require("./Value.js"));
var _Display = _interopRequireDefault(require("./Display.js"));
var _EventHandler = _interopRequireDefault(require("./common/EventHandler.js"));
var _Recorder = _interopRequireDefault(require("./Recorder.js"));
var _Player = _interopRequireDefault(require("./Player.js"));
var _config = _interopRequireDefault(require("./common/config.js"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
/*----------------------------------------*\
  midiFighter - MultiFuncKnob.js
  @author Evrard Vincent (vincent@ogre.be)
  @Date:   2023-02-20 22:05:35
  @Last Modified time: 2023-02-22 01:54:38
\*----------------------------------------*/

const {
  BANK: bankLenght,
  KNOB_PER_BANK: knobPerBank,
  VIRTUAL_MIDI_CONTROL_CHANNEL: CONTROL_CHANNEL
} = _config.default;
const {
  KNOB_COLORS: knobColors
} = _config.default.UI;
class MultiFuncKnob extends _EventHandler.default {
  constructor(id, value = 0, displaySender, virtualMidiSender) {
    super();
    this.id = id;
    this._mode = null;
    this.virtualMidiSender = (channel, value) => {
      virtualMidiSender(channel, id, value);
    };
    this.display = new _Display.default((channel, value) => {
      displaySender(channel, id, value);
    });
    this.value = new _Value.default(value).on("change", ({
      target: {
        _value: value
      }
    }) => {
      this.virtualMidiSender(CONTROL_CHANNEL, value);
      switch (this.mode) {
        case MultiFuncKnob.MODES.RECORD:
        case MultiFuncKnob.MODES.DEFAULT:
          this.display.value = value;
          break;
      }
    }).on("reset", () => {
      switch (this.mode) {
        case MultiFuncKnob.MODES.RECORD:
        case MultiFuncKnob.MODES.DEFAULT:
          this.display.anims.reset();
          break;
      }
    }).on("store", () => {
      switch (this.mode) {
        case MultiFuncKnob.MODES.RECORD:
        case MultiFuncKnob.MODES.DEFAULT:
          this.display.anims.store();
          break;
      }
    });
    this.timeScale = new _Value.default(64, false).on("change", ({
      target: {
        _value: value
      }
    }) => {
      switch (this.mode) {
        case MultiFuncKnob.MODES.TIMESCALE:
          this.display.value = value;
          this.player.timeScale = value;
          break;
      }
    }).on("reset", () => {
      switch (this.mode) {
        case MultiFuncKnob.MODES.TIMESCALE:
          this.display.anims.reset();
          break;
        default:
          break;
      }
    });
    this.playMode = new _Value.default(0).on("change", ({
      target: {
        _value: value
      }
    }) => {
      switch (this.mode) {
        case MultiFuncKnob.MODES.PLAYMODE:
          this.player.playMode = value;
          this.display.value = this.player.playMode;
          break;
      }
    }).on("reset", () => {
      switch (this.mode) {
        case MultiFuncKnob.MODES.PLAYMODE:
          this.display.anims.reset();
          break;
      }
    });
    this.btn = new _Button.default(this.id).on("doublePressed", () => {
      switch (this.mode) {
        case MultiFuncKnob.MODES.RECORD:
        case MultiFuncKnob.MODES.DEFAULT:
          this.value.resetValue();
          break;
      }
    }).on("longPressed", () => {
      switch (this.mode) {
        case MultiFuncKnob.MODES.DEFAULT:
          if (this.player.isPlaying) {
            this.player.stop();
          } else {
            this.value.resetInitValue();
          }
          break;
      }
    }).on("released", () => {
      switch (this.mode) {
        case MultiFuncKnob.MODES.DEFAULT:
          if (this.player.isPlaying) {
            this.player.pause();
          } else {
            this.player.play();
          }
          break;
      }
    });
    this.player = new _Player.default().on("tic", ({
      target: {
        value
      }
    }) => {
      this.virtualMidiSender(CONTROL_CHANNEL, value);
      switch (this.mode) {
        case MultiFuncKnob.MODES.DEFAULT:
          this.display.value = value;
          break;
      }
    }).on("stop", () => {
      this.display.anims.reset();
    }).on("pmChange", ({
      target: {
        _playMode: {
          name
        }
      }
    }) => {
      this.display.anims.playMode[name]().then(() => {
        this.display.value = this.player.playMode;
      });
    });
    this.recorder = new _Recorder.default(this.value).on("newRecord", ({
      target: {
        record
      }
    }) => {
      this.playMode.value = 0;
      this.player.playMode = 0;
      this.player.track = record;
    });
  }
  set mode(value) {
    switch (value) {
      case MultiFuncKnob.MODES.PLAYMODE:
        if (!this.player.isLoaded) return;
        this._mode = MultiFuncKnob.MODES.PLAYMODE;
        this.display.stateColor = 60;
        this.display.anims.playMode[this.player._playMode.name]().then(() => this.display.value = this.player.playMode);
        break;
      case MultiFuncKnob.MODES.RECORD:
        if (this.player.isLoaded) return;
        if (this._mode == MultiFuncKnob.MODES.DEFAULT) {
          this.recorder.startRecord();
        }
        this._mode = MultiFuncKnob.MODES.RECORD;
        this.display.stateColor = 80;
        break;
      case MultiFuncKnob.MODES.TIMESCALE:
        if (!this.player.isLoaded) return;
        this._mode = MultiFuncKnob.MODES.TIMESCALE;
        this.display.stateColor = 100;
        this.display.value = this.timeScale.value;
        break;
      case MultiFuncKnob.MODES.DEFAULT:
        if (this._mode == null) {
          this.display.displayIntensity(0);
          this.display.stateColor = 115;
          this.display.anims.fadeIn(this.id * 20);
        }
        if (!this.player.isLoaded && this._mode == MultiFuncKnob.MODES.RECORD) {
          this.recorder.stopRecord();
        }
        this._mode = MultiFuncKnob.MODES.DEFAULT;
        this.display.value = 0;
        this.display.stateColor = 120;
        this.display.displayIntensity(1);
        this.display.value = this.value.value;
        break;
    }
  }
  get mode() {
    return this._mode;
  }
  update(channel, value) {
    const isSwitch = channel == 1;
    switch (this.mode) {
      case MultiFuncKnob.MODES.PLAYMODE:
        if (isSwitch) this.playMode.resetValue();else if (_Value.default.INC_VALUE == value) this.playMode.increase();else if (_Value.default.DEC_VALUE == value) this.playMode.decrease();
        break;
      case MultiFuncKnob.MODES.TIMESCALE:
        if (isSwitch) this.timeScale.resetValue();else if (_Value.default.INC_VALUE == value) this.timeScale.increase();else if (_Value.default.DEC_VALUE == value) this.timeScale.decrease();
        break;
      case MultiFuncKnob.MODES.RECORD:
      case MultiFuncKnob.MODES.DEFAULT:
        if (isSwitch) this.btn.pressed = _Button.default.PRESS_VALUE == value;else if (_Value.default.INC_VALUE == value) this.value.increase();else if (_Value.default.DEC_VALUE == value) this.value.decrease();
        break;
    }
  }
  static MODES = Object.freeze({
    DEFAULT: Symbol("DEFAULT"),
    RECORD: Symbol("RECORD"),
    TIMESCALE: Symbol("TIMESCALE"),
    TIMESCALE: Symbol("PLAYMODE")
  });
}
exports.default = MultiFuncKnob;