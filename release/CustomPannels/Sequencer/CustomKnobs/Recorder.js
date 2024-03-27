"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _tools = require("../../../common/tools.js");
/*----------------------------------------*\
  MFT - Recorder.js
  @author Evrard Vincent (vincent@ogre.be)
  @Date:   2024-03-25 20:03:26
  @Last Modified time: 2024-03-26 16:17:57
\*----------------------------------------*/

class Recorder {
  constructor(knob, midiOut) {
    this.knob = knob;
    this.color = [255, 0, 0];
    this._band = [];
  }
  disactive() {}
  async active() {
    this.knob.color = this.color;
    this._band.length = 0;
    this.record("start", this.knob.value);
    return this;
  }
  isValid() {
    return this._band.length > 1;
  }
  get band() {
    return this._band;
  }
  record(name, value) {
    this._band.push({
      eventName: name,
      time: (0, _tools.getTime)(),
      value: value
    });
  }
}
exports.default = Recorder;