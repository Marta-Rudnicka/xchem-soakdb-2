from django.shortcuts import render
#from django.http import HttpResponse

# Create your views here.
def index(request):
	return render(request, "experiment_preparation/index.html")

def cherrypicking(request):
	return render(request, "experiment_preparation/c-selection.html", {
		"title": "Compound Selection",
		"page_heading": "XChem compound explorer", 
		"page_info": "Use sorting, filtering and priorities to select the most suitable compounds from XChem in-house libraries. Save your selection for your future experiment.", 
		"table_caption": "Compounds in XChem in-house libraries", 
	})

def c_check(request):
	return render(request, "experiment_preparation/c-check.html", {
		"title": "Selected Compounds",
		"page_heading": "Next screen", 
		"page_info": "Make a list of compounds to be used in the next screen", 
		"table_caption": "Compounds selected for the experiment: currently available", 
	})
