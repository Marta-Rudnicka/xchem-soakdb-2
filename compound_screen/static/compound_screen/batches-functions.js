/* high-level functions used by batches.js */
/* requires batches.helpers.js and batches-classes-consts.js */

//update <option>s representing each plate in the <select> elements 

function updatePlateSelections() {	
	//remove old options except 'None' and already selected options
	document.querySelectorAll('select').forEach(element => {
		if (element.className !== 'protocol-selection') {
			element.querySelectorAll('option').forEach(option => {
				if (option.className !== 'selected' && option.value !== 'null') {
					option.remove();
				}
			});
		}
		//update already selected option, or create a list of new, up-to-date options
		if (element.querySelector('.selected')) {
			manageExistingSelection(element);
		}
		else {
			if (element.className === 'lib-plate-selection') {
				createPlateOptions(element, libraryPlates);
			}
			else if (element.className === 'cr-plate-selection') {
				createPlateOptions(element, crystallisationPlates);
			}
		}
	});
}


function getBatchSize() {
	if (document.getElementById('one-per-match').checked === true ){
		batchSize = null;
	}
	else if (document.getElementById('by-number-of-crystals').checked === true ){
		batchSize = parseInt(document.getElementById('number-of-crystals').value); 
	}
	return batchSize;
}

function activateSelect(select) {
	select.addEventListener('change', () => {
		const currentRow = select.closest('.batch-row');
		const plateIndex = select.value;
		let currentBatch = findBatchByRow(currentRow);
		let plateArray = null;
		
		if (!currentBatch){
			currentBatch = createNewBatch(0);
			currentBatch.assignRow(currentRow);
		}
		
		if (select.className === 'lib-plate-selection') {
			plateArray = libraryPlates;
		}
		else if (select.className === 'cr-plate-selection'){
			plateArray = crystallisationPlates;
		}
		
		const [newRowNeeded, batchCount] = currentBatch.assignPlate(plateArray, plateIndex);

		if (newRowNeeded) {
			createNewRow(currentRow);
		}
		
		if (batchCount > 1 && currentBatch.crystalPlate) {
			makeMultipleRows(currentRow);
		}
		
		cleanUpOrphanRows();
		generateBatchNumbers();
		updatePlateSelections();
		updateCheckbox(currentRow);
		colourCodeTable();
	});
} 

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
	})
}

function mergeList(selected) {
	
	if (validateMerge(selected) === true) {
		firstBatch = selected[0];
		selected.forEach(batch => {
			if (batch !== firstBatch) {
				merge2Batches(firstBatch, batch);
			}
		});
	}
	return firstBatch;
}

//TODO
function deleteSelected(selected) {
	console.log('TODO: deleteSelected')
}

function divideAll() {
	batches.forEach(batch => {
		if (batch.crystalPlate && batch.libPlate) {
			const batchCount = batch.divideBatch(batchSize);
			if (batchCount > 1) {
				makeMultipleRows(batch.row);
			}
		}
	});
}

function activateAllotmentButton(button) {
	button.addEventListener('click', () => {
		const row = button.closest('.crystal-row');
		showEditOptions(row);
		activateSaveAllotmentButton(row);
	});
}

function activateSaveAllotmentButton(row) {
	const button = row.querySelector('.save-allotment')
	button.addEventListener('click', () => {
		hideEditOptions(row);
		if ( !plateMatched(row) ) {
			findAndResizePlate(row);
		}
		else {
			window.alert('Some of the crystals in this plate already have compounds allocated to them. To edit the plate, first unselect it from any batches it belongs to.');
		}
	});
}

function saveSelected(array) {
	array.forEach(batch => {
		
		shrink(findRelatedMultiRowCell(batch.row, '.lib-plate'));
		shrink(findRelatedMultiRowCell(batch.row, '.cr-plate'));
		const firstRowInLib = findRelatedMultiRowCell(batch.row, '.lib-plate').closest('.batch-row');	
		const firstRowInCr = findRelatedMultiRowCell(batch.row, '.cr-plate').closest('.batch-row');	
		let libCell = batch.row.querySelector('.lib-plate');
		let crystalCell = batch.row.querySelector('.cr-plate');
		
		if (batch.row !== firstRowInLib) {
			if (!crystalCell) {
				crystalCell = addMissingCell('cr-plate', batch.row);
			}
			else {
				divideCell('.cr-plate', batch.row);
			}
			const row = document.querySelector('#batch-table tbody').removeChild(batch.row);
			libCell = addMissingCell('lib-plate', row);
			document.querySelector('#batch-table tbody').insertBefore(row, firstRowInLib);
		}
		else if (batch.row === firstRowInLib) {
			
			divideCell('.cr-plate', batch.row);
			divideCell('.lib-plate', batch.row);
		}

		libCell.innerHTML = batch.libPlate.name;
		crystalCell.innerHTML = batch.crystalPlate.name;
		batch.row.querySelector('.checkbox-cell').innerHTML = '';
	});
	
}
