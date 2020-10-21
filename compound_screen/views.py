from django.shortcuts import render

def generate_table_body(html_string):
	rows = ""
	for i in range(61):
		rows = rows + "<tr><td>" + str(i+1) + "</td>" + html_string + "</tr>\n"
	
	return rows

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
	"counter1": range(1,15),
	"counter2": range(1,20),
	"counter3": range(1,8),
	"counter4": range(1,30),
	
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
