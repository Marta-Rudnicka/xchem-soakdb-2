/*lower-level functions managing DOM elements
 * used by batches-function.js and batches-classes-consts.j */
 
//replacement for information about a batch
const noBatchString = '<span class="small">no batch<br>created yet</span>';
const noCheckboxString = '<span class="small">not ready </span>';

function generateBatchNumbers() {
	let i = 1;
	document.querySelectorAll('.batch-row').forEach(row => {
		const batch = findBatchByRow(row);
		if (batch !== null) {
			batch.batchNumber = i;
			row.querySelector('.items').innerHTML = batch.size;
			row.querySelector('.batch').innerHTML = i;
			i++;
		}
		else {
			row.querySelector('.items').innerHTML = noBatchString;
			row.querySelector('.batch').innerHTML = noBatchString;
		}
	})
}

/* NOT USED YET */
function createBatchesByNumberOfCrystals(size) {
	batches.forEach(batch => {
		divideBatch(batch, size);
	});
	generateBatchNumbers();
}

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
		total = total + plate.size;
		})
	return total;
}

/*
function updateRowHtml(row){
	console.log('updating row appearance: ')
	console.log(row);
	updatePlateSelections();
	if (row !== null ) {
		row.querySelectorAll('select').forEach(select => {
			select.querySelectorAll('option').forEach(option => {
			//console.log('option class: ', option.className )
				if (option.className === 'protected') {
					console.log('selecting back: ')
					select.value = option.value;
					console.log('select value: ', select.value);
				}
			});
		});
		/*update selections, protect selected option against removing
		row.querySelectorAll('select').forEach(select => {
			console.log('processing select: ')
			console.log(select)
			select.querySelectorAll('option').forEach(option => {
				option.className = 'regular';
			});
			//if (select.selectedOptions.length === 1 && select.value !== 'null') {
		/*	try {
				select.selectedOptions[0].className = 'protected';
				console.log('selectedOptions: ', select.selectedOptions)
				console.log('setting ', select.value, 'as protected');
			}
			catch (e) {
				if (e instanceof TypeError ) {
					console.log('no protected');
				}
			
		});
		
		try {
			row.querySelector('.items').innerHTML = findBatchByRow(row).size;
		}
		catch (e) {
			console.log('catching exception')
			if (e instanceof TypeError ) {
				row.querySelector('.items').innerHTML = noBatchString;
			}
		}
		
		//updateCheckbox(row);
	}
}*/

//changes the class of a selected <option> so it is not removed while updating selections
function saveOption(row, plateArray, index) {
	if (row !== null) {
		let selection = null
		if (plateArray === crystallisationPlates ) {
			selection = row.querySelector('.cr-plate-selection');
		}
		else {
			selection = row.querySelector('.lib-plate-selection');
		}
		selection.querySelectorAll('option').forEach(option =>{
			if (option.value !== 'null' && option.value === index){
				option.className = 'protected';
			}
			else {
				option.className = 'regular';
			}
		});
	}
}

function updateCheckbox(row) {
	const batch = findBatchByRow(row)
	const checkboxCell = row.querySelector('.checkbox-cell');

	if ( newCheckboxNeeded(checkboxCell, batch) ) {
		let checkbox = document.createElement('input');
		checkbox.type = 'checkbox';
		checkbox.className = "batch-checkbox";
		checkboxCell.appendChild(checkbox);
		checkboxCell.querySelector('span').remove();
	}
	else {
		checkboxCell.innerHTML = noCheckboxString;
	}
}

function newCheckboxNeeded(td, batch) {
	const checkboxPresent = td.querySelector('input')
	return batch && batch.libPlate && batch.crystalPlate && !checkboxPresent;
}

//create <option> elements based on current state of Plate objects in the crystallisationPlates array
function createPlateOptions(selectElement, plateArray) {

	let plateName = '';
	let items = '';

	if (plateArray === crystallisationPlates){
		items = 'crystals';
	}
	else {
		items = 'compounds';
	}

	plateArray.forEach(plate => {
		if (plate.unmatchedItems > 0 ) {
			let newOption = document.createElement("option");
			newOption.className = 'regular';
			newOption.value = plateArray.indexOf(plate);
			selectElement.appendChild(newOption); 
			generateOptionLabel(newOption);
		}
	});
}

function generateOptionLabel(option) {
	const parent = option.closest('select');
	let items = '';
	let plateArray = null;
	if (parent.className === 'cr-plate-selection'){
		items = 'crystals';
		plateArray = crystallisationPlates;
	}
	else {
		items = 'compounds';
		plateArray = libraryPlates;
	}
	const plate = plateArray[option.value];
	
	if (plate) {
		option.innerHTML = plate.name + ', ' + items + ' available: ' + plate.unmatchedItems; 
	}
}

function manageExistingSelection(selectElement) {
	let protectedValue = -1;
	//find protected option
	selectElement.querySelectorAll('option').forEach(option => {
		if (option.className === 'protected') {
			protectedValue = option.value;
		}
	});
	//find and remove duplicate of protected option
	selectElement.querySelectorAll('option').forEach(option => {
		if (option.className !== 'protected' && option.value === protectedValue) {
			option.remove();
		}
	});
	
	if (selectElement.querySelector('.protected')) {
		generateOptionLabel(selectElement.querySelector('.protected'));
	}
} 


function removeUnneeded() {
/*	document.querySelectorAll('.batch-row').forEach(row => {
		const batch = findBatchByRow(row);
		let needed = null;
		
		if (row.querySelector('.lib-plate') !== null) {
			needed = true;
		}
		else if(batch !== null && !isEmpty(batch)) {
			needed = true;
		}
		else {
			needed = false;
		}
		
		if (!needed) {
			row.remove();
		}
	});
	*/
	libraryPlates.forEach(plate => {
		let batchesToMerge = [];
		batches.forEach(batch => {
			if (batch.libPlate === plate && batch.crystalPlate === null) {
				batchesToMerge.push(batch);			
			}
		});
		
		if (batchesToMerge.length >= 2) {
			mergeSelected(batchesToMerge);	
		}
	});
}

function isEmpty(batch) {
	if (batch.libPlate === null && batch.crystalPlate === null) {
		return true;
	}
	else {
		return false;
	}
	
}

//finds batch by the <tr> DOM object representing it; returns Batch object or null 
function findBatchByRow(row){
	returnValue = null;
	batches.forEach( batch => {
	if ( batch.row === row ) {
		returnValue = batch;
		}
	})
	return returnValue;
}

//create a new row in the matching table for the same library plate 
//placement = 'under': row inserted directly under currentRow //TODO - is it still necessary?
//placement = 'end': row appended at the end of the table
function createNewRow(currentRow, placement = 'under') {
	const currentBatch = findBatchByRow(currentRow);
	
	//create and adjust new row
	newRow = currentRow.cloneNode(true);
	
	batches[batches.length - 1].assignRow(newRow);
	newRow.querySelectorAll('select').forEach( select => {
		clearClonedSelection(select);
		activateSelect(select);
	});
	
	//find appropriate place and insert the new row
	nextRow = currentRow.nextElementSibling;
	if (nextRow) {
		document.getElementById('batches-tbody').insertBefore(newRow, nextRow); 
	}
	else {
		document.getElementById('batches-tbody').appendChild(newRow);
	}
	
	findRelatedLibraryCell(currentRow).rowSpan ++;
	
	if(newRow.querySelector('.lib-plate')) {
		newRow.querySelector('.lib-plate').remove();
	}

	return newRow;
}

function clearClonedSelection(select) {
	select.querySelectorAll('option').forEach(option => {
		option.className = 'regular';	
	});
}

function createNewBatch(size) {
	const newBatch = new Batch(size);
	batches.push(newBatch);
	return newBatch;
}

/* TODO - probably remove both
// view-1 (on load) displays elements relevant for creating matches
// view-2 displays elements relevant for creating batches
// view-3 displays elements relevant for merging, deleting and saving batches
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

//transition from the layout for matching plates to the batches view
function changeTableView() {
	//show and hide coloumns
	const show = ['.batch', '.drop', '.batch-checkbox', '.pb-name', '.unused-crystals', '.unused-compounds'];
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
*/

/* NOT USED YET */
function changeColour(colour){
	if (colour === 'white'){
		return 'aliceblue';
	}
	else {
		return 'white';
	}
}

/*NOT USED YET*/
function divideBatch(batch, newSize) {
	while (batch.size > newSize){
		const itemsLeft = batch.size - newSize;
		const newRow = createNewRow(batch.row, itemsLeft);
	//	const newBatch = createNewBatch(batch.libPlateIndex, batch.matchIndex, batch.matchSectionIndex + 1, newRow, itemsLeft);
		newBatch.assignCrystalPlate(batch.crystalPlate);
		batch.size = newSize;
		batch.row.querySelector('.items').innerHTML = newSize;
		divideBatch(newBatch, newSize);
	}
}

function validateMerge(batchList) {
	let valid = true; 
	const libPlate = batchList[0].libPlate;
	const crystalPlate = batchList[0].crystalPlate;
	
	batchList.forEach(batch => {
		if (batch.libPlate !== libPlate || batch.crystalPlate !== crystalPlate){
			valid = false
			alert('You cannot merge batches which use different library or crystallisaton plates.');
		}
	});
	return valid;
}

function merge2Batches(batch1, batch2) {
	batch1.size = batch1.size + batch2.size;
	deleteBatch(batch2, false);
	if (batch1.row && batch2.row ){
		merge2Rows(batch1.row, batch2.row);
	}
}

function merge2Rows(row1, row2){
	const checkbox = row1.querySelector('input.batch-checkbox');
	
	if ( checkbox ) {
		checkbox.checked = false;
	}
	
	findRelatedLibraryCell(row1).rowSpan --;
	row2.remove();
}

//The table cell with the library plate spans all the rows representing
//batches that use that library cell; therefore only the first row in the HTML
//contains this cell.
function findRelatedLibraryCell(row){
	let libCell = row.querySelector('.lib-plate');
	while (libCell === null) {
		row = row.previousElementSibling;
		libCell = row.querySelector('.lib-plate');
	}
	return libCell;
}

//returns an array of Batch objects represented by selected rows in the table
function getSelected() {
	selected = [];
	document.querySelectorAll('.batch-row').forEach(row => {
		const checkbox = row.querySelector('input.batch-checkbox');
		if (checkbox && checkbox.checked === true) {
			selected.push(findBatchByRow(row));
		}
	});
	return selected;
}

//TODO - is it still used at all?
function totalMatched(array) {
	let total = 0;
	array.forEach(plate => {
		total = total + plate.matchedItems
	});
	return total;
}

//show where a match ends and highlight very small batches in red
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
	let i = 0;
	document.querySelectorAll('tbody td.unused-crystals').forEach(cell => {
		cell.innerHTML = crystallisationPlates[i].unmatchedItems;
		i++;
	});
	i = 0;
	document.querySelectorAll('tbody td.unused-compounds').forEach(cell => {
		cell.innerHTML = libraryPlates[i].unmatchedItems;
		i++;
	});
}

function deleteBatch(batch, unmatchStatus = true) {
	if (unmatchStatus === true) {
		if (batch.crystalPlate !== null ) {
			batch.crystalPlate.unmatchItems(batch.size);
		}
	
	
	if (batch.libPlate !== null) {
		batch.libPlate.unmatchItems(batch.size);
	}
	
	}
	index = batches.indexOf(batch);
	batches.splice(index, 1);
}

//(after de-selecting a crystalllisation plate)
//for rows that are displayed next to fully used library plate
//but are no longer connected to a batch
function cleanUpOrphanRows() {
	document.querySelectorAll('.batch-row').forEach(row => {
		const libCell = row.querySelector('.lib-plate');
		//orphan row is the first row
		if (libCell !== null && libCell.rowSpan > 1 && findBatchByRow(row) === null) {
			const nextRow = row.nextElementSibling;
			cloneCell = libCell.cloneNode(true);
			cloneCell.rowSpan --;
			cloneCell.querySelector('select').value = cloneCell.querySelector('.protected').value;
			nextRow.insertBefore(cloneCell, nextRow.querySelector('.wells'));
			row.remove();
		}
		//an orphan row is somewhere else
		else if (findBatchByRow(row) === null && libCell === null) {
			findRelatedLibraryCell(row).rowSpan -- ;
			row.remove();
		}
	});
}
