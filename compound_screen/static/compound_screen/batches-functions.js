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

//CLASSES

/* source or destination plate; object used to keep track of how many items (compounds or crystals)
 * in one type of plate have been so far matched to items in the other type of plate.
 * Kept in two arrays, one for crystallisation plates, and one for library plates */
class Plate {
	constructor(name, numberOfItems){
		this.name = name;
		this.numberOfItems = parseInt(numberOfItems);
		this.unmatchedItems = this.numberOfItems;	
		this.matchedItems = 0;
	}
	useAll() {
		this.unmatchedItems = 0;
		this.matchedItems = this.numberOfItems;
	}
	useItems(number){
		this.unmatchedItems = this.unmatchedItems - number;
		this.matchedItems = this.matchedItems + number;
		if (this.unmatchedItems < 0) {
			this.useAll();
		}
	}
	unmatchItems(number){
		if (this.matchedItems < number){
			throw new RangeError('Plate.unmatchItems: There are not enough matched items in the Plate to unmatch ', number);
		}
		else {
			this.unmatchedItems = this.unmatchedItems + number;
			this.matchedItems = this.matchedItems - number;
		}
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
 * user needs.
 * 
 * A batch can be uniquely identified by the combonation of libPlateIndex, matchIndex and matchSectionIndex before it is
 * assigned a batchNumber. The three values should never be modified in an object, while tha batch number can.
 * */
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
	
	assignCrystalPlate(plate) {
		this.crystalPlate = plate;
		if (this.crystalPlate === 'null') {
			this.crystalPlate = null;
		}
	}
}


//FUNCTIONS

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

function activateOkButton(button) {
	button.addEventListener('click', () => {
		const parentRow = button.parentElement.parentElement;
		
		//update object states and table rows
		createMatch(parentRow);
		
		//parentRow.querySelector('.cr-plate-selection').hidden = true;
		//button.hidden = true;
		
		parentRow.querySelector('.instructions').innerHTML = instrReady;
		
		updateCrystalPlateSelections();
		
		if (document.querySelector('.ok-button') === null ) {
			changeToView(2);
		}
	})	
}

function createMatch(row){
	const currentBatch = findBatchByRow(row);
	const selectedValue = row.querySelector('.cr-plate-selection').value;
	currentBatch.assignCrystalPlate(crystallisationPlates[parseInt(selectedValue)]);	
	const items = row.querySelector('.items');
	const unmatchedCrystals = currentBatch.crystalPlate.unmatchedItems;
	const unmatchedCompounds = currentBatch.libPlate.unmatchedItems;
	const compoundsLeft = unmatchedCompounds - unmatchedCrystals;
	
	if (currentBatch.crystalPlate !== null) {
		if (unmatchedCrystals < unmatchedCompounds) {
			const newRow = createNewRow(row, compoundsLeft);
			createNewBatch(currentBatch.libPlateIndex, currentBatch.matchIndex + 1, 0, newRow, compoundsLeft);
			console.log(batches);
			items.innerHTML = unmatchedCrystals;
			currentBatch.crystalPlate.useAll();
			currentBatch.size = unmatchedCrystals;
			currentBatch.libPlate.useItems(unmatchedCrystals);
			}
		else {
			items.innerHTML = unmatchedCompounds;
			currentBatch.crystalPlate.useItems(unmatchedCompounds);
			currentBatch.libPlate.useAll();
		}
	}
	row.querySelector('.cr-plate').innerHTML = currentBatch.crystalPlate.name;	
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
			select.parentElement.querySelector('.tip').innerHTML = '<br><br><br> ';
		}
	})
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
}

function mergeSelected() {
	selected = getSelected();
	
	if (validateMerge(selected) === true) {
		firstBatch = selected[0];
		selected.forEach(batch => {
			if (batch !== firstBatch) {
				merge2Batches(firstBatch, batch);
			}
		});
		generateBatchNumbers();
	}
}

function deleteSelected() {
	selected = getSelected();
	selected.forEach(batch => {
		batch.libPlate.unmatchItems(batch.size);
		batch.crystalPlate.unmatchItems(batch.size);
		batch.row.remove();
		deleteBatch(batch);
	});
	generateBatchNumbers();
	document.getElementById('total-items').innerHTML = totalMatched(libraryPlates);	
	showUnused();
}

//HELPER FUNCTIONS

function totalCompounds() {
	let total = 0;
	libraryPlates.forEach(plate => {
		total = total + plate.unmatchedItems;
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

//finds a batch based on arguments forming its primary key; returns Batch object or null
function findBatchByKey(libPlateIndex, matchIndex, matchSectionIndex){
	returnValue = null;
	batches.forEach( batch => {
	if ( batch.libPlateIndex === libPlateIndex && batch.matchIndex === matchIndex && batch.matchSectionIndex === matchSectionIndex ) {
		returnValue = batch;
		}
	})
	return returnValue;
}

//finds batch by the <tr> DOM object representing it; returns Batch object or null 
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
		newRow.querySelector('.tip').innerHTML = '<br><br><br>';
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

function changeToView(number) {
	newView = '.view' + number;
	oldView = '.view' + (number - 1);
	
	document.querySelectorAll(newView).forEach(element => {
		element.hidden = false;
	});
	document.querySelectorAll(oldView).forEach(element => {
		element.hidden = true;
	});
}

//generate a string explaining consequences of a match
function explainMatch(libPlate, crystalPlate) {
	let x, y = '';
	let output = 'This match will leave: <br>';
	x = libPlate.unmatchedItems - crystalPlate.unmatchedItems;
	if (x < 0){
		x = 0;
	}
	y = crystalPlate.unmatchedItems - libPlate.unmatchedItems;
	if (y < 0){
		y = 0;
	}
	const infoStrings = [x, ' compounds in ', libPlate.name, '<br>', y, ' crystals in ', crystalPlate.name];
	
	
	infoStrings.forEach(string => {
		output = output + string;
	});
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

//transition from the layout for matching plates to the batches view
function changeTableView() {
	//show and hide coloumns
	const show = ['.batch', '.wells', '.drop', '.batch-checkbox', '.pb-name', '.unused-crystals', '.unused-compounds'];
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
	
	colourCodeTable();
	showUnused();
	
}

function divideBatch(batch, newSize) {
	while (batch.size > newSize){
		const itemsLeft = batch.size - newSize;
		const newRow = createNewRow(batch.row, itemsLeft);
		const newBatch = createNewBatch(batch.libPlateIndex, batch.matchIndex, batch.matchSectionIndex + 1, newRow, itemsLeft);
		newBatch.assignCrystalPlate(batch.crystalPlate);
		batch.size = newSize;
		batch.row.querySelector('.items').innerHTML = newSize;
		divideBatch(newBatch, newSize);
	}
}

function validateMerge(batchList) {
	let valid = true; 
	const libPlate = batchList[0].libPlate;
	const index = batchList[0].matchIndex;
	
	batchList.forEach(batch => {
		if (batch.libPlate !== libPlate || batch.matchIndex !== index){
			valid = false
			alert('You cannot merge batches which use different library or crystallisaton plates.');
		}
	});
	return valid;
}

function merge2Batches(batch1, batch2) {
	batch1.size = batch1.size + batch2.size;
	batch1.row.querySelector('.items').innerHTML = batch1.size;
	batch1.row.querySelector('input.batch-checkbox').checked = false;

	batch2.row.remove();
	batch2 = null;
}

//returns an array of Batch objects represented by selected rows in the table
function getSelected() {
	selected = [];
	document.querySelectorAll('.batch-row').forEach(row => {
		if (row.querySelector('input.batch-checkbox').checked === true) {
			selected.push(findBatchByRow(row));
		}
	});
	return selected;
}

function totalMatched(array) {
	let total = 0;
	array.forEach(plate => {
		total = total + plate.matchedItems
	});
	return total;
}

function colourCodeTable() {
	//colour rows to show where a new match starts; highlight very small batches
	let oldLibPlateIndex = 0;
	let oldMatchIndex = 0;
	let colour = 'white';
	
	document.querySelectorAll('.batch-row').forEach(row => {
		const currentBatch = findBatchByRow(row);
		const newMatchIndex = currentBatch.matchIndex;
		const newLibPlateIndex = currentBatch.libPlateIndex;
		if ( newMatchIndex !== oldMatchIndex || oldLibPlateIndex !== newLibPlateIndex ){
				colour = changeColour(colour);
		}
		if (currentBatch.size < 6 ) {
			row.querySelector('.items').style.background = 'red';
		}	
		row.style.background = colour;
		oldMatchIndex = newMatchIndex;
		oldLibPlateIndex = newLibPlateIndex;
	});
}

function showUnused() {
	console.log('showUnused');
	let i = 0;
	document.querySelectorAll('tbody td.unused-crystals').forEach(cell => {
		//console.log(crystallisationPlates[i]);
		cell.innerHTML = crystallisationPlates[i].unmatchedItems;
		i++;
	});
	i = 0;
	document.querySelectorAll('tbody td.unused-compounds').forEach(cell => {
		//console.log(libraryPlates[i]);
		cell.innerHTML = libraryPlates[i].unmatchedItems;
		i++;
	});
}

function deleteBatch(batch) {
	index = batches.indexOf(batch);
	batches.splice(index, 1);
}
