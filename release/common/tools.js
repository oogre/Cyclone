"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.dialog = exports.constrain = exports.RGB2HUE = exports.MultiHeritage = exports.Container = void 0;
exports.getPropertyDescriptor = getPropertyDescriptor;
exports.wait = exports.save = exports.load = exports.lerp = exports.isNumber = exports.isInteger = exports.isFloat = void 0;
var _os = _interopRequireDefault(require("os"));
var _child_process = require("child_process");
var _fsExtra = _interopRequireDefault(require("fs-extra"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
/*----------------------------------------*\
  midiFighter - tools.js
  @author Evrard Vincent (vincent@ogre.be)
  @Date:   2023-02-15 19:31:42
  @Last Modified time: 2024-03-23 20:59:42
\*----------------------------------------*/

const isFloat = n => n === +n && n !== (n | 0);
exports.isFloat = isFloat;
const isInteger = n => n === +n && n === (n | 0);
exports.isInteger = isInteger;
const isNumber = n => isFloat(n) || isInteger(n);
exports.isNumber = isNumber;
const constrain = (min, max, value) => Math.min(Math.max(max, min), Math.max(Math.min(max, min), value));
exports.constrain = constrain;
const lerp = (a, b, amount) => a + (b - a) * constrain(0, 1, amount);
exports.lerp = lerp;
const wait = async time => isNumber(time) ? new Promise(s => setTimeout(() => s(), time)) : null;
exports.wait = wait;
const save = async data => {
  const address = await dialog.fileSelect();
  return await _fsExtra.default.writeFile(address, data);
};
exports.save = save;
const load = async filename => {
  try {
    await _fsExtra.default.access(filename, _fsExtra.default.F_OK);
    let rawConf = await _fsExtra.default.readFile(filename, "utf8");
    return JSON.parse(rawConf);
  } catch (error) {}
};
exports.load = load;
function getPropertyDescriptor(obj, key) {
  if (obj === undefined || obj === null) {
    throw new TypeError('Cannot convert undefined or null to object');
  }
  if (key in obj) {
    return getRecursivePropertyDescriptor(obj);
  }
  function getRecursivePropertyDescriptor(obj) {
    return Object.prototype.hasOwnProperty.call(obj, key) ? Object.getOwnPropertyDescriptor(obj, key) : getRecursivePropertyDescriptor(Object.getPrototypeOf(obj));
  }
}
class MultiHeritage {
  // Inherit method to create base classes.
  static inherit(..._bases) {
    class classes {
      // The base classes
      get base() {
        return _bases;
      }
      constructor(..._args) {
        var index = 0;
        for (let b of this.base) {
          let obj = new b(..._args);
          MultiHeritage.copy(this, obj);
        }
      }
    }

    // Copy over properties and methods
    for (let base of _bases) {
      MultiHeritage.copy(classes, base);
      MultiHeritage.copy(classes.prototype, base.prototype);
    }
    return classes;
  }

  // Copies the properties from one class to another
  static copy(_target, _source) {
    for (let key of Reflect.ownKeys(_source)) {
      if (key !== "constructor" && key !== "prototype" && key !== "name") {
        let desc = getPropertyDescriptor(_source, key);
        Object.defineProperty(_target, key, desc);
      }
    }
  }
}

/*
  Container is an Array that has direct access to setters and getters of his element 
  it does by itself the loop to set or get each individual value on content
*/
exports.MultiHeritage = MultiHeritage;
const Container = (ContentClass, lenght, ...param) => {
  const getPropertyNames = obj => {
    var propertyNames = [];
    do {
      propertyNames.push.apply(propertyNames, Object.getOwnPropertyNames(obj));
      obj = Object.getPrototypeOf(obj);
    } while (obj);
    // get unique property names
    obj = {};
    for (var i = 0, len = propertyNames.length; i < len; i++) {
      obj[propertyNames[i]] = 1;
    }
    return Object.keys(obj);
  };
  const getAllSetterAndGetterOf = Class => {
    return getPropertyNames(Class.prototype).filter(name => !["constructor", "__defineGetter__", "hasOwnProperty", "__lookupSetter__", "propertyIsEnumerable", "valueOf", "__defineSetter__", "__lookupGetter__", "isPrototypeOf", "toString", "toLocaleString"].includes(name));
  };
  const giveSetterAndGetterOfContentToContainer = (Class, container) => {
    getAllSetterAndGetterOf(Class).map(name => {
      Object.defineProperty(container, name, {
        set: value => {
          container.map(content => content[name] = value);
        },
        get: () => {
          return container.map(content => content[name]);
        }
      });
    });
  };
  const container = new Array(lenght).fill(0).map((_, id) => new ContentClass(id, ...param));
  giveSetterAndGetterOfContentToContainer(ContentClass, container);
  container.map((e, id, {
    length
  }) => {
    e.next = () => {
      return container[(id + 1 + length) % length];
    };
    e.prev = () => {
      return container[(id - 1 + length) % length];
    };
  });
  return container;
};
exports.Container = Container;
const RGB2HUE = (r, g, b) => {
  const color = {
    red: constrain(0, 255, r) / 255,
    green: constrain(0, 255, g) / 255,
    blue: constrain(0, 255, b) / 255
  };
  const vMax = Math.max(...Object.values(color));
  const vMin = Math.min(...Object.values(color));
  const convert = hue => {
    if (hue == NaN) return 0;
    return Math.round((hue * 60 + 360) % 360);
  };
  if (vMax == color.red) {
    return convert((color.green - color.blue) / (vMax - vMin));
  } else if (vMax == color.green) {
    return convert(2 + (color.blue - color.red) / (vMax - vMin));
  } else if (vMax == color.blue) {
    return convert(4 + (color.red - color.green) / (vMax - vMin));
  }
};
exports.RGB2HUE = RGB2HUE;
const dialog = {
  runCommand: async cmd => {
    return new Promise((resolve, reject) => {
      const bin = cmd[0];
      const args = cmd.splice(1);
      let stdout = '';
      let stderr = '';
      try {
        const child = (0, _child_process.spawn)(bin, args, {
          cwd: __dirname
        });
        child.stdout.on('data', function (data) {
          stdout += data.toString();
        });
        child.stderr.on('data', function (data) {
          stderr += data.toString();
        });
        child.on('error', function (error) {
          return reject(`dialog-node, error = ${error}`);
        });
        child.on('exit', function (code) {
          return resolve([code, stdout.trim(), stderr.trim()]);
        });
      } catch (err) {
        return reject('spawn failed : ' + err.message);
      }
    });
  },
  fileSelect: async () => {
    const cmd = [];
    let cb = () => {};
    switch (_os.default.platform()) {
      case "linux":
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
      case "darwin":
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
          if (code != 0) throw Error(stderr);
          if (stderr != "") throw Error(stderr);
          return `/${stdout.split(":").splice(1).join("/")}`;
        };
        break;
      case "win32":
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
    return cb(...(await dialog.runCommand(cmd)));
  }
};
exports.dialog = dialog;