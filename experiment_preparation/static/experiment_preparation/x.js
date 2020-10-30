document.addEventListener('DOMContentLoaded', () => {
	//hide and show crystals in a used plate using HideableArray object (from classes.js)
	const group = new HideableArray(document, '.plate-list', '.plate-list', '#show-all', '#hide-all', 'inline-block', '.plate-list-shown' );
	group.addListeners();		
	
	document.querySelectorAll('.plate-details').forEach(button => {
		button.onclick= () => {
			window.open('test_library');
			}
		})
})
