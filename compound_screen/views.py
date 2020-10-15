from django.shortcuts import render

def source(request):
	return render(request, "compound_screen/source.html", {
		"title": "Source compounds table",
		"table_caption": "Source compounds", 
	})

def crystals(request):
	return render(request, "compound_screen/crystals.html", {
	"title": "Crystals table",
	"table_caption": "Crystals", 
	})

def batches(request):
	return render(request, "compound_screen/batches.html", {
	"title": "Batches table",
	"table_caption": "Batches", 
	})

def soak(request):
	return render(request, "compound_screen/soak.html", {
	"title": "Soak table",
	"table_caption": "Soaking", 
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
