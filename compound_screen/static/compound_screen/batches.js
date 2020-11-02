document.addEventListener('DOMContentLoaded', () => {

	const batchNumbers = document.querySelectorAll('.bno');
	
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
	
})
