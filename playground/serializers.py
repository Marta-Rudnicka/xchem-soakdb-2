from rest_framework import serializers
from playground.models import Library, LibraryPlate, Compound, SourceWell, Protein, Preset, CrystalPlate

class LibrarySerializer(serializers.ModelSerializer):
	class Meta:
		model = Library
		fields = ['id', 'name', 'for_industry', 'public']

class LibraryPlateSerializer(serializers.ModelSerializer):
	class Meta:
		model = LibraryPlate
		fields = ['library', 'name', 'current', 'compounds']

class CurrentPlateSerializer(serializers.ModelSerializer):
	class Meta:
		model = LibraryPlate
		fields = ['library', 'name']
		depth = 1

class CompoundSerializer(serializers.ModelSerializer):
	class Meta:
		model = Compound
		fields = ['code', 'smiles', 'molecular_weight']
'''
class SourceWellSerializer(serializers.ModelSerializer):
	class Meta:
		model = SourceWell
		fields = ['library_plate', 'well', 'compound', 'concentration']
		depth = 1
'''
class SourceWellSerializer(serializers.Serializer):
	well = serializers.CharField(max_length=4)
	compound = CompoundSerializer()
	concentration = serializers.IntegerField()
		
		
class ProteinSerializer(serializers.ModelSerializer):
	class Meta:
		model = Protein
		fields = ['id', 'proposal', 'name', 'space_group', 'a', 'b', 'c', 'alpha', 'beta', 'gamma']

 
class PresetSerializer(serializers.ModelSerializer):
	class Meta:
		model = Preset
		fields = ['name', 'description', 'subsets']
		depth=2

class CrystalPlateSerializer(serializers.ModelSerializer):
	class Meta:
		model = CrystalPlate
		fields = ['name', 'drop_volume', 'plate_type', 'crystals']
		depth=2
