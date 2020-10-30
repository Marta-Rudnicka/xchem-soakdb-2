from django.shortcuts import render

def generate_table_body(html_string):
	rows = ""
	for i in range(61):
		rows = rows + "<tr><td>" + str(i+1) + "</td>" + html_string + "</tr>\n"
	
	return rows


# Create your views here.
def index(request):
	return render(request, "experiment_preparation/index.html")

def cherrypicking(request):
	return render(request, "experiment_preparation/x.html", {
		"title": "Compound Selection",
		"page_info": "Select most suitable compounds for your experiment from XChem in-house libraries",
		"page_heading": "XChem in-house library explorer", 
		"table_caption": "Compounds in XChem in-house libraries", 
		"dsi_counter": range(1, 4),
		"fraglites_counter": range(1, 3),
		"peplites_counter": range(1, 5),
		"minifrags_counter": range(1, 6),
		"cysteine_counter": range(1, 4),
		"york_counter": range(1, 3),
		"leeds_counter": range(1, 5),
		"property_counter": range(23)
	})

def test_library(request):
	return render(request, "experiment_preparation/test_library.html", {
	"title": "Test library plate",
	"library": "Test library",
	"plate": "Test plate",
	"counter":	range(1, 61),
	})


def c_check(request):
	return render(request, "experiment_preparation/c-check.html", {
		"title": "Selected Compounds",
		"page_heading": "Compounds in the current experiment",
		"page_info": "Make a list of compounds to be used in the the current experiment only", 
		"table_caption": "Compounds selected for the experiment: currently available", 
		"counter": range(1, 61),
	})
