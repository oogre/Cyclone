"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _Recorder = _interopRequireDefault(require("./CustomKnobs/Recorder.js"));
var _Player = _interopRequireDefault(require("./CustomKnobs/Player.js"));
var _Pause = _interopRequireDefault(require("./CustomKnobs/Pause.js"));
var _Stop = _interopRequireDefault(require("./CustomKnobs/Stop.js"));
var _Button = _interopRequireDefault(require("../../Bases/Button.js"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
/*----------------------------------------*\
  MFT - SequencerKnob.js
  @author Evrard Vincent (vincent@ogre.be)
  @Date:   2024-03-25 19:49:56
  @Last Modified time: 2024-04-02 19:50:04
\*----------------------------------------*/

class SequencerKnob {
  constructor(knob, midiOut) {
    this.recorder = new _Recorder.default(knob, midiOut);
    this.player = new _Player.default(knob, midiOut);
    this.pause = new _Pause.default(knob, midiOut);
    this.stop = new _Stop.default(knob, midiOut);
    this.value = 0;
    this.current = this.stop;
    knob.onPressed(() => {
      this.current = this.recorder;
    }).onReleased(releasedType => {
      if (releasedType == _Button.default.RELEASED_TYPE.DOUBLE) {
        knob.value = this.value = 0;
        return this.current = this.stop;
      } else if (this.recorder.isValid()) {
        this.player.band = this.recorder.band;
        return this.current = this.player;
      } else if (this.previous == this.player) {
        return this.current = this.pause;
      } else if (this.previous == this.pause) {
        return this.current = this.player;
      }
      this.current = this.stop;
    }).onTurn(inc => {
      this.value = (this.value + inc + 128) % 128;
      knob.value = this.value;
      if (this.current == this.recorder) {
        this.current.record("change", this.value);
      }
      midiOut(knob.id, knob.value);
    });
  }
  set order(value) {
    this.player.order = value;
  }
  set speed(value) {
    this.player.speed = value;
  }
  set current(value) {
    if (this._current != value) {
      if (!!this._current) {
        this._current.disactive();
        this._previous = this._current;
      }
      this._current = value;
      this._current.active();
    }
  }
  set color(value) {
    this.stop.color = value;
  }
  get current() {
    return this._current;
  }
  get previous() {
    return this._previous;
  }
  onStop(handler) {
    this.stop.onChange(handler);
    return this;
  }
}
exports.default = SequencerKnob;