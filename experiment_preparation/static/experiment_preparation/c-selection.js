/*javascript specific to s-selection.html; uses functions declared in 
 * functions.js 
 
 
/*Filter Strings: used for displaying info about selected sorting and 
 * filtering options*/
var sortOption = "Library";
var sortDirection = "Ascending	";
var removeOption = null;
var removeRelationship = null;
var removeValue = null;
var addOption = null;
var addRelationship = null;
var addValue = null;
var action = null;
var start = null;
var end = null;	

//resets all Filter Strings and filter options/values
function resetFilters(){
		
		removeOption = null;
		removeRelationship = null;
		removeValue = null;
		addOption = null;
		addRelationship = null;
		addValue = null;
		action = null;
		start = null;
		end = null;	
		
		setAllElementValuesTo(['#remove', '#add', '#remove-text', 
		'#add-text', '#remove-num', '#add-text-option', 
		'#remove-num-option', '#add-num', '#sorting', '#sort-dir' ], 
		"null"); 
		
		setAllElementValuesTo(['#remove-num-option', '#add-num-option', 
		'#remove-string', '#add-string'], ''); 
	}


/* for debugging */
function printAllStrings(){
	console.log('sortOption =', sortOption, 'removeOption =', 
	removeOption, 'removeRelationship = ', removeRelationship, 
	'removeValue = ', removeValue, 'addOption = ', addOption, 
	'addRelationship = ', addRelationship, 'addValue = ', addValue, 
	'action = ', action, 'start = ', start, 'end = ', end);
}

document.addEventListener('DOMContentLoaded', () => {
	
	//create arrays of cells for each column
	const cells2d = document.querySelectorAll('.c2d');
	const allp1 = document.querySelectorAll('.p1');
	const allp2 = document.querySelectorAll('.p2');
	const allp3 = document.querySelectorAll('.p3');
	const allp4 = document.querySelectorAll('.p4');
	const allLib = document.querySelectorAll('.lib');
	const allPlate = document.querySelectorAll('.plate');
	const allSmiles = document.querySelectorAll('.smiles');
	const allCode = document.querySelectorAll('.code');
	
	//array of checkboxes in table
	const selectCheckboxes = document.querySelectorAll('.select');
	
	//array of advanced filters
	const allAdvanced = document.querySelectorAll('.advanced');
	const allSortByColumn=document.querySelectorAll('.sort-by-column');
	
	document.querySelectorAll('.increase').forEach(pic => {
		pic.onclick = () => {
			console.log('click!');
			var val = parseInt(pic.parentElement.querySelector('.pr').innerHTML) - 1;
			if (val > 0) {
				pic.parentElement.querySelector('.pr').innerHTML = val;
			}
		}
	})
	
	document.querySelectorAll('.decrease').forEach(pic => {
		pic.onclick = () => {
			console.log('click!');
			var val = parseInt(pic.parentElement.querySelector('.pr').innerHTML) + 1;
			if (val < 6) {
				pic.parentElement.querySelector('.pr').innerHTML = val;
			}
		}
	})
	
	selectCheckboxes.forEach(checkbox => {
		checkbox.onchange = () => {
			if (checkbox.checked === true) {
				
				checkbox.parentElement.parentElement.querySelector('.pr').style.visibility = "visible";
				checkbox.parentElement.parentElement.querySelector('.increase').style.visibility = "visible";
				checkbox.parentElement.parentElement.querySelector('.decrease').style.visibility = "visible";
				checkbox.parentElement.parentElement.querySelector('.no-pr').style.display = "none";
				checkbox.parentElement.parentElement.querySelector('.priority').style.color = 'black';
			}
			else {
				checkbox.parentElement.parentElement.querySelector('.pr').style.visibility = "hidden";
				checkbox.parentElement.parentElement.querySelector('.increase').style.visibility = "hidden";
				checkbox.parentElement.parentElement.querySelector('.decrease').style.visibility = "hidden";
				checkbox.parentElement.parentElement.querySelector('.no-pr').style.display = "inline-block";
				checkbox.parentElement.parentElement.querySelector('.priority').style.color = 'grey';
			}
		}
	})
	
	//for 'Select all' and 'Unselect all' buttons
	checkAllByButton('select-all', selectCheckboxes)
	uncheckAllByButton('unselect-all', selectCheckboxes)
	
	//update Filter Strings related to <select> form elements
	document.querySelectorAll('select').forEach(tag => {
		tag.onchange = () => {
			const selected = getSelectString(tag.id);
			if (tag.id === 'remove-num') removeRelationship = selected;
			else if (tag.id === 'add-num') 	addRelationship = selected;
			else if (tag.id === 'remove-text-option') removeValue = selected;
			else if (tag.id === 'add-text-option') addValue = selected;
			else if (tag.id === 'sorting') 	sortOption = selected;
			else if (tag.id === 'sort-dir') sortDirection = selected;
			else if (tag.id === 'action') action = selected;
		}
	})
	
	//update Filter Strings related to <input> form elements
	document.querySelectorAll('input:not([type="checkbox"])').forEach(tag => {
		tag.onchange = () => {
			console.log('change!!!');
			const selected = getInputString(tag.id);
			if (tag.id === 'remove-num-option' || tag.id === 'remove-string') removeValue = selected;
			else if (tag.id === 'add-num-option' || tag.id == 'add-string') addValue = selected;
			else if (tag.id === 'start') start = selected;
			else if (tag.id === 'end') end = selected;
		}
	})	
	
	/*'Hide options' button*/
	document.getElementById('hide-filter-options').addEventListener("click", function() {
		hide(['#hide-filter-options', '#advanced'])
		document.getElementById('show-filter-options').style.display = 'inline-block';
		hideClass('.sort-by-column');
		return false;	
		})
	
	/*'Show options' button */
	document.getElementById('show-filter-options').addEventListener("click", function() {
		document.querySelectorAll('form.advanced').forEach(form => {
			form.style.display = 'block';
			})
		document.getElementById('show-filter-options').style.display = 'none';
		document.getElementById('advanced').style.display = 'block';
		document.getElementById('hide-filter-options').style.display = 'inline-block';
		showHiddenClass('.sort-by-column');
		return false;	
		})
	
	/*When 'Apply sorting/filters' button is clicked, use Filter 
	 * Strings to generate info about all the filters and sorting 
	 * applied, and add to the box 'Filters and sorting applied in 
	 * current view:'  */	
	document.getElementById('filter-button').onclick = () => {
		
		printAllStrings();		
		
		/*show info only if user has selected all options/values for a 
		 * particular filter/sort */
		document.getElementById('current-sort').innerHTML = sortOption;
		document.getElementById('current-sort-direction').innerHTML = sortDirection;
		
		if (removeValue !== null  &&  removeRelationship !== null && removeOption !== null) {
			const li2 = document.createElement('li');
			li2.innerHTML = 'Remove all rows where "' + removeOption + 
			'" ' + removeRelationship + ' "' + removeValue + '"<button class="in-table">Undo</button>';
			document.querySelector('#filter-list').append(li2);
		}
		
		if (addValue !== null &&  addRelationship !== null && addOption !== null) {
			const li3 = document.createElement('li');
			li3.innerHTML = 'Add all rows where "' + addOption + '" ' 
			+ addRelationship + ' "' + addValue + '"<button class="in-table">Undo</button>';
			document.querySelector('#filter-list').append(li3);
		}
		
		if (action !== null && start !== null  &&  end !== null) {
			const li4 = document.createElement('li');
			li4.innerHTML = action + ' all compunds from rows ' + start + 
			' to ' + end + '"<button class="in-table">Undo</button>';
			document.querySelector('#filter-list').append(li4);
		}
		
		//hide flitering/sorting menu, reset filter options and Filter Strings
		document.getElementById('hide-filter-options').click();
		resetFilters();		
		return false;		
	}	
	
	//buttons for hiding table columns
	hideElementList('hide-2d', cells2d, 'show-2d');
	hideElementList('hide-p1', allp1, 'show-p1');
	hideElementList('hide-p2', allp2, 'show-p2');
	hideElementList('hide-p3', allp3, 'show-p3');
	hideElementList('hide-p4', allp4, 'show-p4');
	hideElementList('hide-lib', allLib, 'show-lib');
	hideElementList('hide-code', allCode, 'show-code');
	hideElementList('hide-plate', allPlate, 'show-plate');
	hideElementList('hide-smiles', allSmiles, 'show-smiles');
	
	//buttons for showing hidden table columns
	showElementList('show-2d', cells2d);
	showElementList('show-p1', allp1);
	showElementList('show-p2', allp2);
	showElementList('show-p3', allp3);
	showElementList('show-p4', allp4);
	showElementList('show-lib', allLib);
	showElementList('show-code', allCode);
	showElementList('show-plate', allPlate);
	showElementList('show-smiles', allSmiles);
	
	hideElementList('hide-filter-options', allAdvanced)
	/*showElementList('show-filter-options', allAdvanced, )*/

	
	//actions after selecting the property to filter by (Remove)
	document.getElementById('remove').onchange = () => {
		const removeValue = document.getElementById('remove').value;
		
		//update Filter String
		removeOption = getSelectString('remove');
		
		//display options apropriate for data type of the property
		if (removeValue.includes('num')) {
			show(['#remove-num', '#remove-num-option'], 'grid')
			hide(['#remove-text-option', '#remove-text', '#remove-string']);
		}
		else if (removeValue.includes('text')) {
			hide(['#remove-num', '#remove-num-option']);
			show(['#remove-text-option', '#remove-text'], 'grid');
		}		
	}
	
	//actions after selecting the property to filter by (Add)
	//similar to (Remove)
	document.getElementById('add').onchange = () => {
		const addValue = document.getElementById('add').value;
		addOption = getSelectString('add');
		
		if (addValue.includes('num')) {
			show(['#add-num', '#add-num-option'], 'grid');
			hide(['#add-text-option', '#add-text', '#add-string']);
		}
		else if(addValue.includes('text')) {
			hide(['#add-num', '#add-num-option']);
			show(['#add-text-option', '#add-text'], 'grid');
		}
	}
	
	/*actions after selecting relationship type for text-based 
	 * properties (Remove) */
	document.getElementById('remove-text').onchange = () => {
		const textInputType = document.getElementById('remove-text').value;
		
		//update Filter String
		removeRelationship = getSelectString('remove-text');
		
		//display input field type appropriate for the relationship type
		//'is/is' not gets a list of options, 'contains (no)' gets 
		//text input box
		if (textInputType.includes('contains')) {
			document.getElementById('remove-text-option').style.display="none";
			document.getElementById('remove-string').style.display="grid";
		}
		else
		{
			document.getElementById('remove-text-option').style.display="grid";
			document.getElementById('remove-string').style.display="none";
		}
	}	
	
	/* actions after selecting relationship type for text-based 
	 * properties  (Add), similar to 'Remove' */
	document.getElementById('add-text').onchange = () => {
		const textInputType = document.getElementById('add-text').value;
		addRelationship = getSelectString('add-text');
		if (textInputType.includes('contains')) {
			document.getElementById('add-text-option').style.display="none";
			document.getElementById('add-string').style.display="grid";
		}
		else
		{
			document.getElementById('add-text-option').style.display="grid";
			document.getElementById('add-string').style.display="none";
		}		
	}
	
	document.getElementById('add-libs').onclick = () => {
		document.getElementById('hidden-on-load').style.display = 'block';
		document.querySelector('tbody').style.visibility = 'visible';
		showWhenChecked('dsi-poised', 'dsi-poised-l', 'list-item');
		showWhenChecked('frag-lites', 'frag-lites-l', 'list-item');	
		showWhenChecked('pep-lites', 'pep-lites-l', 'list-item');	
		showWhenChecked('mini-frags', 'mini-frags-l', 'list-item');	
		showWhenChecked('cysteine-covalent', 'cysteine-covalent-l', 'list-item');	
		showWhenChecked('york-3d', 'york-3d-l', 'list-item');	
		showWhenChecked('leeds-3d', 'leeds-3d-l', 'list-item');	
		countChecked(['dsi-poised', 'frag-lites', 'pep-lites', 'mini-frags', 'cysteine-covalent', 'york-3d', 'leeds-3d' ],'libs-count');
		return false;
	}
	
	
	
})
