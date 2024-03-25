#!/usr/local/bin/node
/*----------------------------------------*\
  midiFighter - index.js
  @author Evrard Vincent (vincent@ogre.be)
  @Date:   2023-02-15 14:05:42
  @Last Modified time: 2024-03-24 18:05:38
\*----------------------------------------*/
"use strict";

var _tools = require("./common/tools.js");
var _config = _interopRequireDefault(require("./common/config.js"));
var _MidiFighterTwister = _interopRequireDefault(require("./MidiFighterTwister.js"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
const {
  PROCESS_NAME: processName,
  START_DELAY: startDelay,
  WATCHDOG_INTERVAL: watchdogInterval
} = _config.default;
process.title = processName;
(async () => {
  await (0, _tools.wait)(startDelay);
  return new _MidiFighterTwister.default();
})().then(async mft => mft.watchdog(watchdogInterval)).catch(error => {
  console.log(error);
  process.exit(0);
});