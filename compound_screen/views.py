from django.shortcuts import render
import string

def generate_well_names(highest_letter, highest_number): 
	
	#generate lists of strings to concatenate into well names
	part_1 = list(string.ascii_uppercase)[0:highest_letter]
	part_2 = []
	for x in range(1,highest_number):
		if x<10:
			part_2.append('0' + str(x))
		else:
			part_2.append(str(x))

	part_3 = [['a', 'c'], ['d']]

	#generate an ordered list of all well names in $naming_system_1
	well_name_list = []
	
	for number in part_2:
		for charlist in part_3:
			for cap in part_1:
				for letter in charlist:
					well_name_list.append(cap + number + letter)
	return well_name_list

# a real crystallisation plate	
wells = generate_well_names(8, 13)
# a model of a crystallisation plate for testing (with fewer pictures to load)
wells_small = generate_well_names(3, 4)
#parts of a plate model to simulate partially used plate
wells_small_1 = wells_small[0:8]
wells_small_2 = wells_small[8:-1]

libraries = [['DSI_poised', 'plate_name1', 96 ], ['York3D', 'plate_name2', 84], ['FragLites', 'plate_name3', 127]]
#libraries = [['DSI_poised', 'plate_name1', 96 ], ['York3D', 'plate_name2', 84]]
crystal_plates = [ ['Crystallisation_Plate1', 92],['Crystallisation_Plate2', 56], ['Crystallisation_Plate3', 48], ['Crystallisation_Plate4', 86], ['Crystallisation_Plate5', 37]]
#crystal_plates = [ ['Crystallisation_Plate1', 92],['Crystallisation_Plate2', 56], ['Crystallisation_Plate4', 86]]

def source(request):
	return render(request, "compound_screen/source.html", {
		"title": "Source compounds table",
		
		"table_caption": "Source compounds", 
		"counter": range(61)
	})

def crystals(request):
	return render(request, "compound_screen/crystals.html", {
	"title": "Crystal gallery",
	"header": "CRYSTAL GALLERY",
	"table_caption": "Crystals", 
	#"wells": wells,
	"wells": wells_small,
	"wells_part_1": wells_small_1,
	"wells_part_2": wells_small_2
	})

def batches(request):
	return render(request, "compound_screen/batches.html", {
	"title": "Batches",
	"header": "Matching compounds to crystals",
	"table_caption": "Batches", 
	"counter": range(1, 61),
	"libraries": libraries,
	"crystal_plates" : crystal_plates ,
	})

def soak(request):
	return render(request, "compound_screen/soak.html", {
	"title": "Soaking",
	"header": "Soaking crystals",
	"page_info": "Monitor and manage the soaking process",
	"table_caption": "Soaking", 
	"counter": range(1, 15),
	})

def batch_details(request):
	return render(request, "compound_screen/batch_details.html", {
	"title": "Batch details",
	"header": "Batch details",
	"counter": range(1, 24),
	})

def cryo(request):
	return render(request, "compound_screen/cryo.html", {
	"title": "Cryo table",
	"header": "Cryo",
	"page_info": "Monitor and manage cryo",
	"table_caption": "Cryo", 
	"counter": range(1, 15),
	})

def harvesting(request):
	return render(request, "compound_screen/harvesting.html", {
	"title": "Harvesting table",
	"table_caption": "Harvesting", 
	})

def collection(request):
	return render(request, "compound_screen/collection.html", {
	"title": "Data collection",
	"table_caption": "Data collection", 
	})
