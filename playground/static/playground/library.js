//uses functions.js

document.addEventListener('DOMContentLoaded', () => {
	
	//used in ids and class names of table cells and buttons that control them
	keywords = ['well', 'code', 'smiles', 'c2d', 'concentration', 'p2', 'p3', 'p4'];
	
	//make HideableArray objects (from classes.js) to show and hide table cells with buttons
	keywords.forEach(keyword => {	
		let constructorArguments = "(document, '." + keyword + "', 'table-cell', '#hide-" + keyword +"', '#show-" + keyword + "', 'inline-block');";
		eval('column' + keyword + ' = new HideableArray' + constructorArguments);
		eval('column' + keyword + '.addListeners();');		
	})
})
