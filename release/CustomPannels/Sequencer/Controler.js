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
  @Last Modified time: 2024-03-25 17:30:39
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
  disactive() {}
  async active() {
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
    this.value = 0;
    this.knob = knob;
    this.color = [0, 255, 0];
    this._active = false;
    this.changeHandler = () => {};
    this.onTurn = async inc => {
      this.value = (this.value + inc + 128) % 128;
      await this.setCurrent();
      this.knob.value = this.value;
      midiOut(this.knob.id, this.knob.value);
    };
    this._orders = [{
      type: "NORMAL",
      limits: [0, 32],
      anim: async () => {
        for (let v = 0; v < 128; v++) {
          this.knob.value = v;
          await (0, _tools.wait)(2);
        }
      },
      develop: values => [...values]
    }, {
      type: "REVERSE",
      limits: [32, 64],
      anim: async () => {
        for (let v = 127; v >= 0; v--) {
          this.knob.value = v;
          await (0, _tools.wait)(2);
        }
      },
      develop: values => [...values].reverse()
    }, {
      type: "PING_PONG",
      limits: [64, 96],
      anim: async () => {
        for (let v = 0; v < 128; v++) {
          this.knob.value = v;
          await (0, _tools.wait)(2);
        }
        for (let v = 127; v >= 0; v--) {
          this.knob.value = v;
          await (0, _tools.wait)(2);
        }
      },
      develop: values => [...values, ...[...values].reverse()]
    }, {
      type: "RANDOM",
      limits: [96, 128],
      anim: async () => {
        const values = new Array(128).fill(0).map((_, id) => id).sort(() => Math.random() - 0.5);
        for (const v of values) {
          this.knob.value = v;
          await (0, _tools.wait)(2);
        }
      },
      develop: values => [...value].sort(() => Math.random() - 0.5)
    }];
    this.setCurrent();
  }
  async setCurrent(forceAnim = false) {
    const current = this._orders.find(({
      limits
    }) => this.value >= limits[0] && this.value < limits[1]);
    if (forceAnim || !this._currentOrder || this._currentOrder.type != current.type) {
      this._currentOrder = current;
      if (this._active || forceAnim) {
        await this._currentOrder.anim();
      }
    }
  }
  get current() {
    return this._currentOrder;
  }
  disactive() {
    this.changeHandler(this.current);
    this._active = false;
  }
  async active() {
    console.log("ACTIVE");
    this._active = true;
    this.knob.color = this.color;
    await this.setCurrent(true);
    this.knob.value = this.value;
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
    if (this._current != value) {
      if (!!this._current) this._current.disactive();
      this._current = value;
      this._current.active();
    }
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