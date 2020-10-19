from django.shortcuts import render

def generate_table_body(html_string):
	rows = ""
	for i in range(61):
		rows = rows + "<tr><td>" + str(i+1) + "</td>" + html_string + "</tr>\n"
	
	return rows


def source(request):
	return render(request, "compound_screen/source.html", {
		"title": "Source compounds table",
		"tbody": generate_table_body('<td class="lib">[data]</td><td class="plate">[data]</td><td class="cc">[data]</td><td class="code">[data]</td><td class="smiles">[data]</td><td class="c2d"><img src="../static/compound_screen/pic.png" alt="alttext"></td><td class="p1">[data]</td><td class="p2">[data]</td><td class="p3">[data]</td><td class="p4">[data]</td>'),
		"table_caption": "Source compounds", 
	})

def crystals(request):
	return render(request, "compound_screen/crystals.html", {
	"title": "Crystals table",
	"tbody": generate_table_body('<td class="plate">[data]</td><td class="drop">[data]</td><td class="x">[data]</td><td class="y">[data]</td><td class="score">[data]</td><td class="crystal-field"><input type="checkbox" class="show-image"><label>show image</label><br><img class="crystal-pic" src="../static/compound_screen/crystal.png" alt="alttext"><br></td><td><button class="remove-button">Remove</button><button class="include-button">Include</button>'),
	"table_caption": "Crystals", 
	})

def batches(request):
	return render(request, "compound_screen/batches.html", {
	"title": "Batches table",
	"tbody": generate_table_body('<td>[data]</td><td>[data]</td><td>[data]</td><td>[data]</td><td><input class="bno" type="number" min="1"><td>[data]</td>'),
	"table_caption": "Batches", 
	})

def soak(request):
	return render(request, "compound_screen/soak.html", {
	"title": "Soak table",
	"tbody": generate_table_body('<td>[data]</td><td class="cs"></td><td>[data]</td><td class="tv"></td><td>[data]</td><td>[data]</td>'),
	"table_caption": "Soaking", 
	})

def cryo(request):
	return render(request, "compound_screen/cryo.html", {
	"title": "Cryo table",
	"tbody": generate_table_body('<td>[data]</td><td>[data]</td><td>[data]</td><td>[data]</td><td>[data]</td>'),
	"table_caption": "Cryo", 
	})

def harvesting(request):
	return render(request, "compound_screen/harvesting.html", {
	"title": "Harvesting table",
	"tbody": generate_table_body(''),
	"table_caption": "Harvesting", 
	})

def collection(request):
	return render(request, "compound_screen/collection.html", {
	"title": "Data collection",
	"tbody": generate_table_body(''),
	"table_caption": "Data collection", 
	})
