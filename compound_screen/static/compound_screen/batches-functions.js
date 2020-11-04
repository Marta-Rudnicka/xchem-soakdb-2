/*used by batches.js */

//VARIABLES

//arrays of objects
var libraryPlates= [];
var crystallisationPlates =[];
var batchTableRows = [];

//strings with instructions to be used in the matching table
const instrFirst = 'Select the first destination plate for this library plate';
const instrReady = 'Ready to create batches';
const instrMore = ['Select another destination plate. You need ', ' more crystals'];

/*indiced of meaningful characters in ids of rows in the matching table
 * id pattern: plate-row-plateIndex-plateRow 
 * e.g. plate-row-2-1 is the second row of the third plate (indexing starts at 0)*/
const plateIndexLocation = 10;
const plateRowFirstDigit = -1;

//CLASSES

/* source or destination plate; object used to keep track of how many items (compounds or crystals)
 * in one type of plate have been so far matched to items in the other type of plate
 * kept in arrays, one for crystallisation plates, and one for library plates */
class Plate {
	constructor(index, name, numberOfItems){
		this.index = index;
		this.name = name;
		this.numberOfItems = parseInt(numberOfItems);
		this.availableItems = this.numberOfItems;
		this.assignedItems = 0;
	}
	
	useItems(numberToUse){
		const returnValue = numberToUse - this.availableItems;
		this.availableItems = this.availableItems - numberToUse;
		this.assignedItems = this.assignedItems + numberToUse;
		if (this.availableItems < 0) {
			this.availableItems = 0;
			this.assignedItems = this.numberOfItems;
		}
			return returnValue;
	}
	
	useAll() {
		this.availableItems = 0;
		this.assignedItems = this.numberOfItems;
	}
}

/* one row in the matching table; used to manipulate data in the rows*/
class BatchesTableRow {
	constructor(id, sourcePlateIndex){
		this.id = id;
		this.sourcePlateIndex = sourcePlateIndex;
		this.sourcePlate = libraryPlates[this.sourcePlateIndex];
		this.batch = null;
		this.crystals = null;
		this.crystalPlate = null;
	}
}


//FUNCTIONS
function totalCompounds() {
	let total = 0;
	libraryPlates.forEach(plate => {
		total = total + plate.numberOfItems;
		})
	return total;
}

function totalCrystals() {
	let total = 0;
	crystallisationPlates.forEach(plate => {
		total = total + plate.numberOfItems;
		})
	return total;
}

//create <option> elements based on current state of Plate objects in the crystallisationPlates array
function createCrystalPlateOptions(selectElement) {
	crystallisationPlates.forEach(plate => {
		if (plate.availableItems > 0) {
			var newOption = document.createElement("option");
			newOption.innerHTML = plate.name + ', crystals available: ' + plate.availableItems;
			newOption.value = plate.index;
			selectElement.appendChild(newOption); 
		}
	})
}

//update <option>s representing each available crystallisation plate in the matching table
function updateCrystalPlateSelections() {
	let selectElements = document.querySelectorAll('.cr-plate-selection');
	
	//remove old options
	selectElements.forEach(element => {
		element.querySelectorAll('option').forEach(option => {
			if (option.value !== 'null'){
				option.remove();
				}
			})
		})
		
	//create updated  
	selectElements.forEach(element => createCrystalPlateOptions(element));	
}

//create a new row in the matching table for the same library plate 				TODO
function addRowForLibPlate(row, plateIndex, compoundsLeft) {
	
	//generate data used in the new row
	let oldId = row.id;
	let newId = oldId.slice(0, -1) + (parseInt(oldId.slice(plateRowFirstDigit)) + 1);
	
	//create new row
	newRow = row.cloneNode(true);
	newRow.id = newId;
	newRow.querySelector('.instructions').innerHTML = instrMore[0] + compoundsLeft + instrMore[1];
	activateButton(newRow.querySelector('button'));
	
	//find first row of the next plate (to insert a new row before it)
	let nextPlateIndex = parseInt(oldId.charAt(plateIndexLocation)) + 1;
	let nextRowId = 'plate_row_' + nextPlateIndex + '_0';
	nextRow = document.getElementById(nextRowId);
	
	//create a new BatchesTableRow object to control the new row
	let args = "('" + newId + "', " + plateIndex + ");";
	eval(newId + " = new BatchesTableRow" + args );
	eval("batchTableRows.push(" + newId +");");
	
	document.getElementById('batches-tbody').insertBefore(newRow, nextRow); 
}

function activateButton(button) {
	button.addEventListener('click', () => {
		//get plate objects related to button's parent row
		const parentRow = button.parentElement.parentElement;
		const thisRowObj = eval(parentRow.id);
		const selectedValue = button.parentElement.querySelector('.cr-plate-selection').value;
			
		if (selectedValue !== 'null') {
			thisRowObj.crystalPlate = crystallisationPlates[parseInt(selectedValue)];
		}
		else {
			thisRowObj.crystalPlate = null;
		}
		
		//update plate objects and add new row if needed
		if (thisRowObj.crystallisationPlate !== null) {
			crystalsLeftInPlate = thisRowObj.sourcePlate.useItems(thisRowObj.crystalPlate.availableItems);
			if (crystalsLeftInPlate < 0 ) {
				thisRowObj.crystalPlate.useAll();
				addRowForLibPlate(parentRow, thisRowObj.sourcePlate.index, thisRowObj.sourcePlate.availableItems,);
			}
			else {
				thisRowObj.crystalPlate.useItems(thisRowObj.crystalPlate.availableItems - crystalsLeftInPlate);
				
			}
		}
		
		parentRow.querySelector('.cr-plate-selection').hidden = true;
		button.hidden = true;
		button.parentElement.innerHTML = thisRowObj.crystalPlate.name;
		parentRow.querySelector('.instructions').innerHTML = "Ready to create batches for this match";
		
		
		updateCrystalPlateSelections();
	})	
}
