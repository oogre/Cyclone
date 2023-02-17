#!/usr/local/bin/node
/*----------------------------------------*\
  midiFighter - index.js
  @author Evrard Vincent (vincent@ogre.be)
  @Date:   2023-02-15 14:05:42
  @Last Modified time: 2023-02-16 12:51:20
\*----------------------------------------*/
"use strict";

var _MidiFighterTwister = _interopRequireDefault(require("./MidiFighterTwister.js"));
var _tools = require("./common/tools.js");
var _config = _interopRequireDefault(require("./common/config.js"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
const {
  START_DELAY: startDelay
} = _config.default;
(async () => {
  await (0, _tools.wait)(startDelay);
  new _MidiFighterTwister.default();
})();