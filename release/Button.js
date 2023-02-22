"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _EventHandler = _interopRequireDefault(require("./common/EventHandler.js"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
/*----------------------------------------*\
  midiFighter - Button.js
  @author Evrard Vincent (vincent@ogre.be)
  @Date:   2023-02-15 18:13:39
  @Last Modified time: 2023-02-22 01:38:18
\*----------------------------------------*/

const LONG_PRESS_TIMEOUT = 333;
const DOUBLE_PRESS_TIMEOUT = 333;
class Button extends _EventHandler.default {
  constructor(id) {
    super(id);
    super.createHandler("pressed");
    super.createHandler("released");
    super.createHandler("longPressed");
    super.createHandler("doublePressed");
    this.id = id;
    this._counter = 0;
    this._isPressed = false;
    this._wasPressed = false;
    this._pressTimer;
    this._pressAt = 0;
  }
  set counter(val) {
    this._counter = val;
  }
  get counter() {
    return this._counter;
  }
  set pressed(val) {
    this._wasPressed = this._isPressed;
    this._isPressed = !!val;
    if (this._isPressed && !this._wasPressed) {
      const now = new Date().getTime();
      const pressDelay = now - this._pressAt;
      this._pressAt = now;
      if (pressDelay < DOUBLE_PRESS_TIMEOUT) {
        super.trig("doublePressed", this);
      }
      super.trig("pressed", this);
      this._pressTimer = setTimeout(() => super.trig("longPressed", this), LONG_PRESS_TIMEOUT);
    }
    if (!this._isPressed && this._wasPressed) {
      clearTimeout(this._pressTimer);
      super.trig("released", this);
      this.counter++;
    }
  }
  get pressed() {
    return this._isPressed;
  }
  static PRESS_VALUE = 127;
}
exports.default = Button;