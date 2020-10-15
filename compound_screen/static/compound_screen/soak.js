const minUnit = 2.5
		
function calculateTransferVolume(dv, mu, ds) {
	return Math.round((dv * ds)  / (100 - ds) / mu, 0 ) * mu;
}
	
document.addEventListener('DOMContentLoaded', () => {
	
	//get drop volume
	const dv = document.querySelector("#dv").innerHTML;
	const multiCheckbox = document.getElementById("multi");
	const cshead = document.getElementById('cshead');
	const csFields = document.querySelectorAll('.cs');
	
	document.querySelector('#multi').onclick = () =>  {
		//hide the 'Compound [stock] mM' column
		if (multiCheckbox.checked == false){
			cshead.style.display = 'none';
			csFields.forEach( cell => {
				cell.style.display = 'none';
			})
		}
		else {
		//show the column
			cshead.style.display = 'table-cell';
			csFields.forEach( cell => {
				cell.style.display='table-cell';
			})
		}
	}	
		
			
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
})
