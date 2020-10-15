const minUnit = 2.5
		
function calculateCryoTransferVolume(crs, dv, mu, dc) {
	return Math.round((dc * dv)  / (crs - dc) / mu, 0 ) * mu;
}
	
document.addEventListener('DOMContentLoaded', () => {
	
	//get drop volume
	const dv = document.querySelector("#dv").innerHTML;
	
	const allCheckbox = document.getElementById("all");
	const locationFields = document.querySelectorAll('.location')
	
	//"all" checkbox in "cryo location" form
	document.querySelector('#all').onclick = () =>  {		
		if (allCheckbox.checked == true){
			//disable "to" and "from" fields
			document.getElementById('from').disabled = true;
			document.getElementById('fromlabel').style.color = 'grey';
			document.getElementById('to').disabled = true;
			document.getElementById('tolabel').style.color = 'grey';
			//set "from" and "to" to first and last batch
			//NOT IMPLEMENTED, dummy values 
			document.getElementById('from').value = '1';
			document.getElementById('to').value = '13';
			
			}
		
		else {
		//enable "to" and "from"
		document.getElementById('from').disabled = false;
		document.getElementById('fromlabel').style.color = 'black';
		document.getElementById('to').disabled = false;
		document.getElementById('tolabel').style.color = 'black';
		}
	}
	
	//calculate and display transfer volume
	document.querySelector('#value-form').addEventListener('submit', (event) => {
		//get values from the form
		const crs = document.querySelector("#crs").value;
		const dc = document.querySelector("#dc").value;
		const ctvFields = document.querySelectorAll('.ctv');
		
		//calculate
		document.querySelectorAll('.ctv').forEach( td => {
			td.innerHTML = dc;
			td.innerHTML = calculateCryoTransferVolume(crs, dv, minUnit, dc);
		})
		event.preventDefault();
	});
		
	//add cryo location to table
	//NOT IMPLEMENTED, one value for all table for demo
	document.querySelector('#location-form').addEventListener('submit', (event) => {
		console.log('location submitted');
		const location = document.getElementById("loc").value;
		console.log(location);
		locationFields.forEach( cell => {	
			cell.innerHTML = location;
		})
		event.preventDefault();
	})
		
		
})
