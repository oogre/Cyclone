"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _fsExtra = _interopRequireDefault(require("fs-extra"));
var _os = _interopRequireDefault(require("os"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
/*----------------------------------------*\
  midiFighter - config.js
  @author Evrard Vincent (vincent@ogre.be)
  @Date:   2023-02-16 12:35:44
  @Last Modified time: 2024-03-20 22:41:18
\*----------------------------------------*/

const dataDirectory = `${_os.default.homedir()}/Documents/MFT`;
let rawConf = _fsExtra.default.readFileSync(`${dataDirectory}/conf.json`, "utf8");
const conf = JSON.parse(rawConf);
conf.directory = dataDirectory;
var _default = conf;
exports.default = _default;