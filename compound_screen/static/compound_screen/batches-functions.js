/*used by batches.js */

//VARIABLES

//arrays of objects
var libraryPlates= [];
var crystallisationPlates =[];
var batches = [];

//strings with instructions to be used in the matching table
const instrFirst = 'Select the first destination plate for this library plate';
const instrReady = 'Done.';
const instrMore = 'Select another destination plate to match remaining compounds to crystals.';

/*indiced of meaningful characters in ids of rows in the matching table
 * id pattern: plate-row-plateIndex-plateRow 
 * e.g. plate-row-2-1 is the second row of the third plate (indexing starts at 0)*/
const plateIndexLocation = 10;
const plateRowFirstDigit = -1;

//CLASSES

/* source or destination plate; object used to keep track of how many items (compounds or crystals)
 * in one type of plate have been so far matched to items in the other type of plate.
 * Kept in two arrays, one for crystallisation plates, and one for library plates */
class Plate {
	constructor(name, numberOfItems){
		//this.index = index;
		this.name = name;
		this.numberOfItems = parseInt(numberOfItems);
		this.unmatchedItems = this.numberOfItems;	
		this.matchedItems = 0;
	}
	
	useItems(numberToUse){
		const returnValue = numberToUse - this.unmatchedItems;
		this.unmatchedItems = this.unmatchedItems - numberToUse;
		this.matchedItems = this.matchedItems + numberToUse;
		if (this.unmatchedItems < 0) {
			this.unmatchedItems = 0;
			this.matchedItems = this.numberOfItems;
		}
			return returnValue;
	}
	
	useAll() {
		this.unmatchedItems = 0;
		this.matchedItems = this.numberOfItems;
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
	constructor(libPlateIndex, matchIndex, matchSectionIndex, row, size){
		this.libPlateIndex = libPlateIndex; 				//(int) index of the library (source) plate in the libraryPlates array
		this.matchIndex = matchIndex;						//(int)
		this.matchSectionIndex = matchSectionIndex;			//(int) when there are multiple batches made from one match
		this.row = row;										//(DOM object) a table row representing the Batch
		this.libPlate = libraryPlates[this.libPlateIndex];	//(Plate object)
		this.crystalPlate = null;							//(Plate object)
		this.batchNumber = null;							//(int)
		this.size = size;									//number of crystals (or number of compounds) in the Batch
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
		if (plate.unmatchedItems > 0) {
			var newOption = document.createElement("option");
			newOption.innerHTML = plate.name + ', crystals available: ' + plate.unmatchedItems;
			newOption.value = crystallisationPlates.indexOf(plate);
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
		console.log('No batch exists for:', libPlateIndex, matchIndex, matchSectionIndex);
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
		console.log('No batch exists for row:', row);
	}
	return returnValue;
}

//create a new row in the matching table for the same library plate 
function createNewRow(currentRow, compoundsLeft) {
	const currentBatch = findBatchByRow(currentRow);
	
	//create new row and fill it with data
	newRow = currentRow.cloneNode(true);
	newRow.querySelector('.instructions').innerHTML = instrMore;
	if (newRow.querySelector('.missing-matches') !== null){
		newRow.querySelector('.missing-matches').innerHTML = compoundsLeft;
	}
	else {
		newRow.querySelector('.items').innerHTML = compoundsLeft;
	}
	if ( newRow.querySelector('button') !== null) {
		newRow.querySelector('.tip').innerHTML = ' ';
		activateOkButton(newRow.querySelector('button'));
		activateSelect(newRow.querySelector('select'));
	}
	
	//find appropriate place for the new row and add it to the table
	nextBatch = findBatchByKey(currentBatch.libPlateIndex, currentBatch.matchIndex + 1, 0);
	if (nextBatch === null) {
		nextBatch = findBatchByKey(currentBatch.libPlateIndex + 1, 0, 0);
	} 
	
	if (nextBatch !== null) {
		document.getElementById('batches-tbody').insertBefore(newRow, nextBatch.row); 
	}
	else {
		document.getElementById('batches-tbody').appendChild(newRow);
	}
	
	return newRow;
}

function createNewBatch(libPlateIndex, matchIndex, matchSectionIndex, row, size) {
	const newBatch = new Batch(libPlateIndex, matchIndex, matchSectionIndex, row, size);
	batches.push(newBatch);
	return newBatch;
}

function activateOkButton(button) {
	button.addEventListener('click', () => {
		const parentRow = button.parentElement.parentElement;
		const currentBatch = findBatchByRow(parentRow);
		const selectedValue = button.parentElement.querySelector('.cr-plate-selection').value;
		const items = parentRow.querySelector('.items');
		
		//assign selected crystallisation plate to the current Batch object
		if (selectedValue !== 'null') {
			currentBatch.crystalPlate = crystallisationPlates[parseInt(selectedValue)];
		}
		else {
			currentBatch.crystalPlate = null;
		}
		const unmatchedCrystals = currentBatch.crystalPlate.unmatchedItems;
		const unmatchedCompounds = currentBatch.libPlate.unmatchedItems;
		const compoundsLeft = unmatchedCompounds - unmatchedCrystals;
		
		//update object states and table rows
		if (currentBatch.crystalPlate !== null) {
			if (unmatchedCrystals < unmatchedCompounds) {
				const newRow = createNewRow(parentRow, compoundsLeft);
				createNewBatch(currentBatch.libPlateIndex, currentBatch.matchIndex + 1, 0, newRow, compoundsLeft);
				items.innerHTML = unmatchedCrystals;
				currentBatch.crystalPlate.useAll();
				currentBatch.size = unmatchedCrystals;
				currentBatch.libPlate.useItems(unmatchedCrystals);
				}
			else {
				items.innerHTML = unmatchedCompounds;
				currentBatch.crystalPlate.useItems(unmatchedCompounds);
			}
		}
		
		parentRow.querySelector('.cr-plate-selection').hidden = true;
		button.hidden = true;
		button.parentElement.innerHTML = currentBatch.crystalPlate.name;
		parentRow.querySelector('.instructions').innerHTML = instrReady;
		
		
		updateCrystalPlateSelections();
	})	
}

function activateSelect(select) {
	select.addEventListener('change', () => {
		if (select.value !== 'null') { 
			
			const currentBatch = findBatchByRow(select.closest('.batch-row'));
			
			const crystalPlate = crystallisationPlates[select.value];
			const libPlate = currentBatch.libPlate;
			select.parentElement.querySelector('.tip').innerHTML = explainMatch(libPlate, crystalPlate);
		}
		else {
			select.parentElement.querySelector('.tip').innerHTML = ' ';
		}
	})
}

function explainMatch(libPlate, crystalPlate) {
	
	const infoStrings = ['This match will use up all ', ', but there will be ', ' left in ', '. To accept, click OK.'];
	let output = '';
	
	if (libPlate.unmatchedItems > crystalPlate.unmatchedItems) {
		const compoundsLeft = libPlate.unmatchedItems - crystalPlate.unmatchedItems;
		output = infoStrings[0] + crystalPlate.name + infoStrings[1] + compoundsLeft + ' compounds' + infoStrings[2] + libPlate.name + infoStrings[3];
		}
	else if (libPlate.unmatchedItems < crystalPlate.unmatchedItems) {
		const crystalsLeft = crystalPlate.unmatchedItems - libPlate.unmatchedItems;
		output = infoStrings[0] + libPlate.name + infoStrings[1] + crystalsLeft + ' crystals ' + infoStrings[2] + crystalPlate.name + infoStrings[3];
		}
	else{
		output = 'This match will use up both' + libPlate.name + ' and ' + crystalPlate.name + infoStrings[3];
	}
	return output;
}

function changeColour(colour) {
	if (colour === 'white'){
		return 'aliceblue';
	}
	else {
		return 'white';
	}
}

function changeTableView() {
	//show and hide coloumns
	const show = ['.batch', '.wells', '.drop', '.batch-checkbox', '.pb-name'];
	const hide = ['.instructions'];
	show.forEach(className => {
		showHiddenClass(className);	
	})
	
	hide.forEach(className => {
		hideClass(className);
	})	
	
	//widen the table
	document.getElementById('batch-table').style.width = '100%';
	document.getElementById('wide-cell').colSpan = '6';
	
	//colour rows to show where a new match starts
	let oldLibPlateIndex = 0;
	let oldMatchIndex = 0;
	let colour = 'white';
	
	document.querySelectorAll('.batch-row').forEach(row => {
		const newMatchIndex = findBatchByRow(row).matchIndex;
		const newLibPlateIndex = findBatchByRow(row).libPlateIndex;
		if ( newMatchIndex !== oldMatchIndex || oldLibPlateIndex !== newLibPlateIndex ){
				colour = changeColour(colour);
		}		
		row.style.background = colour;
		oldMatchIndex = newMatchIndex;
		oldLibPlateIndex = newLibPlateIndex;
	});
}

function generateBatchNumbers() {
	let i = 1;
	document.querySelectorAll('.batch-row').forEach(row => {
		const batch = findBatchByRow(row);
		batch.batchNumber = i;
		batch.size = parseInt(row.querySelector('.items').innerHTML);
		row.querySelector('.batch').innerHTML = i;
		i++;
	})
	changeTableView();
}

function createBatchesByNumberOfCrystals(size) {
	batches.forEach(batch => {
		divideBatch(batch, size);
	});
	generateBatchNumbers();
	changeTableView();
}

function divideBatch(batch, newSize) {
	while (batch.size > newSize){
		const itemsLeft = batch.size - newSize;
		const newRow = createNewRow(batch.row, itemsLeft);
		const newBatch = createNewBatch(batch.libPlateIndex, batch.matchIndex, batch.matchSectionIndex + 1, newRow, itemsLeft);
		batch.size = newSize;
		batch.row.querySelector('.items').innerHTML = newSize;
		divideBatch(newBatch, newSize);
	}
}
