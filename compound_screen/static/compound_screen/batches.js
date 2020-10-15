document.addEventListener('DOMContentLoaded', () => {

	const batchNumbers = document.querySelectorAll('.bno');
		
	document.querySelector('form').addEventListener('submit', (event) => {
			
		const cpb = parseInt(document.querySelector("#cpb").value);
		var batch_count = 1;
		var crystal_count = 0;
		var i = 1;
		
		batchNumbers.forEach( cell => {			
			cell.parentElement.parentElement.setAttribute("class", "");
			
			if (crystal_count === cpb) {
				batch_count = batch_count + 1 ;
				cell.value = batch_count;
				crystal_count = 1;
			}
			else {
				cell.value = batch_count;
				crystal_count ++;
			}
			i ++;
			
			if (cell.value % 2 === 0) {
				cell.parentElement.parentElement.setAttribute("class", "dark");
			}
		})
		
		event.preventDefault();
	});
	
		batchNumbers.forEach(input => {
			input.addEventListener('change', (event) => {
			if (input.value % 2 === 0) {
				input.parentElement.parentElement.setAttribute("class", "dark");
				}
			else {
				input.parentElement.parentElement.setAttribute("class", "");
		}
		
		})
	})
	
	
})
