#!/usr/local/bin/node
/*----------------------------------------*\
  midiFighter - index.js
  @author Evrard Vincent (vincent@ogre.be)
  @Date:   2023-02-15 14:05:42
  @Last Modified time: 2023-04-26 16:36:23
\*----------------------------------------*/
"use strict";

var _MidiFighterTwister = _interopRequireDefault(require("./MidiFighterTwister.js"));
var _tools = require("./common/tools.js");
var _config = _interopRequireDefault(require("./common/config.js"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
const {
  PROCESS_NAME: processName,
  START_DELAY: startDelay
} = _config.default;
process.title = processName;
console.log('Environment Variables:', process.env);
(async () => {
  await (0, _tools.wait)(startDelay);
  return new _MidiFighterTwister.default();
})().then(async mft => mft.watchdog()).catch(error => {
  console.log(error);
  process.exit(0);
});