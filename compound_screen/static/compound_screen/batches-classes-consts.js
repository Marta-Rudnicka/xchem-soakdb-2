/*provides classes and variables used by batches.js */

//VARIABLES

//arrays of objects
let libraryPlates= [];
let crystallisationPlates =[];
let batches = [];
let batchSize = null;

//CLASSES

/* Explanation:
 * - If you MATCH a compound to a crystal, it means you decide to soak this particular crystal in a solution
 * of this particular compound; a MATCH is a pair of matched compounds
 * - ITEM refers to a single compound in a library plate, a single crystal in a crystallisation plate, or a 
 * single match in a Batch
 * - SIZE is the number of items tracked using the object
 * - the SIZE of a Plate only refers to items that are going to be used in the experiment, not all items
 * that are physically in the plate; e.g. if you have 300 crystals in a library plate, but you are using
 * to only 80 in the experiment, the Plate object will have the size of 80


/* Source (library) or destination (crystallisation) plate; object used to keep track of how many items
 * have been so far matched to items in the other type of plate.
 * Stored in two arrays: libraryPlates and crystallisationPlates
 *  */
class Plate {
	constructor(name, size){
		this.name = name;						//string
		this.size = parseInt(size); 			//int
		this.unmatchedItems = this.size;		//int
		this.matchedItems = 0;					//int
		this.originalSize = this.size;
	}
	
	//associate number of items to corresponding items in the other type of Plate in a Batch
	//used after assigning Plate to a Batch that already has the other type of Plate assigned
	useItems(number){
		this.unmatchedItems = this.unmatchedItems - number;
		this.matchedItems = this.matchedItems + number;
		if (this.unmatchedItems < 0) {
			this.useAll();
		}
		this.checkPlateIntegrity();
	}
	
	useAll() {
		this.unmatchedItems = 0;
		this.matchedItems = this.size;
		this.checkPlateIntegrity();
	}
	
	//disassociate from items in another Plate;
	//used either when Plate on which the method is called is removed from a Batch
	//or when the other Plate in the Batch is removed
	unmatchItems(number){
		if (this.matchedItems < number){
			this.unmatchedItems = this.size;
			this.matchedItems = 0;
		}
		else {
			this.unmatchedItems = this.unmatchedItems + number;
			this.matchedItems = this.matchedItems - number;
		}
		this.checkPlateIntegrity();
	}
	
	unmatchAll() {
		this.unmatchedItems = this.size;
		this.matchedItems = 0;
		this.checkPlateIntegrity();
	}
	
	resize(newSize) {
		if (this.originalSize < newSize ) {
			throw new RangeError("Trying to resize a crystallisation plate beyond its original size.");
		}
		else {
			this.size = parseInt(newSize);
			this.unmatchedItems = parseInt(newSize);
			this.matchedItems = 0;
		}
	}
	
	//for debugging
	checkPlateIntegrity() {
		if (this.size < 0 || this.unmatchedItems < 0 || this.matchedItems < 0 ) {
			throw new RangeError("Negative value(s) in a Plate object's properties; ", this);
		}
		
		if (this.unmatchedItems + this.matchedItems !== this.size) {
			throw new RangeError('Items in a Plate object do not add up: ', this);
		}
	}
}

/* A batch is a collection of matches that are processed together in a lab. It is
 * logically represented by a Batch object, and visually represented as a row
 * in the main HTML table
 * */
 
class Batch {
	constructor(size, libPlate = null, crystalPlate = null){
		this.row = null;									//(DOM object) a table row representing the Batch
		this.size = size;									//(int)
		this.libPlate = libPlate;								//(Plate object)
		this.crystalPlate = crystalPlate;							//(Plate object)
		this.batchNumber = null;							//(int) ID for human use
		
		//this.wells = [];									//(array) TODO
		//this.drops = [];									//(array) TODO	
	}
		
	assignRow(row) {
		this.row = row;
	}
	
	/*determine what kind of plate is assigned to Batch and run appropriate setter
	* Returns boolean used to determine whether a new row is needed in the main table.
	* A new row is needed, when a new match has been made, but there are still
	* some unmatched compounds in the library Plate involved in it
	* */
	assignPlate(plateArray, index) {
		saveOption(this.row, plateArray, index);
		
		let newRowNeeded = null;
		if (plateArray === libraryPlates) {
			newRowNeeded = this.assignLibPlate(index);
		}
		else {
			newRowNeeded = this.assignCrystalPlate(index);
		}
		this.cleanUpRubbishBatches();
		const batchCount = this.divideIntoSmallerBatches(batchSize);
		return [newRowNeeded, batchCount];
	}
	
	/*setter for LibPlate; should be called by assignPlate */
	/*returns boolean passed over to assignPlate() */
	assignLibPlate(index) {
		let newRowNeeded = null;
		
		if (index === 'null') {
			this.removeAllBatchesWithLib();
			newRowNeeded = false;
		}
		else if (this.libPlate !== null){
			this.replaceLibInAllBatches(libraryPlates[index]);
		}
		else {
			this.libPlate = libraryPlates[index];
			if (this.crystalPlate === null) {
				this.size = this.libPlate.unmatchedItems;
				newRowNeeded = false;
			}
			else {
				newRowNeeded = this.match();
			}
		}
		return newRowNeeded;
	}
	
	/*setter for CrystalPlate; should be called by assignPlate */
	/*returns boolean passed over to assignPlate() */
	assignCrystalPlate(index) {
		let newRowNeeded = null;
		
		if (this.crystalPlate !== null){
			if (batchSize) {
				mergeMatch(this.libPlate, this.crystalPlate);
			}
			this.crystalPlate.unmatchItems(this.size);
			if (this.libPlate !== null) {
				this.libPlate.unmatchItems(this.size);
			}
		}
		
		//assign plate if any is chosen
		if (index !== 'null') {
			this.crystalPlate = crystallisationPlates[index];
			if (this.libPlate === null) {
				this.size = this.crystalPlate.unmatchedItems;
				newRowNeeded = false;
			}
			else {
				newRowNeeded = this.match();
			}
		}
		else {
			this.resetCrystalPlate();
			newRowNeeded = false;
		}
		this.checkBatchIntegrity();
		return newRowNeeded;
	}
	
	resetCrystalPlate(){
		this.crystalPlate = null;
		this.useUnclaimedCrystals();
	}
	
	/* (after removing a crystal plate from a batch)
	 * If this batch's library plate is matched with plates that have some crystals left
	 * use those remaining crystals for this library's remaining compounds */
	
	useUnclaimedCrystals(){
		let shifted = 0;
		//find batches with plates with unused crystals, and assign the crystals to the batch
		batches.forEach(batch => {
			if (batch.crystalPlate !== null && batch.libPlate === this.libPlate && batch.crystalPlate.unmatchedItems > 0){
				const availableCompounds = batch.libPlate.unmatchedItems
				const availableCrystals =  batch.crystalPlate.unmatchedItems	
				if (availableCompounds >= availableCrystals) {
					shifted = availableCrystals;
					batch.libPlate.useItems(shifted);
					batch.crystalPlate.useAll();
					batch.setSize(batch.size + shifted);
				}
				else {
					shifted = availableCompounds;
					batch.crystalPlate.useItems(shifted);
					batch.libPlate.useAll();
					batch.setSize(batch.size + shifted);
				}
			}
		});
		//find batch without a crystal plate, and update its size; remove when emptied
		batches.forEach(batch => {
			if (batch.crystalPlate === null) {
				batch.setSize(batch.size - shifted);
				if (batch.size === 0) {
					deleteBatch(batch);
				}
			}
		});
	}
	
	removeAllBatchesWithLib() {
		const lib = this.libPlate;
		let mergeList = [];
		batches.forEach(batch => {
			if (batch.libPlate === lib){
				mergeList.push(batch);
			}
		});
		
		mergeList.forEach(batch => {
			batch.assignPlate(crystallisationPlates, 'null');
		});
		
		batches.forEach(batch => {
			if (batch.libPlate === lib){
				batch.libPlate.unmatchAll();
				batch.libPlate = null;
				deleteBatch(batch);
			}
		});
	}
	
	/*
	replaceLibInAllBatches(newLib) {
		let newRowNeeded = false;
		batches.forEach(batch => {
			if (batch.libPlate === this.libPlate ){
				this.reassignLib(newLib, batch);
			}
		});
	}
	
	reassignLib(newLib, batch) {
		if (newLib.unmatchedItems >= batch.size) {
			newLib.useItems(batch.size);
			batch.libPlate = newLib;
		}
		else {
			if ( newLib.unmatchedItems > 0) {
				try {
				batch.crystalPlate.unmatch(batch.size - newLib.unmatchedItems);
				}
				catch (e) {
					console.log('no crystal plate yet');
				}
				batch.setSize(newLib.unmatchedItems);
				newLib.useAll(); 
			}
			else {
				batch.crystalPlate.unmatch(batch.size);
				deleteBatch(batch);
			}
		}	
	}
	*/
	setSize(size){
		this.size = size;
	}
	
	//when both plates are assigned, update batch to fit all
	match() {
		
		let newRowNeeded = null;
		
		const unmatchedCrystals = this.crystalPlate.unmatchedItems
		const unmatchedCompounds = this.libPlate.unmatchedItems;
		
		if ( unmatchedCrystals !== unmatchedCompounds) {
			if (unmatchedCompounds > unmatchedCrystals) {
				newRowNeeded = true;
				
				this.libPlate.useItems(unmatchedCrystals);
				this.crystalPlate.useAll();
				this.setSize(unmatchedCrystals);
				
				const newBatch = createNewBatch(0);
				newBatch.assignPlate(libraryPlates, libraryPlates.indexOf(this.libPlate));
				newBatch.setSize(unmatchedCompounds - unmatchedCrystals);
			//	console.log('newBatch from MATCH: ', newBatch);
			}
			else {
				newRowNeeded = false;
				this.crystalPlate.useItems(unmatchedCompounds);
				this.libPlate.useAll();
				this.setSize(unmatchedCompounds);
			}
		}
		else {
			newRowNeeded = false;
		
		}
		return newRowNeeded;		
	}
	
	cleanUpRubbishBatches() {
		let listToMerge = [];	
		batches.forEach(batch => {
			if(batch.libPlate === this.libPlate && !batch.crystalPlate){
				listToMerge.push(batch);
			}
			else if ( !batch.libPlate && !batch.crystalPlate) {
				deleteBatch(batches);
			}
		});		
		if(listToMerge.length > 1){
			mergeList(listToMerge);
		}
	}
	
	divideIntoSmallerBatches(size) {	
		if (size && this.libPlate && this.crystalPlate){
			return this.divideBatch(size);
		}
	}
	
	divideBatch(newSize) {
		let batchCount = 1;
		while (this.size > newSize){
			this.setSize(this.size - newSize);
			const newBatch = createNewBatch(newSize, this.libPlate, this.crystalPlate);
			batchCount = batchCount + this.divideBatch(newSize);
		}
		return batchCount;
	}
	
	checkBatchIntegrity() {
		//console.log('integrity: ', this.size, this.libPlate.size);
		if (this.size < 0 ) {
			throw new RangeError("Negative size of a Batch object; ", this);
		}
		
		if (this.libPlate && (this.size > this.libPlate.size) ) {
			
			throw new RangeError('Batch object has more items than its libPlate: ', this);
		}
		
		if (this.crystalPlate && (this.size > this.crystalPlate.size) ) {
			throw new RangeError('Batch object has more items than its crystalPlate: ', this);
		}
	}
}
