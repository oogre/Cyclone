"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _EventHandler = _interopRequireDefault(require("./common/EventHandler.js"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
/*----------------------------------------*\
  midiFighter - Value.js
  @author Evrard Vincent (vincent@ogre.be)
  @Date:   2023-02-20 21:57:22
  @Last Modified time: 2023-02-20 23:47:07
\*----------------------------------------*/

class Value extends _EventHandler.default {
  constructor(value = 0, loop = true) {
    super();
    super.createHandler("change");
    super.createHandler("reset");
    super.createHandler("store");
    this._initValue = value;
    this._value = this.initValue;
    this.min = 0;
    this.max = 128;
    this.loop = loop;
  }
  limitter(val) {
    if (this.loop) {
      return (val + this.max) % this.max;
    } else {
      return Math.min(Math.max(val, this.min), this.max - 1);
    }
  }
  set value(val) {
    this._value = this.limitter(val);
    super.trig("change", this);
  }
  get value() {
    return this._value;
  }
  set initValue(val) {
    this._initValue = this.limitter(val);
  }
  get initValue() {
    return this._initValue;
  }
  increase() {
    this.value += 1;
  }
  decrease() {
    this.value -= 1;
  }
  resetValue() {
    this.value = this.initValue;
    super.trig("reset", this);
  }
  resetInitValue() {
    this.initValue = this.value;
    super.trig("store", this);
  }
  static INC_VALUE = 65;
  static DEC_VALUE = 63;
}
exports.default = Value;