"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _underscore = _interopRequireDefault(require("underscore"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
class EventHandler {
  constructor() {
    this._eventHandlers = {
      "*": []
    };
  }
  createHandler(name) {
    if (this._ishandlerExist(name)) {
      return;
    }
    this._eventHandlers[name] = [];
  }
  on(name, action) {
    if (!this._ishandlerExist(name)) {
      return;
    }
    if (!_underscore.default.isFunction(action)) {
      return;
    }
    this._eventHandlers[name].push(action);
    return this;
  }
  off(name, action) {
    if (!this._ishandlerExist(name)) {
      return;
    }
    if (!_underscore.default.isFunction(action)) {
      return;
    }
    const index = this._eventHandlers[name].indexOf(action);
    if (index < 0) return;
    this._eventHandlers[name].splice(index, 1);
  }
  trig(name, obj = {}) {
    if (!this._ishandlerExist(name)) {
      return;
    }
    const event = {
      target: {
        ...obj
      },
      time: new Date().getTime(),
      eventName: name
    };
    this._eventHandlers["*"].map(handler => handler(event));
    this._eventHandlers[name].map(handler => handler(event));
  }
  _ishandlerExist(name) {
    return this._eventHandlers[name];
  }
}
var _default = EventHandler;
exports.default = _default;