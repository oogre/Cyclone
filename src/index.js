#!/usr/local/bin/node
/*----------------------------------------*\
  midiFighter - index.js
  @author Evrard Vincent (vincent@ogre.be)
  @Date:   2023-02-15 14:05:42
  @Last Modified time: 2023-02-16 12:51:20
\*----------------------------------------*/
import MidiFighterTwister from "./MidiFighterTwister.js";
import {wait} from "./common/tools.js";
import conf from "./common/config.js";

const {
  START_DELAY:startDelay
} = conf;

(async ()=>{
  await wait(startDelay);
  new MidiFighterTwister();
})()


