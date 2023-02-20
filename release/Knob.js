"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _Button = _interopRequireDefault(require("./Button.js"));
var _tools = require("./common/tools.js");
var _config = _interopRequireDefault(require("./common/config.js"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
/*----------------------------------------*\
  midiFighter - Knob.js
  @author Evrard Vincent (vincent@ogre.be)
  @Date:   2023-02-15 16:22:22
  @Last Modified time: 2023-02-20 21:42:57
\*----------------------------------------*/

const {
  BANK: bankLenght,
  KNOB_PER_BANK: knobPerBank
} = _config.default;
const {
  KNOB_COLORS: knobColors
} = _config.default.UI;
class Knob extends _Button.default {
  constructor(id, value = 0) {
    super(id);
    super.createHandler("created");
    super.createHandler("changeValue");
    super.createHandler("resetValue");
    super.createHandler("storeValue");
    const mix = Math.floor(id / knobPerBank) / (bankLenght - 1);
    this.color = (0, _tools.lerp)(knobColors[0], knobColors[1], mix);
    this._initValue = value;
    this._value = this.initValue;
    this.on("doublePressed", () => this.resetValue());
    this.on("longPressed", () => this.resetInitValue());
    setTimeout(() => super.trig("created", this), 20);
    setTimeout(() => super.trig("changeValue", this), 20);
  }
  increase(step = 1) {
    this.value += step;
  }
  decrease(step = 1) {
    this.value -= step;
  }
  set value(val) {
    this._value = (val + 128) % 128;
    super.trig("changeValue", this);
  }
  get value() {
    return this._value;
  }
  resetValue() {
    this.value = this.initValue;
    super.trig("resetValue", this);
  }
  resetInitValue() {
    this.initValue = this.value;
    super.trig("storeValue", this);
  }
  set initValue(val) {
    this._initValue = (val + 128) % 128;
  }
  get initValue() {
    return this._initValue;
  }
}
exports.default = Knob;