
import conf from "../common/config.js";
import { Server, Client } from 'node-osc';


const {
  OSC_IN_PORT, 
  OSC_OUT_PORT
} = conf;


class Osc {
  constructor(inPort, outPort){
    this.debug = false;
    this.server = new Server(inPort, '0.0.0.0', () => {
      console.log('OSC Server is listening');
    });
    this.server.on('message', (msg) => {
      this.debug && console.log(`Message: ${msg}`);
    });
    this.client = new Client('127.0.0.1', outPort);
  }
  send(address, ...values){
    this.client.send(address, ...values);
  }

  on(address, callback){
    this.server.on(address, callback);
  }

  quiet(flag = false){
    this.debug = !!flag;
  }

  verbose(flag = true){
    this.debug = !!flag;
  }

}

const osc = new Osc(OSC_IN_PORT, OSC_OUT_PORT);

export default osc;