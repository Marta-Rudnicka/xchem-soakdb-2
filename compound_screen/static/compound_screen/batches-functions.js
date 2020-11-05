/*used by batches.js */

//VARIABLES

//arrays of objects
var libraryPlates= [];
var crystallisationPlates =[];
var batches = [];

//strings with instructions to be used in the matching table
const instrFirst = 'Select the first destination plate for this library plate';
const instrReady = 'Done.';
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

/* A batch is a collection of protein crystals exposed to library compounds processed together
 * in the experiment. One batch can contain only compounds from one library plate, and crystals from one 
 * crystallisaton plate (based on the lab practice).
 * In this class, an assignment of one library plate to one crystallisation plate is called a match. Each type of plate can
 * be present in multiple matches, but there can be only one match in a batch. 
 * Matches are numbered in relation to library plates, and the lib. plate index together
 * with the match index can uniquely identify a match. E.g. if the first 100 compounds in lib. plate 3 are applied
 * to crystals from plate A, and the next 120 are applied to crystals from plate B, the first 100 compounds will
 * belong to libPlate 3, matchIndex 0, and the next 120 will be libPlate 3, matchIndex 1.
 * 
 *   One batch can contain the whole of a match, or a match can be divided into smaller batches - depending on
 * user needs.*/
class Batch {
	constructor(libPlateIndex, matchIndex, matchSectionIndex, row){
		this.libPlateIndex = libPlateIndex; 				//(int) index of the library (source) plate in the libraryPlates array
		this.matchIndex = matchIndex;						//(int)
		this.matchSectionIndex = matchSectionIndex;			//(int) when there are multiple batches made from one match
		this.row = row;										//(DOM object) a table row representing the Batch
		this.libPlate = libraryPlates[this.libPlateIndex];	//(Plate object)
		this.crystalPlate = null;							//(Plate object)
		this.batchNumber = null;							//(int)
		this.size = null;									//number of crystals (or number of compounds) in the Batch
		//this.wells = [];									//(array)
		//this.drops = [];									//(array)
		
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

//finds a batch based on arguments forming its primary key
function findBatchByKey(libPlateIndex, matchIndex, matchSectionIndex){
	returnValue = null;
	batches.forEach( batch => {
	if ( batch.libPlateIndex === libPlateIndex && batch.matchIndex === matchIndex && batch.matchSectionIndex === matchSectionIndex ) {
		returnValue = batch;
		}
	})
	
	if (returnValue === null ){
		console.log('ERROR: No batch exists for:', libPlateIndex, matchIndex, matchSectionIndex);
	}
	return returnValue;
}

function findBatchByRow(row){
	returnValue = null;
	batches.forEach( batch => {
	if ( batch.row === row ) {
		returnValue = batch;
		}
	})
	
	if (returnValue === null ){
		console.log('ERROR: No batch exists for row:', row);
	}
	return returnValue;
}

//create a new row in the matching table for the same library plate 
function makeRowForNewMatch(currentRow, compoundsLeft) {
	const currentBatch = findBatchByRow(currentRow);
	
	//create new row in the table
	newRow = currentRow.cloneNode(true);
	newRow.querySelector('.instructions').innerHTML = instrMore[0] + compoundsLeft + instrMore[1];
	activateButton(newRow.querySelector('button'));
	
	//find appropriate place for the new row and add it to the table
	nextBatch = findBatchByKey(currentBatch.libPlateIndex + 1, 0, 0);
	if (nextBatch !== null) {
		document.getElementById('batches-tbody').insertBefore(newRow, nextBatch.row); 
	}
	else {
		document.getElementById('batches-tbody').appendChild(newRow);
	}
	
	//create a Batch object for the new row
	newBatch = new Batch(currentBatch.libPlateIndex, currentBatch.matchIndex + 1, 0, newRow);
	batches.push(newBatch);	
}

function activateButton(button) {
	button.addEventListener('click', () => {
		//get plate objects related to button's parent row
		const parentRow = button.parentElement.parentElement;
		const currentBatch = findBatchByRow(parentRow);
		console.log(currentBatch.libPlate);
		const selectedValue = button.parentElement.querySelector('.cr-plate-selection').value;
			
		if (selectedValue !== 'null') {
			currentBatch.crystalPlate = crystallisationPlates[parseInt(selectedValue)];
		}
		else {
			currentBatch.crystalPlate = null;
		}
		
		//update plate objects and add new row if needed
		if (currentBatch.crystallisationPlate !== null) {
			crystalsLeftInPlate = currentBatch.libPlate.useItems(currentBatch.crystalPlate.availableItems);
			if (crystalsLeftInPlate < 0 ) {
				currentBatch.crystalPlate.useAll();
				makeRowForNewMatch(parentRow, currentBatch.libPlate.availableItems,);
			}
			else {
				currentBatch.crystalPlate.useItems(currentBatch.crystalPlate.availableItems - crystalsLeftInPlate);
			}
		}
		
		parentRow.querySelector('.cr-plate-selection').hidden = true;
		button.hidden = true;
		button.parentElement.innerHTML = currentBatch.crystalPlate.name;
		parentRow.querySelector('.instructions').innerHTML = instrReady;
		
		updateCrystalPlateSelections();
	})	
}
