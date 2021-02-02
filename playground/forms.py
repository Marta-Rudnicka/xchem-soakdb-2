from django import forms
from .models import Library, Proposal
from .helpers import create_lib_selection
from django.forms import formset_factory
	
libs = create_lib_selection()
#proposals = []
#for proposal in Proposal.objects.all():
#	proposals.append([proposal.id, proposal.name])

proposals = list([item.id, item.name] for item in Proposal.objects.all())
libraries = list([item.id, item.name] for item in Library.objects.filter(public=True))


class DateInput(forms.DateInput):
	input_type= 'date'

class ProteinForm(forms.Form):
	name = forms.CharField(label='Protein name')
	space_group = forms.CharField(label='Space group')
	a = forms.DecimalField(label='A')
	b = forms.DecimalField(label='B')
	c = forms.DecimalField(label='C')
	alpha = forms.DecimalField(label='α')
	beta = forms.DecimalField(label='β')
	gamma = forms.DecimalField(label='γ')
	
	#find out possible values for validation
	
class LibraryPlateForm(forms.Form): 
	library = forms.ChoiceField(choices=libs)
	name = forms.CharField(label='Plate name')
	current = forms.BooleanField(label='Set to current plate', required=False )
	data_file = forms.FileField(label='Upload compound data:')

class LibrarySelectionForm(forms.Form):
	library = forms.BooleanField(label='Set to current plate', required=False )


class ExternalLibraryForm(forms.Form):
	name = forms.CharField(label='Library name')
	data_file = forms.FileField(label='Upload compound data:')
	

class SubsetForm(forms.Form):
	lib_id = forms.ChoiceField(label='Select library', choices=libraries)
	data_file = forms.FileField(label='Upload your selection:')
	

	
class ChooseProposalForm(forms.Form):
	selection_id = forms.ChoiceField(label='Select proposal', choices=proposals)
	

class CrystalPlateForm(forms.Form): #name, drop volume, plate-type
	pass

class SoakForm(forms.Form):
	pass

class CryoForm(forms.Form):
	pass
