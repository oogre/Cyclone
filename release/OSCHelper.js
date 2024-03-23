"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _nodeOsc = require("node-osc");
var _config = _interopRequireDefault(require("./common/config.js"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
const {
  OSC_IN_PORT,
  OSC_OUT_PORT
} = _config.default;
class Osc {
  constructor(inPort, outPort) {
    this.debug = false;
    this.server = new _nodeOsc.Server(inPort, '0.0.0.0', () => {
      console.log('OSC Server is listening');
    });
    this.server.on('message', msg => {
      this.debug && console.log(`Message: ${msg}`);
    });
    this.client = new _nodeOsc.Client('127.0.0.1', outPort);
  }
  send(address, ...values) {
    this.client.send(address, ...values);
  }
  on(address, callback) {
    this.server.on(address, callback);
  }
  quiet(flag = false) {
    this.debug = !!flag;
  }
  verbose(flag = true) {
    this.debug = !!flag;
  }
}
const osc = new Osc(OSC_IN_PORT, OSC_OUT_PORT);
var _default = osc;
exports.default = _default;