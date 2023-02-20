"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _Button = _interopRequireDefault(require("./Button.js"));
var _Value = _interopRequireDefault(require("./Value.js"));
var _Display = _interopRequireDefault(require("./Display.js"));
var _EventHandler = _interopRequireDefault(require("./common/EventHandler.js"));
var _tools = require("./common/tools.js");
var _config = _interopRequireDefault(require("./common/config.js"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
/*----------------------------------------*\
  midiFighter - MultiFuncKnob.js
  @author Evrard Vincent (vincent@ogre.be)
  @Date:   2023-02-20 22:05:35
  @Last Modified time: 2023-02-21 00:50:00
\*----------------------------------------*/

const {
  BANK: bankLenght,
  KNOB_PER_BANK: knobPerBank
} = _config.default;
const {
  KNOB_COLORS: knobColors
} = _config.default.UI;
class MultiFuncKnob extends _EventHandler.default {
  constructor(id, value = 0, displaySender) {
    super();
    this.id = id;
    this.display = new _Display.default((channel, value) => {
      displaySender(channel, id, value);
    });
    this._mode = MultiFuncKnob.MODES.DEFAULT;
    this.btn = new _Button.default(this.id).on("doublePressed", () => {
      switch (this.mode) {
        case MultiFuncKnob.MODES.RECORD:
          break;
        case MultiFuncKnob.MODES.PLAY:
          break;
        case MultiFuncKnob.MODES.TIMESCALE:
          break;
        default:
          this.value.resetValue();
          break;
      }
    }).on("longPressed", () => {
      switch (this.mode) {
        case MultiFuncKnob.MODES.RECORD:
          break;
        case MultiFuncKnob.MODES.PLAY:
          break;
        case MultiFuncKnob.MODES.TIMESCALE:
          break;
        default:
          this.value.resetInitValue();
          break;
      }
    });
    this.value = new _Value.default(value).on("change", ({
      target
    }) => {
      switch (this.mode) {
        case MultiFuncKnob.MODES.RECORD:
          break;
        case MultiFuncKnob.MODES.PLAY:
          break;
        case MultiFuncKnob.MODES.TIMESCALE:
          break;
        default:
          this.display.value = target._value;
          break;
      }
    }).on("reset", () => {
      switch (this.mode) {
        case MultiFuncKnob.MODES.RECORD:
          break;
        case MultiFuncKnob.MODES.PLAY:
          break;
        case MultiFuncKnob.MODES.TIMESCALE:
          break;
        default:
          this.display.anims.reset();
          break;
      }
    }).on("store", () => {
      switch (this.mode) {
        case MultiFuncKnob.MODES.RECORD:
          break;
        case MultiFuncKnob.MODES.PLAY:
          break;
        case MultiFuncKnob.MODES.TIMESCALE:
          break;
        default:
          this.display.anims.store();
          break;
      }
    });
    this.timeScale = new _Value.default(64, false).on("change", ({
      target
    }) => {
      switch (this.mode) {
        case MultiFuncKnob.MODES.RECORD:
          break;
        case MultiFuncKnob.MODES.PLAY:
          break;
        case MultiFuncKnob.MODES.TIMESCALE:
          this.display.value = target._value;
          break;
        default:
          break;
      }
    }).on("reset", () => {
      switch (this.mode) {
        case MultiFuncKnob.MODES.RECORD:
          break;
        case MultiFuncKnob.MODES.PLAY:
          break;
        case MultiFuncKnob.MODES.TIMESCALE:
          this.display.anims.reset();
          break;
        default:
          break;
      }
    }).on("store", () => {
      switch (this.mode) {
        case MultiFuncKnob.MODES.RECORD:
          break;
        case MultiFuncKnob.MODES.PLAY:
          break;
        case MultiFuncKnob.MODES.TIMESCALE:
          break;
        default:
          break;
      }
    });
  }
  set mode(value) {
    switch (value) {
      case MultiFuncKnob.MODES.RECORD:
        this._mode = MultiFuncKnob.MODES.RECORD;
        this.display.stateColor = 80;
        break;
      case MultiFuncKnob.MODES.PLAY:
        this._mode = MultiFuncKnob.MODES.PLAY;
        break;
      case MultiFuncKnob.MODES.TIMESCALE:
        this._mode = MultiFuncKnob.MODES.TIMESCALE;
        this.display.stateColor = 100;
        this.display.value = this.timeScale.value;
        break;
      default:
        this._mode = MultiFuncKnob.MODES.DEFAULT;
        this.display.value = 0;
        this.display.anims.fadeOut(this.id * 5).then(() => {
          this.display.stateColor = 120;
          this.display.anims.fadeIn(this.id * 5);
          this.display.value = this.value.value;
        });
        break;
    }
  }
  get mode() {
    return this._mode;
  }
  update(channel, value) {
    const isSwitch = channel == 1;
    switch (this.mode) {
      case MultiFuncKnob.MODES.RECORD:
        break;
      case MultiFuncKnob.MODES.PLAY:
        break;
      case MultiFuncKnob.MODES.TIMESCALE:
        if (isSwitch) this.timeScale.resetValue();else if (_Value.default.INC_VALUE == value) this.timeScale.increase();else if (_Value.default.DEC_VALUE == value) this.timeScale.decrease();
        break;
      default:
        if (isSwitch) this.btn.pressed = _Button.default.PRESS_VALUE == value;else if (_Value.default.INC_VALUE == value) this.value.increase();else if (_Value.default.DEC_VALUE == value) this.value.decrease();
        break;
    }
  }
  static MODES = Object.freeze({
    DEFAULT: Symbol("DEFAULT"),
    RECORD: Symbol("RECORD"),
    PLAY: Symbol("PLAY"),
    TIMESCALE: Symbol("TIMESCALE")
  });
}
exports.default = MultiFuncKnob;