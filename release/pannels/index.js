"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var _RegularPannel = require("./RegularPannel.js");
Object.keys(_RegularPannel).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _RegularPannel[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _RegularPannel[key];
    }
  });
});