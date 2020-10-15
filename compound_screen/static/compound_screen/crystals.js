document.addEventListener('DOMContentLoaded', () => {
		
	const allX = document.querySelectorAll('.x');
	const allY = document.querySelectorAll('.y');
	const allPlate = document.querySelectorAll('.plate');
	const allDrop = document.querySelectorAll('.drop');
	const allScore = document.querySelectorAll('.score');
	const picCheckBoxes = document.querySelectorAll('.show-image');
	const allRemoveButtons = document.querySelectorAll('.remove-button');
	const allIncludeButtons = document.querySelectorAll('.include-button');


	hideElementList('hide-x', allX, 'show-x');
	hideElementList('hide-y', allY, 'show-y');
	hideElementList('hide-plate', allPlate, 'show-plate');
	hideElementList('hide-drop', allDrop, 'show-drop');
	hideElementList('hide-score', allScore, 'show-score');
	

	showElementList('show-x', allX);
	showElementList('show-y', allY);
	showElementList('show-plate', allPlate);
	showElementList('show-drop', allDrop);
	showElementList('show-score', allScore);
	
	checkAllByButton('show-images', picCheckBoxes)
	uncheckAllByButton('hide-images', picCheckBoxes)
	
	document.getElementById('texrank').onclick = () => {
		document.querySelector('tbody').style.display = "table-row-group";
	}
	
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
	
})
