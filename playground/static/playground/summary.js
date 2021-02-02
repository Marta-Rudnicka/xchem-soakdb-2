document.addEventListener('DOMContentLoaded', () => {
console.log('loaded')

if ( document.getElementById('no-protein') ) {
	document.getElementById('protein-form').style.display='block';
	}
	
document.getElementById('edit-protein').addEventListener('click', () => {
	console.log('click');
	document.getElementById('protein-form').style.display='block';
	});
});
