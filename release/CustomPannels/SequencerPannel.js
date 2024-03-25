"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _Pannel = _interopRequireDefault(require("../Bases/Pannel.js"));
var _tools = require("../common/tools.js");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
/*----------------------------------------*\
  MFT - SequencerPannel.js
  @author Evrard Vincent (vincent@ogre.be)
  @Date:   2024-03-24 22:58:05
  @Last Modified time: 2024-03-25 00:44:35
\*----------------------------------------*/

class Recorder {
  constructor(knob, midiOut) {
    this.isRecording = false;
    this.isPlaying = false;
    this.band = [];
    this._timeScale = 1;
    knob.color = [0, 64, 255];
    knob.onPressed(async () => {
      this.isRecording = true;
      knob.color = [255, 0, 0];
      this.isPlaying && (await this.askToStop());
      this.band.length = 0;
      this.record("start", knob.value);
    }).onReleased(() => {
      this.isRecording = false;
      knob.color = [0, 64, 255];
      this.record("stop", knob.value);
      this.play();
      this.isPlaying = true;
    }).onDoubleClick(async () => {
      knob.color = [255, 255, 0];
      this.isPlaying && (await this.askToStop());
      this.band.length = 0;
      knob.color = [0, 64, 255];
    }).onTurn(inc => {
      knob.value = (knob.value + inc + 128) % 128;
      this.isRecording && this.record("change", knob.value);
      midiOut(knob.id, knob.value);
    });
    this.knob = knob;
    this.midiOut = midiOut;
    this.hasToStop = null;
  }
  record(name, value) {
    this.band.push({
      eventName: name,
      time: (0, _tools.getTime)(),
      value: value
    });
  }
  stop() {
    this.knob.strobTag = 0.0;
    this.isPlaying = false;
    if (this.hasToStop != null) this.hasToStop();
    this.hasToStop = null;
  }
  async play() {
    this.knob.strobTag = 0.5;
    const current = this.band[0];
    const next = this.band[1 % this.band.length];
    if (!current || !next) return this.stop();
    this.knob.value = current.value;
    this.midiOut(this.knob.id, this.knob.value);
    this.band.push(this.band.shift());
    await (0, _tools.wait)((next.time - current.time) * this._timeScale);
    if (this.hasToStop != null) return this.stop();
    this.play();
  }
  async askToStop() {
    await new Promise((resolve, reject) => {
      this.hasToStop = resolve;
    });
  }
  set speed(val) {
    let tmp = 128 - val;
    if (tmp < 64) {
      tmp = Math.pow(tmp * 0.015625, 5);
    } else {
      tmp = (tmp - 64) * 0.015625;
      tmp = tmp * tmp * 9 + 1;
    }
    this._timeScale = Math.min(Math.max(tmp, 0.1), 10);
  }
}
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
class Controller {
  constructor(knob, midiOut) {
    this.speeder = new Speeder(knob, midiOut);
    this.orderer = new Orderer(knob, midiOut);
    this.current = this.speeder;
    knob.onPressed(() => {
      this.current = this.orderer;
    }).onReleased(() => {
      this.current = this.speeder;
    });
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
class SequencerPannel extends _Pannel.default {
  constructor(id, midiDisplay, midiOut) {
    super(id, midiDisplay);
    this.recorders = this.knobs.filter((knob, id) => id % 4 == 0 || id % 4 == 3).map(knob => new Recorder(knob, midiOut));
    this.speeds = this.knobs.filter((knob, id) => id % 4 == 1 || id % 4 == 2).map(knob => new Controller(knob, midiOut)).map((controler, id) => {
      controler.onSpeeder(value => this.recorders[id].speed = value);
      controler.onOrderer(value => console.log(value));
    });
  }
}
exports.default = SequencerPannel;