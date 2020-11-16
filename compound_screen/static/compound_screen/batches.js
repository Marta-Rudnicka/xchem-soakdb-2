/* generates initial objects and assigns functionalities to DOM elements in batches.html template */

document.addEventListener('DOMContentLoaded', () => {
	//create Plate objects from the library table, and add them to the libraryPlates array
	document.querySelectorAll('.lib-row').forEach(row => {
		const name = row.querySelector('.lib-name').innerHTML + ': ' + row.querySelector('.lib-plate').innerHTML;
		const numberOfItems = row.querySelector('.compounds-number').innerHTML
		libraryPlates.push(new Plate(name, numberOfItems));
	});
	
	//create Plate objects from the "Crystallisation plates" table, and add them to the crystallisationPlates array
	document.querySelectorAll('.crystal-row').forEach(row => {
		const name = row.querySelector('.cr-plate-name').innerHTML
		const numberOfItems = row.querySelector('.crystals-number').innerHTML
		crystallisationPlates.push(new Plate(name, numberOfItems));
	});
	
	document.getElementById('number-of-crystals').addEventListener('change', ()=> {
		if (document.getElementById('one-per-match').checked === true ){
			batchSize = null;
		}
		else if (document.getElementById('by-number-of-crystals').checked === true ){
			batchSize = document.getElementById('number-of-crystals').value; 
			createBatchesByNumberOfCrystals(batchSize);
		}
	});
	
	document.getElementById('total-compounds').innerHTML = totalCompounds();
	document.getElementById('total-items').innerHTML = totalCompounds();
	document.getElementById('total-crystals').innerHTML = totalCrystals();
	
	updatePlateSelections();
	
	document.querySelectorAll('select').forEach(select => {
		activateSelect(select);
	});
	
	document.getElementById('merge-selected').addEventListener('click', () => {
		mergeSelected(getSelected());
	});
	
	document.getElementById('delete-selected').addEventListener('click', () => {
		deleteSelected(getSelected());
	});
})
