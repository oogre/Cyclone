#!/usr/local/bin/node
/*----------------------------------------*\
  midiFighter - index.js
  @author Evrard Vincent (vincent@ogre.be)
  @Date:   2023-02-15 14:05:42
  @Last Modified time: 2024-03-24 18:05:38
\*----------------------------------------*/

import {wait} from "./common/tools.js";
import conf from "./common/config.js";
import MidiFighterTwister from './MidiFighterTwister.js';

const {
  PROCESS_NAME:processName,
  START_DELAY:startDelay,
  WATCHDOG_INTERVAL:watchdogInterval,
} = conf;

process.title = processName;


(async ()=>{
  await wait(startDelay);
  return new MidiFighterTwister();
})()
.then(async mft => mft.watchdog(watchdogInterval))
.catch(error => {
  console.log(error)
  process.exit(0);
});

