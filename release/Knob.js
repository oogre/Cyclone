"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _Pixel = _interopRequireDefault(require("./Pixel.js"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
/*----------------------------------------*\
  cyclone - Knob.js
  @author Evrard Vincent (vincent@ogre.be)
  @Date:   2024-03-21 15:11:59
  @Last Modified time: 2024-03-22 19:28:57
\*----------------------------------------*/

class Knob extends _Pixel.default {
  constructor(id, midiSender, changeHandler = () => {}) {
    super(id, midiSender);
    this.changeHandler = changeHandler;
  }
  increase() {
    this.value = (this.value + 1) % 128;
    this.changeHandler(this.value);
  }
  decrease() {
    this.value = (this.value + 127) % 128;
    this.changeHandler(this.value);
  }
  set input([channel, value, deltaTime]) {
    if (channel == 0 || channel == 1) {
      if (value == 65) {
        this.increase();
      } else if (value == 63) {
        this.decrease();
      }
    } else if (channel == 3) {}
  }
}
exports.default = Knob;