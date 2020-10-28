/* an element that can be shown or hidden, together with controls used to show or hide it */
class Hideable {
	constructor(container, target, targetDisplayType, hiderElementSelector, showerElementSelector, controlsDisplayType ){
		this.container = container;										//nearest common parent element of the target and the controls (selector)									
		this.target = target;											//element to be shown or hidden (selector)
		this.targetDisplayType = targetDisplayType;						//CSS display attribute of target when shown (string)
		this.hiderElementSelector = hiderElementSelector; 				//control used to hide target (selector)
		this.showerElementSelector = showerElementSelector;				//control used to show target (selector)
		this.controlsDisplayType = controlsDisplayType;					//CSS display attribute of controls when shown (string)
	}
	
	//use the provided selector to access the target element
	findTarget() {
		this.targetElement = this.container.querySelector(this.target);
	}
	
	//use provided selectors to access the controls
	findControls() {
		this.hiderElement = this.container.querySelector(this.hiderElementSelector);
		this.showerElement = this.container.querySelector(this.showerElementSelector);
	}
	
	showTarget() {
		this.targetElement.style.display = this.targetDisplayType;
	}
	
	hideTarget() {
		this.targetElement.style.display = 'none';
	}
	
	//show or hide target by clicking on controls; swap display attr of controls
	addListeners() {
		this.findTarget();
		this.findControls();
		
		this.showerElement.addEventListener('click', () => {
			this.showTarget();
			this.hiderElement.style.display = this.controlsDisplayType
			this.showerElement.style.display = 'none';
			
		})
		
		this.hiderElement.addEventListener('click', () => {
			this.hideTarget();
			this.hiderElement.style.display = 'none'; 
			this.showerElement.style.display = this.controlsDisplayType;
		})		
	}
}

//ShowAndHideGroup, but the target is an array of elements
class HideableArray extends Hideable {
	
	//for elements that have their individual show/hide controls
	set individualControls(array){
		this.icShowerSelector = array[0];
		this.icHiderSelector = array[1];
		this.icDisplayType = array[2];
	}
	
	findTarget() {};
	
	showTarget() {		
		this.target.forEach(element => {
			element.style.display = this.targetDisplayType;
			//swap individual controls if present
			if (this.icShowerSelector !== undefined){
				element.parentElement.querySelector(this.icShowerSelector).style.display = 'none';
				element.parentElement.querySelector(this.icHiderSelector).style.display = this.icDisplayType;
			}
		})
	}
	
	hideTarget() {
		this.target.forEach(element => {
			element.style.display = 'none';
			//swap individual controls if present
			if (this.icShowerSelector !== undefined){
				element.parentElement.querySelector(this.icShowerSelector).style.display = this.icDisplayType; 
				element.parentElement.querySelector(this.icHiderSelector).style.display = 'none';
			}
		})
	}
}
