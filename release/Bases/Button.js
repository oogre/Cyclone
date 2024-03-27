"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _Enum = _interopRequireDefault(require("./Enum.js"));
var _tools = require("../common/tools.js");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
/*----------------------------------------*\
  cyclone - Button.js
  @author Evrard Vincent (vincent@ogre.be)
  @Date:   2024-03-22 13:31:52
  @Last Modified time: 2024-03-26 11:19:38
\*----------------------------------------*/

const AntiBounce = debouce => {
  let _lastActivation = 0;
  let _debouce = debouce;
  return () => {
    const t = (0, _tools.getTime)();
    if (t - _lastActivation > _debouce) {
      _lastActivation = t;
      return true;
    }
    return false;
  };
};
class Button {
  static RELEASED_TYPE = new _Enum.default({
    NORMAL: 0,
    LONG: 1,
    DOUBLE: 2
  });
  constructor() {
    this.debounce = AntiBounce(50);
    this.pressHandler = () => {};
    this.releasedHandler = () => {};
    this.longClickHandler = () => {};
    this.doubleClickHandler = () => {};
    this.timeAtPressed = 0;
    this.timeAtReleased = 0;
  }
  onPressed(handler) {
    this.pressHandler = handler;
    return this;
  }
  onReleased(handler) {
    this.releasedHandler = handler;
    return this;
  }
  update(value, deltaTime) {
    const t = (0, _tools.getTime)();
    if (this.debounce()) {
      if (value == 127) {
        this.pressHandler();
        this.timeAtPressed = t;
      } else {
        if (t - this.timeAtReleased < 250) {
          this.releasedHandler(Button.RELEASED_TYPE.DOUBLE);
        } else if (t - this.timeAtPressed > 250) {
          this.releasedHandler(Button.RELEASED_TYPE.LONG);
        } else {
          this.releasedHandler(Button.RELEASED_TYPE.NORMAL);
        }
        this.timeAtReleased = t;
      }
    }
  }
}
exports.default = Button;