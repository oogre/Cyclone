/*----------------------------------------*\
  midiFighter - config.js
  @author Evrard Vincent (vincent@ogre.be)
  @Date:   2023-02-16 12:35:44
  @Last Modified time: 2023-02-16 12:40:58
\*----------------------------------------*/
import fs from 'fs-extra';
import os from "os";

let rawConf = fs.readFileSync(`${__dirname}/../../config/conf.json`, "utf8");


const conf = JSON.parse(rawConf)
export default conf;
