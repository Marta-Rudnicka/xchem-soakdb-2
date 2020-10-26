/* Defines actions of buttons and icons in the /compound_screen/crystals
 * path. Uses functions defined in crystals_functions.js	*/

document.addEventListener('DOMContentLoaded', () => {
	updateTotals();	
	
	//rejecting or recycling a crystal	
	document.querySelectorAll('.bin-pic').forEach(image => {
		image.onclick = () => {
			const parentTile = image.parentElement.parentElement;
			
			hideTile(image);
			
			//show new element in the other div
			if (parentTile.parentElement.className === 'accepted') {
				showTile(parentTile, '.rejected');
				updateCounter(parentTile, '.rejected');			
			}
			else {
				showTile(parentTile, '.accepted');
				updateCounter(parentTile, '.accepted');
			}
			
		}
	})
		
	//display info about a crystal
	document.querySelectorAll('.show-pic').forEach(image => {
		image.onclick = () => {
			showInfoBox(image);
		}
	})

	//hide info about crystal
	document.querySelectorAll('.hide-pic').forEach(image => {
		image.onclick = () => {
			hideInfoBox(image);
		}
	})
			
	//show new plate
	document.getElementById('texrank').onclick = () => {
		document.querySelectorAll('section').forEach(section => {
			section.style.display = 'block';
		})
		document.getElementById('summary').hidden = false;
		document.getElementById('crystal-form').style.display = 'grid';
	}
	
	//show all crystal info in a plate
	document.querySelectorAll('.show-all').forEach(button => {
		const parentPlate = button.parentElement.parentElement;
		button.onclick = () => {
			parentPlate.querySelectorAll('.show-pic').forEach(image => {
				showInfoBox(image)
			})
			parentPlate.querySelector('.hide-all').hidden = false;
			button.hidden = true;
		}
	})
	//hide all crystal info in a plate
	document.querySelectorAll('.hide-all').forEach(button => {
		const parentPlate = button.parentElement.parentElement;
		button.onclick = () => {
			parentPlate.querySelectorAll('.hide-pic').forEach(image => {
				hideInfoBox(image);
			})
			parentPlate.querySelector('.show-all').hidden = false;
			button.hidden = true;
		}
	})
	
	document.querySelectorAll('.show-plate').forEach(button => {
		const parentPlate = button.parentElement.parentElement
		button.onclick = () => {
			parentPlate.querySelector('.plate-body').hidden = false;
			parentPlate.querySelector('.show-plate').hidden = true;
			parentPlate.querySelector('.hide-plate').hidden = false;
		}
		
	})	
	
	document.querySelectorAll('.hide-plate').forEach(button => {
		const parentPlate = button.parentElement.parentElement
		button.onclick = () => {
			parentPlate.querySelector('.plate-body').hidden = true;
			parentPlate.querySelector('.show-plate').hidden = false;
			parentPlate.querySelector('.hide-plate').hidden = true;
		}
		
	})	
	
	document.querySelectorAll('.show-used-crystals').forEach(image => {
		const parentPlate = image.parentElement.parentElement
		image.onclick = () => {
			parentPlate.querySelector('.used').style.display = "flex";
			parentPlate.querySelector('.show-used-crystals').hidden = true;
			parentPlate.querySelector('.hide-used-crystals').hidden = false;
		}
		
	})	
	
	document.querySelectorAll('.hide-used-crystals').forEach(image => {
		const parentPlate = image.parentElement.parentElement
		image.onclick = () => {
			parentPlate.querySelector('.used').style.display = "none";
			parentPlate.querySelector('.show-used-crystals').hidden = false;
			parentPlate.querySelector('.hide-used-crystals').hidden = true;
		}
		
	})	
})
