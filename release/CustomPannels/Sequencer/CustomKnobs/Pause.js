"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _tools = require("../../../common/tools.js");
/*----------------------------------------*\
  MFT - Speeder.js
  @author Evrard Vincent (vincent@ogre.be)
  @Date:   2024-03-25 19:46:30
  @Last Modified time: 2024-03-26 16:15:17
\*----------------------------------------*/

class Pause {
  constructor(knob, midiOut) {
    this.knob = knob;
    this.color = [0, 255, 255];
  }
  disactive() {}
  async active() {
    this.knob.color = this.color;
    return this;
  }
}
exports.default = Pause;