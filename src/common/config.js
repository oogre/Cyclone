/*----------------------------------------*\
  midiFighter - config.js
  @author Evrard Vincent (vincent@ogre.be)
  @Date:   2023-02-16 12:35:44
  @Last Modified time: 2024-03-20 22:41:18
\*----------------------------------------*/
import fs from 'fs-extra';
import os from "os";

const dataDirectory = `${os.homedir()}/Documents/MFT`;

let rawConf = fs.readFileSync(`${dataDirectory}/conf.json`, "utf8");
const conf = JSON.parse(rawConf);

conf.directory = dataDirectory;

export default conf;
