/*use [#hideButton] to hide all elements in elementList and show [#showButton] */
function hideElementList(hideButton, elementList, showButton){
		document.getElementById(hideButton).onclick = () => {
		elementList.forEach(cell => {
			cell.style.display = 'none';
		})
		document.getElementById(showButton).style.display = 'inline-block';
		return false;
	}
}

/*use [#showButton] to show all elements in elementList*/
function showElementList(showButton, elementList) {
	document.getElementById(showButton).onclick = () => {
		elementList.forEach(cell => {
			cell.style.display = 'table-cell';
		})		
		document.getElementById(showButton).style.display = 'none';
		return false;
	}
}

/*when [#button] is clicked, check all checkboxes in listOfCheckboxes */
function checkAllByButton(button, listOfCheckboxes) {
	document.getElementById(button).onclick = () => {
		listOfCheckboxes.forEach( checkbox => {
			if (checkbox.checked === false)
				checkbox.click();
		})
	}
}


/*when [#button] is clicked, uncheck all checkboxes in listOfCheckboxes */
function uncheckAllByButton(button, listOfCheckboxes) {
	document.getElementById(button).onclick = () => {
		listOfCheckboxes.forEach( checkbox => {
			if (checkbox.checked == true) {
				checkbox.click();
			}
		})
	}
}

/*extract inner text from the select element into a string */
function getSelectString(elementID) {
	const option = document.getElementById(elementID).value;
	var targetString = document.querySelector(`[value=${option}]`).text;
	if (option === 'null') {
		targetString = null;
	}	
	return targetString;
}

/*extract input value into a string */
function getInputString(elementID) {
	var targetString = String(document.getElementById(elementID).value);
	if (targetString == '') {
	targetString = null;
	}
	return targetString;	
}

/*hides an array of elements by their selectors*/
function hide(array) {
	for (i = 0; i < array.length; i++) {
		document.querySelector(array[i]).style.display = "none";
	} 
}


/*shows an array of elements setting their display attributes to displayType
function show(array, displayType) { 
	for (i = 0; i < array.length; i++) {
		document.querySelector(array[i]).style.display = displayType;
	} 
}
*/
/*sets the values of all elements in ${array} to ${cvalue}*/
function setAllElementValuesTo(array, cvalue) {
	console.log('cvalue = ', cvalue);
	for (i = 0; i < array.length; i++) {
		document.querySelector(array[i]).value = cvalue;
	} 
}
