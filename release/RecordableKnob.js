"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _Knob = _interopRequireDefault(require("./Knob.js"));
var _tools = require("./common/tools.js");
var _EventHandler = _interopRequireDefault(require("./common/EventHandler.js"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
/*----------------------------------------*\
  midiFighter - RecordableKnob.js
  @author Evrard Vincent (vincent@ogre.be)
  @Date:   2023-02-17 08:47:02
  @Last Modified time: 2023-02-20 21:53:14
\*----------------------------------------*/

class RecordableKnob extends _Knob.default {
  constructor(id, value = 0) {
    super(id, value);
    super.createHandler("reverse");
    super.createHandler("pingpong");
    super.createHandler("pause");
    super.createHandler("startRec");
    super.createHandler("stopRec");
    super.createHandler("startTS");
    super.createHandler("stopTS");
    this.enableRec = true;
    this._timeScale = 1;
    this.isTimeScaling = false;
    this.recordHandler = event => this.record(event);
    this.records = [];
  }
  set timeScale(val) {
    this._timeScale = val;
  }
  get timeScale() {
    return this._timeScale;
  }
  increase(step = 1) {
    if (this.isTimeScaling) {} else {
      super.value += step;
    }
  }
  decrease(step = 1) {
    if (this.isTimeScaling) {} else {
      super.value -= step;
    }
  }
  set value(val) {
    if (this.isTimeScaling) {} else {
      super._value = (val + 128) % 128;
      super.trig("changeValue", this);
    }
  }
  get value() {
    if (this.isTimeScaling) {} else {
      return super._value;
    }
  }
  timeScaleStart() {
    this.isTimeScaling = true;
    super.trig("startTS", this);
  }
  timeScaleStop() {
    this.isTimeScaling = false;
    super.trig("stopTS", this);
  }
  reverse() {
    this.records = this.records.map(rec => {
      rec.events = rec.events.reverse();
      return rec;
    });
    super.trig("reverse", this);
  }
  startRec() {
    this.records.push({
      events: [{
        eventName: "start",
        time: new Date().getTime(),
        target: this
      }]
    });
    this.record({
      eventName: "changeValue",
      time: new Date().getTime(),
      target: this
    });
    super.on("changeValue", this.recordHandler);
    super.trig("startRec", this);
  }
  stopRec() {
    super.off("changeValue", this.recordHandler);
    this.record({
      eventName: "changeValue",
      time: new Date().getTime(),
      target: this
    });
    super.trig("stopRec", this);
    const prevRec = this.records[this.records.length - 1];
    prevRec.events = prevRec.events.filter(({
      eventName
    }) => eventName != "start");
    if (prevRec.events.length > 2) {
      this.play(this.records.length - 1);
    } else {
      this.records.pop();
    }
  }
  erase() {
    this.records.pop();
  }
  record(event) {
    if (event.target.enableRec) {
      const prevRec = this.records[this.records.length - 1];
      const prevEvt = prevRec.events[prevRec.events.length - 1];
      prevRec.events.push({
        time: event.time,
        delay: event.time - prevEvt.time,
        value: event.target._value
      });
    }
  }
  set valueUnrecordable(val) {
    this.enableRec = false;
    this.value = val;
    this.enableRec = true;
    ;
  }
  async play(__ID__) {
    try {
      if (__ID__ >= this.records.length) return;
      let {
        events
      } = this.records[__ID__];
      if (events.length <= 1) {
        this.records.splice(__ID__, 1);
        return;
      }
      const {
        value,
        delay,
        eventName
      } = events[0];
      events.push(events.shift());
      if (value != undefined && delay != undefined) {
        this.valueUnrecordable = value;
        await (0, _tools.wait)(events[0].delay * this.timeScale);
      }
      await this.play(__ID__);
    } catch (error) {
      this.records.splice(__ID__, 1);
    }
  }
}
exports.default = RecordableKnob;