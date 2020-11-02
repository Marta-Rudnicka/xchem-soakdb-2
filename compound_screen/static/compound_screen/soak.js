const minUnit = 2.5
		
function calculateTransferVolume(dv, mu, ds) {
	return Math.round((dv * ds)  / (100 - ds) / mu, 0 ) * mu;
}
	
document.addEventListener('DOMContentLoaded', () => {
	
document.querySelectorAll('.batch-details').forEach( button => {
	button.addEventListener('click', () => {
		window.open('batch_details');
		})
	})
	
/*	
	
	//get drop volume
	const dv = document.querySelector("#dv").innerHTML;
	const csFields = document.querySelectorAll('.cs');	
			
	document.querySelector('form').addEventListener('submit', (event) => {
		//get values from the form
		const cs = document.querySelector("#cs").value;
		const ds = document.querySelector("#ds").value;
		
		//put compound stock concentration into the table
		csFields.forEach( cell => {	
			cell.innerHTML = cs;
		})
		
		//calculate transfer value
		document.querySelectorAll('.tv').forEach( td => {
			td.innerHTML = ds;
			td.innerHTML = calculateTransferVolume(dv, minUnit, ds);
		})
		event.preventDefault();
	});
	* 
*/
})
