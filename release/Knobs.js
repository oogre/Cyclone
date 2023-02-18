"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _EventHandler = _interopRequireDefault(require("./common/EventHandler.js"));
var _Knob = _interopRequireDefault(require("./Knob.js"));
var _config = _interopRequireDefault(require("./common/config.js"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
/*----------------------------------------*\
  midiFighter - Knobs.js
  @author Evrard Vincent (vincent@ogre.be)
  @Date:   2023-02-15 16:23:06
  @Last Modified time: 2023-02-18 17:22:20
\*----------------------------------------*/

const {
  BANK: bankLenght,
  KNOB_PER_BANK: knobPerBank
} = _config.default;
const {
  STROB_DELAY: strobDebay,
  RECORD_COLOR: recordColor,
  REVERSE_COLOR: reverseColor
} = _config.default.UI;
class Knobs extends _EventHandler.default {
  constructor() {
    super();
    super.createHandler("changeValue");
    super.createHandler("pressed");
    super.createHandler("released");
    super.createHandler("resetValue");
    super.createHandler("storeValue");
    super.createHandler("created");
    this.knobs = new Array(knobPerBank * bankLenght).fill(0).map((_, k) => {
      return new _Knob.default(k).on("*", event => {
        super.trig(event.eventName, event.target);
      });
    });
  }
  getKnob(id) {
    id = Math.abs(id);
    id %= this.knobs.length;
    return this.knobs[id % this.knobs.length];
  }
  getKnobByMidiAddress(midiNumber) {
    return this.getKnob(Math.floor(Math.abs(midiNumber)));
  }
  map(action) {
    return this.knobs.map(action);
  }
  update(channel, midiNumber, value) {
    const isSwitch = channel == 1;
    const knob = this.getKnobByMidiAddress(midiNumber);
    if (isSwitch) {
      if (value == 127) {
        knob.pressed = true;
      } else if (value == 0) {
        knob.pressed = false;
      }
    } else {
      if (value == 63) {
        knob.decrease();
      } else if (value == 65) {
        knob.increase();
      }
    }
  }
}
exports.default = Knobs;