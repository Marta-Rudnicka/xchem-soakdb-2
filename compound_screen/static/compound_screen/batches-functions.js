/* high-level functions used by batches.js */
/* requires batches.helpers.js and batches-classes-consts.js */

//update <option>s representing each plate in the <select> elements
function updatePlateSelections() {	
	//remove old options except 'None' and already selected options
	document.querySelectorAll('select').forEach(element => {
		element.querySelectorAll('option').forEach(option => {
			if (option.className !== 'protected' && option.value !== 'null') {
				option.remove();
			}
		});
		//update already selected option, or create a list of new, up-to-date options
		if (element.querySelector('.protected')) {
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

/*
function activateOkButton(button) {
	button.addEventListener('click', () => {
		const parentRow = button.parentElement.parentElement;
		
		createMatch(parentRow);
		parentRow.querySelector('.instructions').innerHTML = instrReady;
		updateCrystalPlateSelections();
		
		//i.e. when all matches have been made (createMatch() deletes the OK button)
		if (document.querySelector('.ok-button') === null ) {
			changeToView(2);
		}
	})	
}
*/

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

function deleteSelected(selected) {
	selected.forEach(batch => {
		batch.row.remove();
		deleteBatch(batch);
	});

	document.getElementById('total-items').innerHTML = totalMatched(libraryPlates);	
	showUnused();
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

