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

//changes the class of a selected <option> so it is not removed while updating selections
function saveOption(row, plateArray, index) {
	if (row) {
		let selection = null;
		if (plateArray === crystallisationPlates ) {
			selection = row.querySelector('.cr-plate-selection');
		}
		else {
			selection = row.querySelector('.lib-plate-selection');
		}
		if (selection) {
			selection.querySelectorAll('option').forEach(option =>{
				if (option.value !== 'null' && option.value === index){
					option.className = 'selected';
				}
				else {
					option.className = 'regular';
				}
			});
		}
	}
}

function updateCheckbox(row) {
	const batch = findBatchByRow(row)
	const checkboxCell = row.querySelector('.checkbox-cell');
		
	if (batch && batch.crystalPlate && batch.libPlate) {
		checkboxCell.innerHTML = '';
		checkboxCell.appendChild( makeCheckbox() );
	}
	else {
		checkboxCell.innerHTML = noCheckboxString;
	}
}

function makeCheckbox() {
	let checkbox = document.createElement('input');
	checkbox.type = 'checkbox';
	checkbox.className = "batch-checkbox";
	return checkbox;
}

//create <option> elements based on current state of Plate objects
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
	selectElement.querySelectorAll('option').forEach(option => {
		if (option.className === 'selected') {
			protectedValue = option.value;
		}
	});
	
	if (selectElement.querySelector('.selected')) {
		generateOptionLabel(selectElement.querySelector('.selected'));
	}
} 

function isEmpty(batch) {
	if (!batch.libPlate && !batch.crystalPlate) {
		return true;
	}
	else {
		return false;
	}	
}

//finds batch by the <tr> DOM object representing it; returns Batch object or null 
function findBatchByRow(tableRow){
	const batch = batches.find( ({ row }) => row === tableRow );
	if (batch) {
		return batch;
	}
	else {
		return null;
	}
}

//create a new row in the matching table for the same library plate 
//placement = 'under': row inserted directly under currentRow //TODO - is it still necessary?
//placement = 'end': row appended at the end of the table
function createNewRow(currentRow, placement = 'under') {
	const currentBatch = findBatchByRow(currentRow);
	
	//create and adjust new row
	newRow = currentRow.cloneNode(true);
	
	findExtraBatch(currentBatch).assignRow(newRow);
	
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
	
	findRelatedMultiRowCell(currentRow, '.lib-plate').rowSpan ++;
	
	if(newRow.querySelector('.lib-plate')) {
		newRow.querySelector('.lib-plate').remove();
	}

	return newRow;
}

function findExtraBatch(currentBatch) {
	let value = null;
	batches.forEach(batch => {
		if (!batch.crystalPlate && !batch.row && batch.libPlate === currentBatch.libPlate) {
			value = batch;
		}
	});
	return value;
}

function clearClonedSelection(select) {
	select.querySelectorAll('option').forEach(option => {
		option.className = 'regular';	
	});
}

function createNewBatch(size, libPlate = null, crystalPlate = null) {
	const newBatch = new Batch(size, libPlate, crystalPlate);
	batches.push(newBatch);
	return newBatch;
}

function changeColour(colour){
	if (colour === 'floralwhite'){
		return 'aliceblue';
	}
	else {
		return 'floralwhite';
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
	
	shrink(findRelatedMultiRowCell(row1, '.lib-plate'));
	shrink(findRelatedMultiRowCell(row1, '.cr-plate'));
	row2.remove();
}

function findRelatedMultiRowCell(row, className){
	let libCell = row.querySelector(className);
	while (libCell === null && row) {
		row = row.previousElementSibling;
		if (row) {
			libCell = row.querySelector(className);
		}
	}
	return libCell;
}

function shrink(cell) {
	if (cell.rowSpan > 1 ){
		cell.rowSpan --;
	}
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

//show where a match ends and highlight very small batches in red
function colourCodeTable() {
	//colour rows to show where a new match starts; highlight very small batches
	let oldLibPlate = null;
	let oldCrystalPlate = null;
	let colour = 'blue';
	
	document.querySelectorAll('.batch-row').forEach(row => {
		const currentBatch = findBatchByRow(row);
		if (currentBatch && currentBatch.libPlate && currentBatch.crystalPlate) {
			const newLibPlate = currentBatch.libPlate;
			const newCrystalPlate = currentBatch.crystalPlate;
			if ( newLibPlate !== oldLibPlate || newCrystalPlate !== oldCrystalPlate ){
					colour = changeColour(colour);
			}
			
			row.querySelector('.items').style = '';
			row.style.background = colour;
			if (row.querySelector('.lib-plate') ){
				row.querySelector('.lib-plate').style.background = 'white';
			}
			if (currentBatch.size < 6 ) {
				row.querySelector('.items').style.background = 'red';
			}	
			oldLibPlate = newLibPlate;
			oldCrystalPlate = newCrystalPlate;
		}
		else {
			row.style.background = 'white';
		}
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
		if (batch.crystalPlate ) {
			batch.crystalPlate.unmatchItems(batch.size);
		}
	
	
	if (batch.libPlate) {
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
		if (libCell && libCell.rowSpan > 1 && !findBatchByRow(row)) {
			const nextRow = row.nextElementSibling;
			cloneCell = libCell.cloneNode(true);
			shrink(cloneCell);
			if (cloneCell.querySelector('.selected')) {
				cloneCell.querySelector('select').value = cloneCell.querySelector('.selected').value;
			}
			console.log('insering cloneCell: ');
			console.log(cloneCell)
			console.log('before cell: ')
			console.log(nextRow.querySelector('.cr-plate'))
			nextRow.insertBefore(cloneCell, nextRow.querySelector('.cr-plate'));
			row.remove();
			nextRow.style.background = 'white';
			activateSelect(nextRow.querySelector('select'));
			updateCheckbox(nextRow);
		}
		//an orphan row is somewhere else
		else if (!findBatchByRow(row) && !libCell) {
			shrink(findRelatedMultiRowCell(row, '.lib-plate'));
			row.remove();
		}
	});
}

function makeMultipleRows(currentRow) {
	const currentBatch = findBatchByRow(currentRow);
	let libCell = currentRow.querySelector('.lib-plate');
	
	let blankRow = currentRow.cloneNode(true);
	blankRow.querySelector('.cr-plate').remove();
	
	if ( blankRow.querySelector('.lib-plate') ) {
		blankRow.querySelector('.lib-plate').remove();
	}
	
	let i = 1;
	batches.forEach(batch => {
		if (batch.libPlate === currentBatch.libPlate && batch.crystalPlate === currentBatch.crystalPlate) {
			if (i > 1 ){
				//findRelatedLibraryCell(currentRow).rowSpan ++;
				findRelatedMultiRowCell(currentRow, '.lib-plate').rowSpan ++;
				
				currentRow.querySelector('.cr-plate').rowSpan ++;
				const newRow = blankRow.cloneNode(true);
				batch.assignRow(newRow);
				document.querySelector('#batch-table tbody').insertBefore(newRow, currentRow.nextElementSibling);
				updateCheckbox(newRow);
				//updateCheckbox(currentRow);
			}
			i ++;
		}
	});
}

function mergeMatches() {
	libraryPlates.forEach(libPlate => {
		crystallisationPlates.forEach(crystalPlate => {
			mergeMatch(libPlate, crystalPlate);
		});
	generateBatchNumbers();
	});
}

function mergeMatch(libPlate, crystalPlate){
	let matched = [];
	//let crystalCount = 0;
	batches.forEach(batch => {
		if (batch.libPlate === libPlate && batch.crystalPlate === crystalPlate) {
	//		crystalCount = crystalCount + batch.size;
			matched.push(batch);
		}
	});
	if (matched.length > 1 ){
		return mergeList(matched);
	}
	//return crystalCount;
}


function showEditOptions(row) {
	row.querySelector('.alloted-input').style.display = 'inline-block';
	row.querySelector('.save-allotment').style.display = 'inline-block';
	row.querySelector('.alloted-number').style.display = 'none';
	row.querySelector('.edit-allotment').style.display = 'none';
}

function hideEditOptions(row) {
	row.querySelector('.alloted-input').style.display =  'none';
	row.querySelector('.save-allotment').style.display = 'none';
	row.querySelector('.alloted-number').style.display = 'inline-block';
	row.querySelector('.edit-allotment').style.display = 'inline-block';
}

function plateMatched(row) {
	const plateName = row.querySelector('.cr-plate-name').innerHTML;
	const plate = crystallisationPlates.find( ({ name }) => name === plateName );
	if ( batches.find( ({ crystalPlate }) => crystalPlate === plate ) ) {
		return true;
	}
	else {
		return false;
	}
}

function findAndResizePlate(row) {
	const newSize = row.querySelector('.alloted-input').value
	const plateName = row.querySelector('.cr-plate-name').innerHTML;
	const plate = crystallisationPlates.find( ({ name }) => name === plateName );
	if (newSize > plate.originalSize ) {
		window.alert('This crystallisation plate only has ' + plate.originalSize + ' usable crystals in it.')
	}
	else {
		plate.resize(newSize);
		row.querySelector('.alloted-number').innerHTML = newSize;
		updatePlateSelections();
	}
	
}

function addMissingCell(className, row){
	const cell = document.createElement('td');
	cell.className = className;
	if (className === 'lib-plate'){
		row.insertBefore(cell, row.querySelector('.cr-plate'));
		cell.className = 'lib-plate';
	}
	
	else if (className === 'cr-plate') {
		row.insertBefore(cell, row.querySelector('.drop'));
		cell.className = 'cr-plate';
	}
	return cell; 
}

function divideCell(className, row) {
	let nextCellClass = null;
	const nextRow = row.nextElementSibling;
	let newCell = row.querySelector(className).cloneNode(true);
	
	if (!nextRow.querySelector(className)) {
		if (className === '.lib-plate') {
			nextCellClass = '.cr-plate';
		}
		else if (className === '.cr-plate') {
			nextCellClass = '.drop';
		}
		//shrink(newCell);
		nextRow.insertBefore(newCell, nextRow.querySelector(nextCellClass));
		row.querySelector(className).rowSpan = 1;
	}
}
