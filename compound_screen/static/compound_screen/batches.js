document.addEventListener('DOMContentLoaded', () => {
	
	//create Plate objects from the initial batches table, and add them to the libraryPlates array
	//let i = 0;
	document.querySelectorAll('.batch-row').forEach(row => {
		const name = row.querySelector('.lib').innerHTML + ': ' + row.querySelector('.lib-plate').innerHTML;
		const numberOfItems = row.querySelector('.missing-matches').innerHTML
		libraryPlates.push(new Plate(name, numberOfItems));
		//i++;
	})
	
	//create Plate objects from the "Crystallisation plates" table, and add them to the crystallisationPlates array
	//i = 0;
	document.querySelectorAll('.crystal-row').forEach(row => {
		const name = row.querySelector('.cr-plate-name').innerHTML
		const numberOfItems = row.querySelector('.crystals-number').innerHTML
		crystallisationPlates.push(new Plate(name, numberOfItems));
		//i++;
	})
	
	//create Batches objects from the matching table
	//(after first loading, there is only one row for each library plate)
	let i = 0;
	document.querySelectorAll('.batch-row').forEach(row => {
		const items = parseInt(row.querySelector('.missing-matches').innerHTML);
		const newBatch = new Batch(i, 0, 0, row, items);
		batches.push(newBatch);
		i++;
	})
	
	//fill in totals in the "Library plates" and "Crystallisation plates" tables
	document.getElementById('total-compounds').innerHTML = totalCompounds();
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
		}
		else {
			const number = document.getElementById('number-of-crystals').value; 
			createBatchesByNumberOfCrystals(number);
		}
		
		event.preventDefault();
	});
/*
	
	//change background colour for every other batch
	batchNumbers.forEach(input => {
		input.addEventListener('change', (event) => {
			if (input.value % 2 === 0) {
				input.parentElement.parentElement.setAttribute("class", "dark");
			}
			else {
				input.parentElement.parentElement.setAttribute("class", "");
			}
		})
	})
	
	//use HideableArray objects to show and hide table columns with buttons
	
	//used in ids and class names of table cells and buttons that control them
	keywords = ['lib', 'well', 'cp', 'drop'];
	
	//make HideableArray objects (from classes.js) to show and hide table cells with buttons
	keywords.forEach(keyword => {	
		let constructorArguments = "(document, '." + keyword + "', 'table-cell', '#hide-" + keyword +"', '#show-" + keyword + "', 'inline-block');";
		eval('column' + keyword + ' = new HideableArray' + constructorArguments);
		eval('column' + keyword + '.addListeners();');		
	})
	*/
})
