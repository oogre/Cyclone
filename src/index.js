#!/usr/local/bin/node
/*----------------------------------------*\
  midiFighter - index.js
  @author Evrard Vincent (vincent@ogre.be)
  @Date:   2023-02-15 14:05:42
  @Last Modified time: 2023-02-22 20:17:31
\*----------------------------------------*/
import MidiFighterTwister from "./MidiFighterTwister.js";
import {wait} from "./common/tools.js";
import conf from "./common/config.js";

const {
  PROCESS_NAME:processName,
  START_DELAY:startDelay
} = conf;

process.title = processName;

(async ()=>{
  await wait(startDelay);
  return new MidiFighterTwister();
})()
.then(async mft => mft.watchdog())
.catch(error => {
  console.log(error)
  process.exit(0);
});

