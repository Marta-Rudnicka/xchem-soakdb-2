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
	return render(request, "experiment_preparation/c-selection.html", {
		"title": "Compound Selection",
		"page_heading": "XChem in-house library explorer", 
		"table_caption": "Compounds in XChem in-house libraries", 
		"counter": range(1, 61),
	})

def c_check(request):
	return render(request, "experiment_preparation/c-check.html", {
		"title": "Selected Compounds",
		"page_heading": "Compounds in the current experiment",
		"page_info": "Make a list of compounds to be used in the the current experiment only", 
		"table_caption": "Compounds selected for the experiment: currently available", 
		"counter": range(1, 61),
	})
