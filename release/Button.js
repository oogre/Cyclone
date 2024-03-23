"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
/*----------------------------------------*\
  cyclone - Button.js
  @author Evrard Vincent (vincent@ogre.be)
  @Date:   2024-03-22 13:31:52
  @Last Modified time: 2024-03-22 13:41:16
\*----------------------------------------*/

class AntiBounce {
  constructor(debouce) {
    this._lastActivation = 0;
    this._debouce = debouce;
  }
  isValid() {
    const t = new Date().getTime();
    if (t - this._lastActivation > this._debouce) {
      this._lastActivation = t;
      return true;
    }
    return false;
  }
}
class Button extends AntiBounce {
  constructor(actionHandler) {
    super(100);
    this.pressHandler = () => {};
    this.releasedHandler = () => {};
  }
  onPressed(pressHandler) {
    this.pressHandler = pressHandler;
    return this;
  }
  onPressed(releasedHandler) {
    this.releasedHandler = releasedHandler;
    return this;
  }
  update(value) {
    if (this.isValid()) {
      if (value == 127) this.pressHandler();
      if (value == 0) this.releasedHandler();
    }
  }
}
exports.default = Button;