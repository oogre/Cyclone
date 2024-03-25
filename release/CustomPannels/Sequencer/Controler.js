"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _tools = require("../../common/tools.js");
/*----------------------------------------*\
  MFT - Controler.js
  @author Evrard Vincent (vincent@ogre.be)
  @Date:   2024-03-25 00:47:44
  @Last Modified time: 2024-03-25 00:51:51
\*----------------------------------------*/

class Speeder {
  constructor(knob, midiOut) {
    this.knob = knob;
    this.value = 64;
    this.color = [255, 0, 255];
    this.onTurn = inc => {
      this.value = (0, _tools.constrain)(0, 128, this.value + inc);
      this.knob.value = this.value;
      midiOut(this.knob.id, this.knob.value);
      this.changeHandler(this.knob.value);
    };
    this.changeHandler = () => {};
  }
  active() {
    this.knob.value = this.value;
    this.knob.color = this.color;
    this.knob.onTurn(this.onTurn);
    return this;
  }
  onChange(handler) {
    this.changeHandler = handler;
    return this;
  }
}
class Orderer {
  constructor(knob, midiOut) {
    this.knob = knob;
    this.value = 0;
    this.color = [0, 255, 0];
    this.onTurn = inc => {
      this.value = (this.value + inc + 128) % 128;
      this.knob.value = this.value;
      midiOut(this.knob.id, this.knob.value);
      this.changeHandler(this.knob.value);
    };
    this.changeHandler = () => {};
  }
  active() {
    this.knob.value = this.value;
    this.knob.color = this.color;
    this.knob.onTurn(this.onTurn);
    return this;
  }
  onChange(handler) {
    this.changeHandler = handler;
    return this;
  }
}
class Controler {
  constructor(knob, midiOut) {
    this.speeder = new Speeder(knob, midiOut);
    this.orderer = new Orderer(knob, midiOut);
    this.current = this.speeder;
    knob.onPressed(() => this.current = this.orderer).onReleased(() => this.current = this.speeder);
  }
  set current(value) {
    value.active();
  }
  onSpeeder(handler) {
    this.speeder.onChange(handler);
    return this;
  }
  onOrderer(handler) {
    this.orderer.onChange(handler);
    return this;
  }
}
exports.default = Controler;