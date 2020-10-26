from django.shortcuts import render
import string

def generate_table_body(html_string):
	rows = ""
	for i in range(61):
		rows = rows + "<tr><td>" + str(i+1) + "</td>" + html_string + "</tr>\n"
	
	return rows	

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
	
wells = generate_well_names(8, 13)
wells_small = generate_well_names(3, 4)
wells_small_1 = wells_small[0:8]
wells_small_2 = wells_small[8:-1]

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
	"title": "Batches table",
	"table_caption": "Batches", 
	"counter": range(61),
	})

def soak(request):
	return render(request, "compound_screen/soak.html", {
	"title": "Soak table",
	"table_caption": "Soaking", 
	"counter": range(61),
	})

def cryo(request):
	return render(request, "compound_screen/cryo.html", {
	"title": "Cryo table",
	"table_caption": "Cryo", 
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
