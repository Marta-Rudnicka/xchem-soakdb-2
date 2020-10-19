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
		"tbody": generate_table_body('<td class="lib">[data]</td><td class="plate">[data]</td><td class="code">[data]</td><td class="smiles">[data]</td><td class="c2d"><img alt="alttext" src="../static/experiment_preparation/pic.png"></td><td class="p1">[data]</td><td class="p2">[data]</td><td class="p3">[data]</td><td class="p4">[data]</td><td class="priority">(none)</td><td><input class="select" type="checkbox"></td>'),
		"page_info": "Select the most suitable compounds from XChem in-house libraries, and save your selection for your future experiment. You can use various filters and sorting options to refine your selection.", 
		"table_caption": "Compounds in XChem in-house libraries", 
	})

def c_check(request):
	return render(request, "experiment_preparation/c-check.html", {
		"title": "Selected Compounds",
		"page_heading": "Compound selected for the current experiment",
		"tbody": generate_table_body('<td class="lib">[data]</td><td class="plate">[data]</td><td class="code">[data]</td><td class="smiles">[data]</td><td class="c2d"><img alt="alttext" src="../static/experiment_preparation/pic.png"></td><td class="p1">[data]</td><td class="p2">[data]</td><td class="p3">[data]</td><td class="p4">[data]</td><td class="priority">High</td><td><button class="remove-button">Remove</button><button class="include-button">Include</button></td>'),
		"page_info": "Make a list of compounds to be used in the the current experiment only", 
		"table_caption": "Compounds selected for the experiment: currently available", 
	})
