"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _tools = require("./common/tools.js");
var _EventHandler = _interopRequireDefault(require("./common/EventHandler.js"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
/*----------------------------------------*\
  midiFighter - Player.js
  @author Evrard Vincent (vincent@ogre.be)
  @Date:   2023-02-21 14:27:31
  @Last Modified time: 2023-10-04 15:14:45
\*----------------------------------------*/

class Interval {
  constructor(name, min, max, value) {
    this.name = name;
    this.min = min;
    this.max = max;
    this.value = value;
  }
  isInside(other) {
    return this.min <= other && other <= this.max;
  }
}
class Player extends _EventHandler.default {
  constructor() {
    super();
    super.createHandler("tic");
    super.createHandler("play");
    super.createHandler("stop");
    super.createHandler("pause");
    super.createHandler("pmChange");
    this._track = [];
    this.cursor = 0;
    this.inc = 1;
    this._trackArchive = [];
    this._timeScale = 1;
    this._playMode = Player.NORMAL;
    this.isPlaying = false;
    this.stopAsked = false;
  }
  set timeScale(val) {
    let tmp = 128 - val;
    if (tmp < 64) {
      tmp = Math.sqrt(tmp * 0.015625);
    } else {
      tmp = (tmp - 64) * 0.015625;
      tmp = tmp * tmp * 9 + 1;
    }
    this._timeScale = Math.min(Math.max(tmp, 0.1), 10);
  }
  set playMode(val) {
    if (this._playMode != Player.NORMAL && Player.NORMAL.isInside(val)) {
      this._playMode = Player.NORMAL;
      this._track = [...this._trackArchive];
      this.inc = 1;
      this.trig("pmChange", this);
    } else if (this._playMode != Player.REVERSE && Player.REVERSE.isInside(val)) {
      this._playMode = Player.REVERSE;
      this._track = [...this._trackArchive];
      this.inc = -1;
      this.trig("pmChange", this);
    } else if (this._playMode != Player.PING_PONG && Player.PING_PONG.isInside(val)) {
      this._playMode = Player.PING_PONG;
      this._track = [...this._trackArchive];
      this.inc = 1;
      this.trig("pmChange", this);
    } else if (this._playMode != Player.RANDOM && Player.RANDOM.isInside(val)) {
      this._playMode = Player.RANDOM;
      this.inc = 1;
      this._track = this.randomizer(this._trackArchive, [10, 20]);
      this.trig("pmChange", this);
    }
  }
  get playMode() {
    return this._playMode.value;
  }
  set track(val) {
    this._track = val;
    this._trackArchive = [...this._track];
  }
  get track() {
    this._track;
  }
  randomizer(cmds, [inArowMin, inArowMax]) {
    const cmdListTmp = [...cmds];
    let cmdList = [];
    while (cmdListTmp.length > 0) {
      cmdList = cmdList.concat(cmdListTmp.splice(Math.floor(Math.random() * cmdListTmp.length), Math.floor((0, _tools.lerp)(inArowMin, inArowMax, Math.random()))));
    }
    return cmdList;
  }
  async loop() {
    if (!this.isPlaying) return;
    try {
      let {
        value,
        delay
      } = this._track[this.cursor];
      if (delay > 0) {
        await (0, _tools.wait)(delay * this._timeScale);
      }
      super.trig("tic", {
        value
      });
      if (Player.PING_PONG == this._playMode && (this.cursor >= this._track.length || this.cursor <= 0)) {
        this.inc = -this.inc;
      }
      this.cursor = (this.cursor + this.inc + this._track.length) % this._track.length;
      if (this.stopAsked) {
        this.stopAsked = false;
        this._track.length = 0;
        this._trackArchive.length = 0;
        this.cursor = 0;
      }
      if (this.isPlaying) {
        await this.loop();
      }
    } catch (error) {
      // console.log(this._track.length, this.cursor, this._track);
      // console.log("error", error);
      this.stopAsked = false;
      this.pause();
    }
  }
  get isLoaded() {
    return this._track.length > 0;
  }
  stop() {
    super.trig("stop");
    this.isPlaying = false;
    this._track.length = 0;
    this._trackArchive.length = 0;
    this.stopAsked = true;
    // console.log("stop");
  }

  pause() {
    super.trig("pause");
    this.isPlaying = false;
    // console.log("pause");
  }

  play() {
    super.trig("play");
    this.isPlaying = true;
    this.loop();
    // console.log("play");
  }

  setup({
    track,
    isPlaying
  }) {
    this.play();
    this.stop();
    setTimeout(() => {
      this.stopAsked = false;
      this.track = track;
      if (isPlaying) this.play();
    }, 1000);
  }
  toObject() {
    return {
      track: this._trackArchive,
      isPlaying: this.isPlaying
    };
  }
  static NORMAL = new Interval("NORMAL", 0, 31, 1);
  static REVERSE = new Interval("REVERSE", 32, 63, 40);
  static PING_PONG = new Interval("PING_PONG", 64, 95, 86);
  static RANDOM = new Interval("RANDOM", 96, 127, 127);
}
exports.default = Player;