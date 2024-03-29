/*----------------------------------------*\
  midiFighter - tools.js
  @author Evrard Vincent (vincent@ogre.be)
  @Date:   2023-02-15 19:31:42
  @Last Modified time: 2024-03-26 14:03:28
\*----------------------------------------*/


import os from "os";
import {spawn} from "child_process";
import fs from 'fs-extra';

export const isFloat = (n) => n === +n && n !== (n|0);
export const isInteger = (n) => n === +n && n === (n|0);
export const isNumber = (n) => isFloat(n) || isInteger(n);
export const constrain = (min, max, value) => Math.min( Math.max(max, min), Math.max(Math.min(max, min), value));
export const lerp = (a, b, amount) => a + (b - a) * constrain(0, 1, amount);
export const wait = async (time) => isNumber(time) ? new Promise(s => setTimeout(()=>s(), time)) : null ;
export const capitalize = ([firstLetter, ...restOfWord]) => firstLetter.toUpperCase() + restOfWord.join(""); 
export const getTime = ()=>(new Date()).getTime();
export const sigmoid = (x) => Math.exp(x) / (Math.exp(x) + 1); // INPUT [-6, 6] OUTPUT [0, 1]
export const save = async (data)=>{
  const address = await dialog.fileSelect();
  return await fs.writeFile(address, data);
}

export const load = async (filename) => {
  try{
    await fs.access(filename, fs.F_OK);
    let rawConf = await fs.readFile(filename, "utf8");
    return JSON.parse(rawConf);
  }catch(error){

  }
}


export function getPropertyDescriptor (obj, key) {
  if (obj === undefined || obj === null) {
    throw new TypeError('Cannot convert undefined or null to object');
  }
  
  if (key in obj) {
    return getRecursivePropertyDescriptor(obj);
  }

  function getRecursivePropertyDescriptor (obj) {
    return Object.prototype.hasOwnProperty.call(obj, key)
      ? Object.getOwnPropertyDescriptor(obj, key)
    : getRecursivePropertyDescriptor(Object.getPrototypeOf(obj));
  }
}

export class MultiHeritage {
  // Inherit method to create base classes.
  static inherit(..._bases)
  {
    class classes {

      // The base classes
        get base() { return _bases; }

      constructor(..._args)
      {
        var index = 0;

        for (let b of this.base) 
        {
          let obj = new b(..._args);
            MultiHeritage.copy(this, obj);
        }
      }
    
    }

    // Copy over properties and methods
    for (let base of _bases) 
    {
        MultiHeritage.copy(classes, base);
        MultiHeritage.copy(classes.prototype, base.prototype);
    }

    return classes;
  }

  // Copies the properties from one class to another
  static copy(_target, _source) 
  {
        for (let key of Reflect.ownKeys(_source)) 
      {
            if (key !== "constructor" && key !== "prototype" && key !== "name") 
        {
                let desc = getPropertyDescriptor(_source, key);
                Object.defineProperty(_target, key, desc);
            }
        }
  }
}


export const RGB2HUE = (r, g, b) =>{
  const color = {
    red : constrain(0, 255, r)  / 255, 
    green : constrain(0, 255, g) / 255, 
    blue : constrain(0, 255, b) / 255
  };
  const vMax = Math.max(...Object.values(color));
  const vMin = Math.min(...Object.values(color));
  const convert = (hue) => {
    if (hue == NaN) 
      return 0;
    return Math.round((hue * 60 + 360) % 360) ;
  }

  if(vMax == color.red){
    return convert((color.green-color.blue)/(vMax-vMin))
  }
  else if(vMax == color.green){
    return convert(2 + (color.blue-color.red)/(vMax-vMin))
  }
  else if(vMax == color.blue){
    return convert(4 + (color.red-color.green)/(vMax-vMin))
  }
}

export const dialog = {
  runCommand : async (cmd)=>{
    return new Promise((resolve, reject)=>{
      const bin = cmd[0];
      const args = cmd.splice(1);
      let stdout = '';
      let stderr = '';
      try {
        const child = spawn(bin, args, {cwd:__dirname});
        child.stdout.on('data', function(data){
          stdout += data.toString();
        });

        child.stderr.on('data', function(data){
          stderr += data.toString();
        });

        child.on('error', function(error){
          return reject(`dialog-node, error = ${error}` );
        });

        child.on('exit', function(code){
          return resolve([code, stdout.trim(), stderr.trim()])
        })
      } catch (err) {
          return reject('spawn failed : ' + err.message);
      }
    });
  },
  fileSelect: async () => {
    const cmd = [];
    let cb = ()=>{};
    switch( os.platform()){
      case "linux" : 
        // str = str.replace(/[<>]/g, '');
        // cmd.push('zenity');
        // cmd.push('--file-selection');
        // cmd.push('--text') && cmd.push(str);
        // cmd.push('--title') && cmd.push(title);
        // cmd.push('--timeout') && cmd.push(timeout);
        // if (str.length > 30) cmd.push('--width') && cmd.push('300');
        // cb = function(code, stdout, stderr){
        //   //remove line ending
        //   retVal = stdout.slice(0,-1);
        //   if(callback)
        //     callback(code, retVal, stderr);
        // }
      break;
      case "darwin" : 
        cmd.push('osascript');
        cmd.push('-e');
        cmd.push(`
          set strPath to POSIX file ((system attribute "HOME") & "/Documents/cyclone")
          set resultFile to (choose file name with prompt "Save As File" default location strPath) as text
          if resultFile does not end with ".cycl" then
            set resultFile to resultFile & ".cycl"
          else
            set resultFile to resultFile
          end if
        `);
        cb = (code, stdout, stderr) => {
          if(code != 0)throw Error(stderr);
          if(stderr != "")throw Error(stderr);
          return `/${stdout.split(":").splice(1).join("/")}`;
        }
      break;
      case "win32" : 
        // cmd.push('cscript');
        // cmd.push('//Nologo');
        // cmd.push('msgbox.vbs')
        // cmd.push('fileselect');
        // cmd.push(title);
        // cmd.push(str);

        // cb = function(code, stdout, stderr){
        //   retVal = stdout;
        //   if(callback)
        //     callback(code, retVal, stderr);
        // }
      break;
    }
    return cb(...await dialog.runCommand(cmd));
  }
}