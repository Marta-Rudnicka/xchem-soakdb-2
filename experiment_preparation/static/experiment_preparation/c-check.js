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
	const allPreset = document.querySelectorAll('.preset');
//create arrays of remove and include buttons
	const allRemoveButtons = document.querySelectorAll('.remove-button');
	const allIncludeButtons = document.querySelectorAll('.include-button');



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
	hideElementList('hide-preset', allPreset, 'show-preset');
	
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
	showElementList('show-preset', allPreset);
	
	allRemoveButtons.forEach(button => {
		button.onclick = () => {
			console.log('clicked');
			button.parentElement.parentElement.setAttribute("class", "removed");
			button.parentElement.querySelector('.include-button').style.display = 'inline-block';
			button.style.display = 'none';
		}
	})
	
	allIncludeButtons.forEach(button => {
		button.onclick = () => {
			console.log('clicked');
			button.parentElement.parentElement.setAttribute("class", "");
			button.parentElement.querySelector('.remove-button').style.display = 'inline-block';
			button.style.display = 'none';
		}
	})
	
	document.getElementById('load').onclick = () => {
		console.log('click!');
		document.getElementById('datatable-body').style.display = 'table-row-group';
		return false;
	}
})
