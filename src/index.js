#!/usr/local/bin/node
/*----------------------------------------*\
  midiFighter - index.js
  @author Evrard Vincent (vincent@ogre.be)
  @Date:   2023-02-15 14:05:42
  @Last Modified time: 2023-04-26 16:36:23
\*----------------------------------------*/
import MidiFighterTwister from "./MidiFighterTwister.js";
import {wait} from "./common/tools.js";
import conf from "./common/config.js";

const {
  PROCESS_NAME:processName,
  START_DELAY:startDelay
} = conf;

process.title = processName;
console.log('Environment Variables:', process.env);

(async ()=>{
  await wait(startDelay);
  return new MidiFighterTwister();
})()
.then(async mft => mft.watchdog())
.catch(error => {
  console.log(error)
  process.exit(0);
});

