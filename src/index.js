#!/usr/local/bin/node
/*----------------------------------------*\
  midiFighter - index.js
  @author Evrard Vincent (vincent@ogre.be)
  @Date:   2023-02-15 14:05:42
  @Last Modified time: 2024-03-23 21:39:15
\*----------------------------------------*/

import {wait} from "./common/tools.js";
import conf from "./common/config.js";
import MidiFighterTwister from './MidiFighterTwister.js';

const {

  MIDI_DEVICE_NAME:midiName, 
  VIRTUAL_MIDI_DEVICE_NAME:midiOutName,
  PROCESS_NAME:midiOutName2,
  WATCHDOG_INTERVAL:watchdogInterval,
  KNOB_PER_BANK:knobPerBank,
  BANK:bankLength
} = conf;

const MIDI_MESSAGE = {
  NOTE_OFF : 0x80,
  NOTE_ON : 0x90,
  KEY_PRESSURE : 0xA0,
  CONTROL_CHANGE : 0xB0,
  PROGRAM_CHANGE : 0xC0,
  CHANNEL_PRESSURE : 0xD0,
  PITCH_BEND : 0xE0
};

const {
  PROCESS_NAME:processName,
  START_DELAY:startDelay
} = conf;

process.title = processName;


(async ()=>{
  await wait(startDelay);
  return (()=>{
      const display = new MidiFighterTwister();
  })();
})()
// // .then(async mft => mft.watchdog())
// .catch(error => {
//   console.log(error)
//   process.exit(0);
// });

