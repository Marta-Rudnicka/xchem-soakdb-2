/* generates initial objects and assigns functionalities to DOM elements in batches.html template */

document.addEventListener('DOMContentLoaded', () => {
	
	//create data objects based on values scraped from the HTML <- TODO - better way of getting data
	document.querySelectorAll('.lib-row').forEach(row => {
		const name = row.querySelector('.lib-name').innerHTML + ': ' + row.querySelector('.lib-plate').innerHTML;
		const numberOfItems = row.querySelector('.compounds-number').innerHTML
		libraryPlates.push(new Plate(name, numberOfItems));
	});
	
	document.querySelectorAll('.crystal-row').forEach(row => {
		const name = row.querySelector('.cr-plate-name').innerHTML
		const numberOfItems = row.querySelector('.crystals-number').innerHTML
		crystallisationPlates.push(new Plate(name, numberOfItems));
	});
	
	//generate missing elements	
	document.getElementById('total-compounds').innerHTML = totalCompounds();
	document.getElementById('total-items').innerHTML = totalCompounds();
	document.getElementById('total-crystals').innerHTML = totalCrystals();
	updatePlateSelections();
	
	//event listeners
	
	document.querySelectorAll('.edit-allotment').forEach( button => {
		activateAllotmentButton(button);
	});
	
	document.getElementById('batch-size-form').addEventListener('change', ()=> {
		batchSize = getBatchSize();
		if (batchSize) {
			mergeMatches();
			divideAll();
		}
		else {
			mergeMatches();
		}
		
		generateBatchNumbers();
		colourCodeTable();
		event.preventDefault();
	});
	
	document.querySelectorAll('select').forEach(select => {
		activateSelect(select);
	});
	
	document.getElementById('merge-selected').addEventListener('click', () => {
		mergeList(getSelected());
		generateBatchNumbers();
		console.log('merge runs colour code')
		colourCodeTable();
	});
	
	document.getElementById('delete-selected').addEventListener('click', () => {
		deleteSelected(getSelected());
	});
	
	document.getElementById('save-selected').addEventListener('click', () => {
		saveSelected(getSelected());
	});
	
	document.getElementById('batch-size-form').addEventListener('submit', ()=> {
		event.preventDefault();
	});
})
