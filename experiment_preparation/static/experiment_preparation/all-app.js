document.addEventListener('DOMContentLoaded', () => {

	document.getElementById('hide-sidebar').onclick = () => {
		document.querySelector('aside').style.display = 'none';
		document.querySelector('.datatable').style.gridColumn = '2/-1';
		document.querySelector('#show-sidebar').style.display = 'inline-block';
	}
	
	document.getElementById('show-sidebar').onclick = () => {
		document.querySelector('aside').style.display = 'block';
		document.querySelector('.datatable').style.gridColumn = '2';
		document.querySelector('#show-sidebar').style.display = 'none';
	}

})
