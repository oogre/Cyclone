/*----------------------------------------*\
  midiFighter - tools.js
  @author Evrard Vincent (vincent@ogre.be)
  @Date:   2023-02-15 19:31:42
  @Last Modified time: 2023-02-15 20:07:02
\*----------------------------------------*/



export const isFloat = (n) => n === +n && n !== (n|0);
export const isInteger = (n) => n === +n && n === (n|0);
export const isNumber = (n) => isFloat(n) || isInteger(n);
export const constrain = (min, max, value) => Math.min( Math.max(max, min), Math.max(Math.min(max, min), value));
export const lerp = (a, b, amount) => a + (b - a) * constrain(0, 1, amount);
export const wait = async (time) => isNumber(time) ? new Promise(s => setTimeout(()=>s(), time)) : null ;