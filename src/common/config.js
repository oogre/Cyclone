/*----------------------------------------*\
  midiFighter - config.js
  @author Evrard Vincent (vincent@ogre.be)
  @Date:   2023-02-16 12:35:44
  @Last Modified time: 2023-02-22 15:44:18
\*----------------------------------------*/
import fs from 'fs-extra';
import os from "os";

const dataDirectory = `${os.homedir()}/Documents/cyclone`;

let rawConf = fs.readFileSync(`${dataDirectory}/conf.json`, "utf8");
const conf = JSON.parse(rawConf);

conf.directory = dataDirectory;

export default conf;
