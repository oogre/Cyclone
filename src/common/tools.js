/*----------------------------------------*\
  midiFighter - tools.js
  @author Evrard Vincent (vincent@ogre.be)
  @Date:   2023-02-15 19:31:42
  @Last Modified time: 2023-02-22 19:04:14
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