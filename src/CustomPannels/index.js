/*----------------------------------------*\
  MFT - index.js
  @author Evrard Vincent (vincent@ogre.be)
  @Date:   2024-03-23 21:26:06
  @Last Modified time: 2024-03-25 00:49:18
\*----------------------------------------*/


import Pannel from '../Bases/Pannel.js';
import RegularPannel from './RegularPannel.js';
import SequencerPannel from './Sequencer';


// import path from 'path';
// import {readdir} from 'fs/promises';
// export const values = (async ()=>{
//   const directoryPath = path.join(__dirname);
//   const files = await readdir(directoryPath);
//   console.log(files);
//   return { Pannel, RegularPannel }
// })();



export { Pannel, RegularPannel, SequencerPannel }