from django.contrib import admin

# Register your models here.

from .models import Library, Compound, SourceWell, LibraryPlate, Protein, Proposal, LibrarySubset, Preset, SoakDBCompound, Crystal, CrystalPlate



class SourceWellAdmin(admin.ModelAdmin):
    list_display = ("library_plate", "well", "compound", "concentration")

class LibraryPlateAdmin(admin.ModelAdmin):
    list_display = ("id", "library", "name", "last_tested", "current")

class LibraryAdmin(admin.ModelAdmin):
    list_display = ("id", "name", "public", "for_industry")
    
class CompoundAdmin(admin.ModelAdmin):
	 list_display = ("code", "smiles")
	 list_per_page = 800

class ProposalAdmin(admin.ModelAdmin):
    list_display = ("name", "protein", "industry_user")

class CrystalPlateAdmin(admin.ModelAdmin):
    list_display = ("id", "name", "drop_volume", "plate_type")
	 
admin.site.register(Compound, CompoundAdmin)    
admin.site.register(SourceWell, SourceWellAdmin)
admin.site.register(LibraryPlate, LibraryPlateAdmin)
admin.site.register(Library, LibraryAdmin)
admin.site.register(Proposal,ProposalAdmin)
admin.site.register(Protein)
admin.site.register(LibrarySubset)
admin.site.register(Preset)
admin.site.register(SoakDBCompound)
admin.site.register(Crystal)
admin.site.register(CrystalPlate, CrystalPlateAdmin)
