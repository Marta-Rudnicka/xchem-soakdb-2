document.addEventListener('DOMContentLoaded', () => {
	
//create arrays of cells for each column
	const cells2d = document.querySelectorAll('.c2d');
	const allCC = document.querySelectorAll('.cc');
	const allLib = document.querySelectorAll('.lib');
	const allPlate = document.querySelectorAll('.plate');
	const allSmiles = document.querySelectorAll('.smiles');
	const allCode = document.querySelectorAll('.code');
	
	//buttons for hiding table columns
	hideElementList('hide-2d', cells2d, 'show-2d');
	hideElementList('hide-lib', allLib, 'show-lib');
	hideElementList('hide-code', allCode, 'show-code');
	hideElementList('hide-plate', allPlate, 'show-plate');
	hideElementList('hide-smiles', allSmiles, 'show-smiles');
	hideElementList('hide-cc', allCC, 'show-cc');
	
	//buttons for showing hidden table columns
	showElementList('show-2d', cells2d);
	showElementList('show-lib', allLib);
	showElementList('show-code', allCode);
	showElementList('show-plate', allPlate);
	showElementList('show-smiles', allSmiles);
	showElementList('show-cc', allCC);
	
	document.querySelectorAll('.increase').forEach(pic => {
		pic.onclick = () => {
			var val = parseInt(pic.parentElement.querySelector('.pr').innerHTML) - 1;
			if (val > 0) {
				pic.parentElement.querySelector('.pr').innerHTML = val;
			}
		}
	})
	
	document.querySelectorAll('.decrease').forEach(pic => {
		pic.onclick = () => {
			var val = parseInt(pic.parentElement.querySelector('.pr').innerHTML) + 1;
			if (val < 6) {
				pic.parentElement.querySelector('.pr').innerHTML = val;
			}
		}
	})
})
