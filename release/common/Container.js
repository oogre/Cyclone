// /*----------------------------------------*\
//   cyclone - Container.js
//   @author Evrard Vincent (vincent@ogre.be)
//   @Date:   2024-03-22 19:56:33
//   @Last Modified time: 2024-03-22 20:02:36
// \*----------------------------------------*/
// /*
//   Container is an Array that has direct access to setters and getters of his element 
//   it does by itself the loop to set or get each individual value on content
// */

// export default class Container{
// 	constructor(ContentClass, lenght, ...param){
// 		this.values = new Array(lenght).fill(0).map((_, id) => new ContentClass(id, ...param));
// 		giveSetterAndGetterOfContentToContainer(ContentClass, this.values);
// 		this.values.map((e, id, {length}) => {
// 			e.next = () => this.values[(id + 1 + length) % length];
// 			e.prev = () => this.values[(id - 1 + length) % length]
// 		});
// 	}
// 	get(){
// 		return this.values;
// 	}
// }
"use strict";