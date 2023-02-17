"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.wait = exports.lerp = exports.isNumber = exports.isInteger = exports.isFloat = exports.constrain = void 0;
/*----------------------------------------*\
  midiFighter - tools.js
  @author Evrard Vincent (vincent@ogre.be)
  @Date:   2023-02-15 19:31:42
  @Last Modified time: 2023-02-15 20:07:02
\*----------------------------------------*/

const isFloat = n => n === +n && n !== (n | 0);
exports.isFloat = isFloat;
const isInteger = n => n === +n && n === (n | 0);
exports.isInteger = isInteger;
const isNumber = n => isFloat(n) || isInteger(n);
exports.isNumber = isNumber;
const constrain = (min, max, value) => Math.min(Math.max(max, min), Math.max(Math.min(max, min), value));
exports.constrain = constrain;
const lerp = (a, b, amount) => a + (b - a) * constrain(0, 1, amount);
exports.lerp = lerp;
const wait = async time => isNumber(time) ? new Promise(s => setTimeout(() => s(), time)) : null;
exports.wait = wait;