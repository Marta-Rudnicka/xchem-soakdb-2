//small functions to make setTimeout easier	
function hideParent(element){
	element.parentElement.className = 'hidden';
}
	
function show(element){
	element.style.display = 'block';
}
	
function showDiv(element){
	element.className = 'gallery';
}
	
function showHidden(element){
	element.hidden = false;
}
	
function clearStyle(element) {
	element.style="";
}

function updateTotals() {
	var totalAccepted = 0;
	var totalRejected = 0;
	
	document.querySelectorAll('.counter-accepted').forEach(span => {
		totalAccepted = totalAccepted + parseInt(span.innerHTML);
		})
	document.querySelectorAll('.counter-rejected').forEach(span => {
		totalRejected = totalRejected + parseInt(span.innerHTML);
		})
		
	document.getElementById('total-accepted').innerHTML = totalAccepted;
	document.getElementById('total-rejected').innerHTML = totalRejected;
	
}

function hideTile(image) {
		
		const parent = image.parentElement;
		
		//animate hiding a tile
		parent.querySelector('.bin-pic').hidden = true;
		parent.querySelector('.info-pic').hidden = true;
		parent.style = 'animation-play-state: running; animation-duration: 0.4s';
		parent.querySelector('.main-pic').style = 'animation-play-state: running; animation-duration: 0.4s';
		setTimeout(hideParent, 400, image);
		setTimeout(clearStyle, 400, parent);
		setTimeout(clearStyle, 400, parent.querySelector('.main-pic'));
}

function showTile(binParent, containerClass) {
		
		//update counters of accepted and rejected crystals in each plate
		const counterAccepted = binParent.parentElement.parentElement.querySelector(containerClass).parentElement.querySelector('.counter-accepted');
		const counterRejected = binParent.parentElement.parentElement.querySelector(containerClass).parentElement.querySelector('.counter-rejected');
		var accepted = parseInt(counterAccepted.innerHTML);
		var rejected = parseInt(counterRejected.innerHTML);		
		if (containerClass === '.rejected') {
			counterAccepted.innerHTML = accepted - 1;
			counterRejected.innerHTML = rejected + 1;
		}
		else {
			counterAccepted.innerHTML = accepted + 1;
			counterRejected.innerHTML = rejected - 1;
		}
		updateTotals();
		
		//find a hidden div to show	
		const galleryDivs = binParent.parentElement.parentElement.querySelector(containerClass).querySelectorAll('div');
		var newDiv = null;
		var found = false;
		galleryDivs.forEach( div => {
			if (found === true) {
				return;
			}
			if (div.className === 'hidden') {
				newDiv = div;
				found = true;
				console.log('showDiv: ', showDiv);
			}
		})
		
		//animate showing a new tile
		showDiv(newDiv);
		newDiv.style = 'animation-play-state: running; animation-direction: reverse; animation-duration: 0.4s';
		newDiv.querySelector('.main-pic').style = 'animation-play-state: running; animation-direction: reverse; animation-duration: 0.4s';
		setTimeout(clearStyle, 400, newDiv);
		setTimeout(clearStyle, 400, newDiv.querySelector('.main-pic'));
		setTimeout(showHidden, 420, newDiv.querySelector('.bin-pic'));
		setTimeout(showHidden, 420, newDiv.querySelector('.info-pic'));
		showDiv.className = "gallery";
}

document.addEventListener('DOMContentLoaded', () => {
	updateTotals();	
	
	//rejecting or recycling a crystal	
	document.querySelectorAll('.bin-pic').forEach(image => {
		image.onclick = () => {
			const parent = image.parentElement
			
			//make crystal info box empty if you remove highlighted crystal
			if (parent.className == 'gallery-highlighted'){
				document.getElementById('infobox').style.visibility = "hidden";
				document.getElementById('empty-crystal-info').style.visibility = "visible";
				document.getElementById('crystal-info').style.border = "solid black 3px";				
			}
			
			//hide-element
			 hideTile(image);
			
			//show new element in the other div
			if (parent.parentElement.className === 'accepted') {
				showTile(parent, '.rejected');			
			}
			else {
				showTile(parent, '.accepted');		
			}
		}
		
		//pretend to display info about a crystal
		document.querySelectorAll('.info-pic').forEach(image => {
		image.onclick = () => {
			document.getElementById('infobox').style.visibility = "visible";
			document.getElementById('empty-crystal-info').style.visibility = "hidden";
			document.getElementById('crystal-info').style.border = "solid #66ff00 6px";
			document.querySelectorAll('.gallery-highlighted').forEach(div => {
				div.className = "gallery"
			})
			image.parentElement.className = "gallery-highlighted"
			
			}
		})
	})
	
	document.getElementById('texrank').onclick = () => {
		document.querySelectorAll('section').forEach(section => {
			section.style.display = 'block';
		})
		document.getElementById('summary').hidden = false;
		document.getElementById('crystal-info').hidden = false;
		document.getElementById('texrank').hidden = true;
		document.getElementById('crystal-form').style.display = 'grid';
	}
	
})
