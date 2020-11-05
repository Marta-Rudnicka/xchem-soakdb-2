document.addEventListener('DOMContentLoaded', () => {
	
	//create Plate objects from the initial batches table, and add them to the libraryPlates array
	let i = 0;
	document.querySelectorAll('.batch-row').forEach(row => {
		const name = row.querySelector('.lib').innerHTML + ': ' + row.querySelector('.lib-plate').innerHTML;
		const numberOfItems = row.querySelector('.missing-matches').innerHTML
		libraryPlates.push(new Plate(i, name, numberOfItems));
		i++;
	})
	
	//create Plate objects from the "Crystallisation plates" table, and add them to the crystallisationPlates array
	i = 0;
	document.querySelectorAll('.crystal-row').forEach(row => {
		const name = row.querySelector('.cr-plate-name').innerHTML
		const numberOfItems = row.querySelector('.crystals-number').innerHTML
		crystallisationPlates.push(new Plate(i, name, numberOfItems));
		i++;
	})
	
	//create Batches objects from the matching table
	//(after first loading, there is only one row for each library plate)
	i = 0;
	document.querySelectorAll('.batch-row').forEach(row => {
		const newBatch = new Batch(i, 0, 0, row);
		batches.push(newBatch);
		i++;
	})
	
	/*
	const batchNumbers = document.querySelectorAll('.bno');
	*/
	
	//fill in totals in the "Library plates" and "Crystallisation plates" tables
	document.getElementById('total-compounds').innerHTML = totalCompounds();
	document.getElementById('total-crystals').innerHTML = totalCrystals();
	
	updateCrystalPlateSelections();
		
	document.querySelectorAll('.ok-button').forEach(button => {
		activateButton(button);
	})
	
	document.querySelectorAll('.cr-plate-selection').forEach(select => {
		activateSelect(select);
	})
	
	/*
	//divide into batches by number of crystals	
	document.querySelector('form').addEventListener('submit', (event) => {
			
		const cpb = parseInt(document.querySelector("#cpb").value);
		var batch_count = 1;
		var crystal_count = 0;
		var i = 1;
		
		batchNumbers.forEach( cell => {			
			cell.parentElement.parentElement.setAttribute("class", "");
			
			if (crystal_count === cpb) {
				batch_count = batch_count + 1 ;
				cell.value = batch_count;
				crystal_count = 1;
			}
			else {
				cell.value = batch_count;
				crystal_count ++;
			}
			i ++;
			
			if (cell.value % 2 === 0) {
				cell.parentElement.parentElement.setAttribute("class", "dark");
			}
		})
		
		event.preventDefault();
	});
	
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
