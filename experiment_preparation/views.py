from django.shortcuts import render
#from django.http import HttpResponse

# Create your views here.
def index(request):
	return render(request, "experiment_preparation/index.html")

def cherrypicking(request):
	return render(request, "experiment_preparation/c-selection.html", {
		"title": "Compound Selection",
		"page_heading": "XChem in-house library explorer", 
		"page_info": "Select the most suitable compounds from XChem in-house libraries, and save your selection for your future experiment. You can use various filters and sorting options to refine your selection.", 
		"table_caption": "Compounds in XChem in-house libraries", 
	})

def c_check(request):
	return render(request, "experiment_preparation/c-check.html", {
		"title": "Selected Compounds",
		"page_heading": "Compound selected for the current experiment", 
		"page_info": "Make a list of compounds to be used in the the current experiment only", 
		"table_caption": "Compounds selected for the experiment: currently available", 
	})
