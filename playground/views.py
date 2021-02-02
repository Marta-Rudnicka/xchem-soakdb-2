from django.shortcuts import render, get_object_or_404
from .models import Library, LibraryPlate, Compound, SourceWell, Protein, Proposal, Preset, CrystalPlate
from .helpers import upload_plate, get_selection_details, copy_compounds_to_experiment, create_subset
from .forms import ProteinForm, LibraryPlateForm, ChooseProposalForm, ExternalLibraryForm, SubsetForm
from django.http import HttpResponseRedirect
from datetime import date
from decimal import Decimal
from rest_framework.renderers import TemplateHTMLRenderer
from rest_framework.response import Response
from rest_framework.views import APIView
from django.views.generic import ListView
from rest_framework import generics
from rest_framework.permissions import AllowAny
from .serializers import LibrarySerializer, SourceWellSerializer, CurrentPlateSerializer, PresetSerializer, CrystalPlateSerializer
#from rest_framework.generics import ListAPIView

#import django.db
#from django.conf import settings
from django.core.files.storage import FileSystemStorage


def get_plate_dict():
	lib_dictionary={}
	current_plates = LibraryPlate.objects.filter(current=True)
	for plate in current_plates:
		if plate.library.public:
			lib_dictionary[plate.library] = plate
	
	print('lib_dictionary: ', lib_dictionary)
	return lib_dictionary


def select_libraries_by_id(id_list, proposal):
	for id_ in id_list:
		plate = Library.objects.get(id = int(id_))
		proposal.libraries.add(plate)

libs = Library.objects.all()
dictionary = get_plate_dict()


def remove_plate(request):
	proposal_name = request.session['proposal']
	proposal = Proposal.objects.get(name=proposal_name)
	if request.method == "POST":
		_id = request.POST['plate']
		plate = LibraryPlate.objects.get(id=_id)
		selection = CompoundSelection.objects.get(proposal=proposal)
		print('remove plate: ', plate, ' from ', selection)
		selection.plates.remove(plate)
	
	return HttpResponseRedirect('summary')
	

def index(request):
	proposal_name = request.session['proposal']
	proposal = Proposal.objects.get(name=proposal_name)
	return render(request, "playground/index.html", {
	"proposal": proposal,
	})

def all(request):
	proposal_name = request.session['proposal']
	proposal = Proposal.objects.get(name=proposal_name)
	return render(request, "playground/all.html", {
	"proposal": proposal,
	})

def sources(request):
	proposal_name = request.session['proposal']
	proposal = Proposal.objects.get(name=proposal_name)
	if request.method=="POST":
		
		form = ChooseProposalForm(request.POST)
	
	else:
		form = ChooseProposalForm()
		
	return render(request, "playground/sources.html", {
	"proposal": proposal,
	"form": form,
	})

def protein(request):
	form = ProteinForm(request.POST)
	proposal_name = request.session['proposal']
	proposal = Proposal.objects.get(name=proposal_name)
	try:
		protein = Protein.objects.get(proposal=proposal)
	except:
		protein = Protein.objects.create(proposal=proposal) 
	
	if request.method == "POST":
		if form.is_valid():
			protein.name = form.cleaned_data['name']
			protein.space_group = form.cleaned_data['space_group']
			protein.a = Decimal(form.cleaned_data['a'])
			protein.b = Decimal(form.cleaned_data['b'])
			protein.c = Decimal(form.cleaned_data['c'])
			protein.alpha = Decimal(form.cleaned_data['alpha'])
			protein.beta = Decimal(form.cleaned_data['beta'])
			protein.gamma = Decimal(form.cleaned_data['gamma'])
			protein.save()
		return HttpResponseRedirect('summary')
			
def dummy(request):
	return render(request, "playground/dummy.html")

def summary(request):
	proposal_name = request.session['proposal']
	proposal = Proposal.objects.get(name=proposal_name)

	try:
		protein = Protein.objects.get(proposal=proposal)
		protein_form = ProteinForm(initial={'name': protein.name, 'space_group': protein.space_group, 
			'a': protein.a, 'b': protein.b, 'c': protein.c, 'alpha': protein.alpha, 'beta': protein.beta, 
			'gamma': protein.gamma})		
	except:
		protein = None
		protein_form = ProteinForm()
	
	libraries =  get_selection_details(proposal)
	
	return render(request, "playground/summary.html", {
		"proposal": proposal,
		"libraries": libraries,
		"protein": protein,
		"protein_form": protein_form,
	})
	
def import_compounds(request):
	pass


def testing(request):
	from datetime import date
	today = str(date.today())
	
	if request.method == "POST":
		form = LibraryPlateForm(request.POST, request.FILES)
		if form.is_valid():
			#create a new library plate
			library = Library.objects.get(id = form.cleaned_data['library'])
			plate_name = form.cleaned_data['name']
			current = form.cleaned_data['current']
			newplate = LibraryPlate.objects.create(library = library, name = plate_name, current = current, last_tested=today)
			
			#create SourceWell objects for the new library plate
			source = request.FILES["data_file"]
			fs = FileSystemStorage()
			filename = fs.save(source.name, source)
			upload_plate(filename, newplate)
			fs.delete(filename)
			
			return HttpResponseRedirect('testing')
	else:
		form = LibraryPlateForm()
		
				
	return render(request, "playground/page.html", {
		"title": "Testing page",
		"form": form,
		})



def lib(request, library, plate):
	
	library = Library.objects.get(name=library)
	plate = LibraryPlate.objects.get(name=plate, library=library)
	db_list = plate.compounds.all()
	all_plates_in_lib = LibraryPlate.objects.filter(library=library.id)
	return render(request, "playground/test_library.html", {
		"title": library.name,
		"library": library,
		"plate": plate,
		"list": db_list,
		"all_plates_in_lib" : all_plates_in_lib, 
	})


class Lib(APIView):
	renderer_classes = [TemplateHTMLRenderer]
	template_name = 'playground/test_library.html'
	
	def get_queryset(self):
		self.library = get_object_or_404(Library, name=self.kwargs['library'])
		#self.plate = get_object_or_404(LibraryPlate, name=self.kwargs['plate'])
		self.plate = get_object_or_404(LibraryPlate, name=self.kwargs['plate'], library__name=self.kwargs['library'])
		
		return self.plate.compounds.all()

	
	def get(self, request, *args, **kwargs):
		context = {'list' : self.get_queryset(),
			'title': self.library.name,
			'library': self.library,
			'plate': self.plate,
			'all_plates_in_lib': LibraryPlate.objects.filter(library=self.library.id)
		}
		 
		return Response(context)

def all(request):
	proposal_name = request.session['proposal']
	proposal = Proposal.objects.get(name=proposal_name)
	return render(request, "playground/all.html", {"proposal": proposal})


def picker(request):
	proposal_name = request.session['proposal']
	proposal = Proposal.objects.get(name=proposal_name)
	lib_form = ExternalLibraryForm()
	subset_form = SubsetForm()

	return render(request, "playground/picker.html", {
		"title": "Select compounds",
		"libraries": dictionary,
		"proposal": proposal,
		"lib_form": lib_form,
		"subset_form": subset_form,
	})
	
def add_library(request):
	proposal_name = request.session['proposal']
	proposal = Proposal.objects.get(name=proposal_name)

	if request.method == "POST":
		lib_form = ExternalLibraryForm(request.POST)
		libs = request.POST.getlist('lib_ids')
		if libs:
			select_libraries_by_id(libs, proposal)
		
		return HttpResponseRedirect('picker')
	
def upload_user_library(request):
	form = ExternalLibraryForm(request.POST, request.FILES)
	proposal_name = request.session['proposal']
	proposal = Proposal.objects.get(name=proposal_name)
	today = str(date.today())
	if request.method == "POST":
		if form.is_valid():
			#create new Library and LibraryPlate ojects
			name = form.cleaned_data['name']
			plate_name = name + '_for_' + proposal_name
			user_lib = Library.objects.create(name=plate_name, public=False, for_industry=True)
			user_plate = LibraryPlate.objects.create(library = user_lib, name = plate_name, current = True, last_tested=today)
			#upload the compound data for the new library plate
			source = request.FILES["data_file"]
			fs = FileSystemStorage()
			filename = fs.save(source.name, source)
			upload_plate(filename, user_plate)
			fs.delete(filename)
			#add new library to user's proposal
			proposal.libraries.add(user_lib)
			proposal.save()
			
			return HttpResponseRedirect('picker')

def upload_subset(request):
	
	form = SubsetForm(request.POST, request.FILES)
	proposal_name = request.session['proposal']
	proposal = Proposal.objects.get(name=proposal_name)
	today = str(date.today())
	if request.method == "POST":
		if form.is_valid():
			lib_id = int(form.cleaned_data['lib_id'])
			lib = Library.objects.get(id=lib_id)
			name = 'selection_from_' + lib.name
			origin = "User-submitted selection for proposal: " + proposal_name
			print('Name: ', name, ', library: ', lib, ", origin: ", origin)
			#upload the compound data for the new library plate
			source = request.FILES["data_file"]
			fs = FileSystemStorage()
			filename = fs.save(source.name, source)
			new_subset = create_subset(filename, lib, name, origin)
			fs.delete(filename)
			#add new subset to user's proposal
			proposal.subsets.add(new_subset)
			proposal.save()
			
			return HttpResponseRedirect('picker')


def proposal(request):
	form = ChooseProposalForm(request.POST)
	
	if request.method == "POST":
		if form.is_valid():
			selection_id = int(form.cleaned_data['selection_id'])
			proposal = Proposal.objects.get(id=selection_id).name
			print('selection_id: ', selection_id)
			request.session['selection_id'] = selection_id
			request.session['proposal'] = proposal
			print('request.session: ', request.session)
			
			return HttpResponseRedirect("/playground/")
			
	
	return render(request, "playground/proposal.html", {"form": form })

def import_compounds(request):
	print('POST')
	form = ChooseProposalForm(request.POST)
	if form.is_valid():
		
		proposal_name = form.cleaned_data['proposal']
		proposal = Proposal.objects.get(name=proposal_name)
		import_compounds(proposal)
	return HttpResponseRedirect('sources')

#API endpoints

class LibraryList(generics.ListAPIView):
	queryset = Library.objects.all()
	serializer_class = LibrarySerializer
	permission_classes = [AllowAny]

class InHouseLibraryList(generics.ListAPIView):
	queryset = Library.objects.filter(public=True)
	serializer_class = LibrarySerializer
	permission_classes = [AllowAny]

class PlateCompoundList(generics.ListAPIView):
	
	def get_queryset(self):
		self.library = get_object_or_404(Library, name=self.kwargs['library'])
		self.plate = get_object_or_404(LibraryPlate, name=self.kwargs['plate'], library__name=self.kwargs['library'])
		return self.plate.compounds.all()
	
	serializer_class = SourceWellSerializer
	permission_classes = [AllowAny]

class CurrentPlateList(generics.ListAPIView):
	def get_queryset(self):
		libs = Library.objects.filter(public=True)
		plates = []
		for lib in libs:
			c = lib.plates.filter(current=True)
			try:
				plates.append(c[0])
			except IndexError:
				print('No current plate for ', lib)
		return plates
	serializer_class = CurrentPlateSerializer
	permission_classes = [AllowAny]

class PresetList(generics.ListAPIView):
	queryset = Preset.objects.all()
	serializer_class = PresetSerializer
	permission_classes = [AllowAny]

class CrystalsInPlates(generics.ListAPIView):
	queryset = CrystalPlate.objects.all()
	serializer_class = CrystalPlateSerializer
	permission_classes = [AllowAny]

