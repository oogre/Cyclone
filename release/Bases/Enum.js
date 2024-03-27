"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _tools = require("../common/tools.js");
/*----------------------------------------*\
  MFT - Enum.js
  @author Evrard Vincent (vincent@ogre.be)
  @Date:   2024-03-26 11:02:07
  @Last Modified time: 2024-03-26 11:16:21
\*----------------------------------------*/

class Enum {
  constructor(desc) {
    this.desc = desc;
    Object.keys(this.desc).map(entry => {
      this[`is${entry}`] = value => this.includes(value) && value == entry;
      this[entry] = this.desc[entry];
    });
  }
  includes(value) {
    return Object.values(this.desc).includes(value);
  }
  toString() {
    return `{${Object.keys(this.desc).map(key => `${key} : ${this.desc[key]}`).join(", ")}}`;
  }
}
exports.default = Enum;