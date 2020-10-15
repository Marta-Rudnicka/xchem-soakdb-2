document.addEventListener('DOMContentLoaded', () => {
	
//create arrays of cells for each column
	const cells2d = document.querySelectorAll('.c2d');
	const allp1 = document.querySelectorAll('.p1');
	const allp2 = document.querySelectorAll('.p2');
	const allp3 = document.querySelectorAll('.p3');
	const allp4 = document.querySelectorAll('.p4');
	const allCC = document.querySelectorAll('.cc');
	const allLib = document.querySelectorAll('.lib');
	const allPlate = document.querySelectorAll('.plate');
	const allSmiles = document.querySelectorAll('.smiles');
	const allCode = document.querySelectorAll('.code');
	
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
	hideElementList('hide-cc', allCC, 'show-cc');
	
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
	showElementList('show-cc', allCC);
})
