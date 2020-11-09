document.addEventListener('DOMContentLoaded', () => {
	//create Plate objects from the initial batches table, and add them to the libraryPlates array
	document.querySelectorAll('.batch-row').forEach(row => {
		const name = row.querySelector('.lib').innerHTML + ': ' + row.querySelector('.lib-plate').innerHTML;
		const numberOfItems = row.querySelector('.missing-matches').innerHTML
		libraryPlates.push(new Plate(name, numberOfItems));
	})
	
	//create Plate objects from the "Crystallisation plates" table, and add them to the crystallisationPlates array
	document.querySelectorAll('.crystal-row').forEach(row => {
		const name = row.querySelector('.cr-plate-name').innerHTML
		const numberOfItems = row.querySelector('.crystals-number').innerHTML
		crystallisationPlates.push(new Plate(name, numberOfItems));
	})
	
	//create initial Batch objects from the matching table
	let i = 0;
	document.querySelectorAll('.batch-row').forEach(row => {
		const items = parseInt(row.querySelector('.missing-matches').innerHTML);
		const newBatch = new Batch(i, 0, 0, row, items);
		batches.push(newBatch);
		i++;
	})
	
	//fill in totals in the "Library plates" and "Crystallisation plates" tables
	document.getElementById('total-compounds').innerHTML = totalCompounds();
	document.getElementById('total-items').innerHTML = totalCompounds();
	document.getElementById('total-crystals').innerHTML = totalCrystals();
	
	updateCrystalPlateSelections();
		
	document.querySelectorAll('.ok-button').forEach(button => {
		activateOkButton(button);
	})
	
	document.querySelectorAll('.cr-plate-selection').forEach(select => {
		activateSelect(select);
	})
	
	document.getElementById('create-batches').addEventListener('click', () => {
		if (document.getElementById('one-per-match').checked === true ){
			generateBatchNumbers();
			changeTableView();
			changeToView(3);
		}
		else if (document.getElementById('by-number-of-crystals').checked === true ){
			const number = document.getElementById('number-of-crystals').value; 
			createBatchesByNumberOfCrystals(number);
			changeToView(3);
		}
		else {
			console.log('no method selected');
			alert('You need to select the method to create batches first.');
		}
		
		event.preventDefault();
	});
	
	document.getElementById('merge-selected').addEventListener('click', () => {
		mergeSelected();
	});
	
	document.getElementById('delete-selected').addEventListener('click', () => {
		deleteSelected();
	});
})
