"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _EventHandler = _interopRequireDefault(require("./common/EventHandler.js"));
var _Button = _interopRequireDefault(require("./Button.js"));
var _config = _interopRequireDefault(require("./common/config.js"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
/*----------------------------------------*\
  midiFighter - SideButtons.js
  @author Evrard Vincent (vincent@ogre.be)
  @Date:   2023-02-15 18:26:28
  @Last Modified time: 2023-02-21 23:32:48
\*----------------------------------------*/

const {
  HOLD_TO_RECORD: holdToRecord,
  SIDE_BTN_DICT: sideBtnDict,
  SIDE_BTN_ACTION: sideBtnAction
} = _config.default;
class SideButtons extends _EventHandler.default {
  constructor() {
    super();
    super.createHandler("startRec");
    super.createHandler("startTimeScale");
    super.createHandler("startPlayMode");
    super.createHandler("stop");
    super.createHandler("nextBank");
    super.createHandler("prevBank");
    this.started = false;
    this.buttons = new Array(sideBtnDict.length).fill(0).map((_, k) => {
      return new _Button.default(k).on("*", event => {
        super.trig(event.eventName, event.target);
      }).on("pressed", ({
        target: {
          id
        }
      }) => {
        switch (id) {
          case sideBtnAction.indexOf("PREV_BANK"):
            super.trig("prevBank");
            break;
          case sideBtnAction.indexOf("NEXT_BANK"):
            super.trig("nextBank");
            break;
          case sideBtnAction.indexOf("RECORD"):
          case sideBtnAction.indexOf("PLAY_MODE"):
          case sideBtnAction.indexOf("TIME_SCALE"):
            if (holdToRecord || !this.started) {
              if (id == sideBtnAction.indexOf("RECORD")) super.trig("startRec");else if (id == sideBtnAction.indexOf("PLAY_MODE")) super.trig("startPlayMode");else if (id == sideBtnAction.indexOf("TIME_SCALE")) super.trig("startTimeScale");
              this.started = true;
            } else {
              this.started = false;
              super.trig("stop");
            }
            break;
        }
      }).on("released", ({
        target: {
          id
        }
      }) => {
        switch (id) {
          case sideBtnAction.indexOf("RECORD"):
          case sideBtnAction.indexOf("TIME_SCALE"):
          case sideBtnAction.indexOf("PLAY_MODE"):
            if (holdToRecord) {
              super.trig("stop");
            }
            break;
          case sideBtnAction.indexOf("REVERSE"):
            this.hasToReverse = false;
            break;
          case sideBtnAction.indexOf("TIME_SCALE"):
            super.trig("stop");
            break;
        }
      });
    });
  }
  getButton(id) {
    id = Math.abs(id);
    id %= this.buttons.length;
    return this.buttons[id % this.buttons.length];
  }
  getKnobByMidiAddress(midiNumber) {
    return this.getButton(sideBtnDict.indexOf(midiNumber));
  }
  update(midiNumber, value) {
    const button = this.getKnobByMidiAddress(midiNumber);
    if (value == 127) {
      button.pressed = true;
    } else if (value == 0) {
      button.pressed = false;
    }
  }
}
exports.default = SideButtons;