/*----------------------------------------*\
  cyclone - Button.js
  @author Evrard Vincent (vincent@ogre.be)
  @Date:   2024-03-22 13:31:52
  @Last Modified time: 2024-03-24 23:56:36
\*----------------------------------------*/

const getTime = ()=>(new Date()).getTime();

const AntiBounce = (debouce) => {
	let _lastActivation = 0;
	let _debouce = debouce;
	return () => {
		const t = getTime();
		if(t - _lastActivation > _debouce){
			_lastActivation = t;
			return true;
		}
		return false;
	}
}

export default class Button{
	constructor(){
		this.debounce = AntiBounce(50);
		this.pressHandler = ()=>{};
		this.releasedHandler = ()=>{};
		this.longClickHandler=()=>{};
		this.doubleClickHandler=()=>{};
		this.timeAtPressed = 0;
		this.timeAtReleased = 0;
	}
	onPressed(handler){
		this.pressHandler = handler;
		return this;
	}
	onReleased(handler){
		this.releasedHandler = handler;
		return this;
	}
	onLongClick(handler){
		this.longClickHandler = handler;
		return this;
	}
	onDoubleClick(handler){
		this.doubleClickHandler = handler;
		return this;
	}
	update(value, deltaTime){
		const t = getTime();
		if(this.debounce()){
			if(value == 127) {
				this.pressHandler();
				this.timeAtPressed = t;
			} else {
				this.releasedHandler();	
				if(t - this.timeAtReleased < 500) {
					this.doubleClickHandler()
				} else if(t - this.timeAtPressed > 500) {
					this.longClickHandler()
				}
				this.timeAtReleased = t;
			}
		}
	}
}
