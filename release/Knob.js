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
  @Last Modified time: 2023-02-17 01:24:09
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
    this.color = (0, _tools.lerp)(knobColors[0], knobColors[1], Math.floor(id / knobPerBank) / bankLenght);
    this._initValue = value;
    this._value = this.initValue;
    this.on("doublePressed", () => this.resetValue());
    this.on("longPressed", () => this.resetInitValue());
    this.enableRec = true;
    setTimeout(() => super.trig("created", this), 20);
    setTimeout(() => super.trig("changeValue", this), 20);
  }
  increase(step = 1) {
    this.value += step;
  }
  decrease(step = 1) {
    this.value -= step;
  }
  resetValue() {
    this.value = this.initValue;
    super.trig("resetValue", this);
  }
  resetInitValue() {
    this.initValue = this.value;
    super.trig("storeValue", this);
  }
  set valueUnrecordable(val) {
    this.enableRec = false;
    this.value = val;
    this.enableRec = true;
    ;
  }
  set value(val) {
    this._value = (val + 127) % 127;
    super.trig("changeValue", this);
  }
  get value() {
    return this._value;
  }
  set initValue(val) {
    this._initValue = (val + 127) % 127;
  }
  get initValue() {
    return this._initValue;
  }
}
exports.default = Knob;