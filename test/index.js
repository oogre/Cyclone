/*----------------------------------------*\
  midiFighter - index.js
  @author Evrard Vincent (vincent@ogre.be)
  @Date:   2023-02-15 23:06:48
  @Last Modified time: 2023-02-15 23:09:48
\*----------------------------------------*/

const midi = require('midi');

const input = new midi.Input();
const name = "Virtual Midi Fighter Twister";


const getMidiFighterTwisterID =  () => {
		return [
			new Array(input.getPortCount()).fill(0).map((_, id)=>input.getPortName(id)).findIndex(value => name == value),
			// new Array(this.output.getPortCount()).fill(0).map((_, id)=>this.output.getPortName(id)).findIndex(value => name == value)
		];
	}

input.on('message', (deltaTime, [status, number, value]) => {
	const [type, channel] = [status & 0xF0 , status & 0x0F];
	console.log(type, channel, number, value)
});

const [inID, outID] = getMidiFighterTwisterID();


input.openPort(inID);
		