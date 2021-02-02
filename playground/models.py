from django.db import models
from rdkit import Chem
from rdkit.Chem import Descriptors


def mol_wt(smiles):
	return Descriptors.ExactMolWt(Chem.MolFromSmiles(smiles))


# Create your models here.

class Protein(models.Model):
	name = models.CharField(max_length=100,  null=True, blank=True)
	space_group = models.CharField(max_length=100, null=True, blank=True)
	a = models.DecimalField(decimal_places=2, max_digits=10, null=True, blank=True)
	b = models.DecimalField(decimal_places=2, max_digits=10, null=True, blank=True)
	c = models.DecimalField(decimal_places=2, max_digits=10, null=True, blank=True)
	alpha = models.DecimalField(decimal_places=2, max_digits=10, null=True, blank=True)
	beta = models.DecimalField(decimal_places=2, max_digits=10, null=True, blank=True)
	gamma = models.DecimalField(decimal_places=2, max_digits=10, null=True, blank=True)


class Library(models.Model):
	'''Compound library. If proposal=Null, it is an XChem in-house library'''
	name = models.CharField(max_length=100)
	for_industry = models.BooleanField(default=False)
	public = models.BooleanField(default=False)
	
	def __str__ (self):
		return self.name


class LibraryPlate(models.Model):
	'''A library plate. last_tested is either the date of adding the plate
	to the database, or the last dispense test performed on it'''
		
	name = models.CharField(max_length=100)
	library = models.ForeignKey(Library, on_delete=models.PROTECT, related_name="plates" )
	current = models.BooleanField(default=True) #a newly uploaded plate usually becomes the default one 
	last_tested =  models.DateField(auto_now=True)
	unique_together = ['name', 'library']

	#plate_type = models.CharField(max_length=32) #probable addition, maybe foreign key

	def __str__ (self):
		return f"[{self.id}]{self.library}, {self.name}"
	
class Compound(models.Model):
    '''Compound belonging to a fragment library. Smiles strings are sometimes missing in proprietary
    libraries'''
    smiles = models.CharField(max_length=255)
    code = models.CharField(max_length=32)
    
    def molecular_weight(self):
        return mol_wt(self.smiles)
    
    def __str__ (self):
        return self.code


class SourceWell(models.Model):
    '''location of a particular compound in a particular library plate; concentration not always available'''
    compound = models.ForeignKey(Compound, on_delete=models.CASCADE, related_name="locations")
    library_plate =  models.ForeignKey(LibraryPlate, on_delete=models.CASCADE, related_name="compounds")
    well  = models.CharField(max_length=4)
    concentration = models.IntegerField(null=True, blank=True)
    def __str__ (self):
        return f"{self.library_plate}: {self.well}"

class LibrarySubset(models.Model):
    '''A selection of compounds from a specific library; always created automatically
    Origin is an automatically generated string to inform how the subset was added to a selection.'''
    name = models.CharField(max_length=100)
    library = models.ForeignKey(Library, on_delete=models.CASCADE)
    compounds = models.ManyToManyField(Compound)
    origin = models.CharField(max_length=64)

class Proposal(models.Model):
    '''modified from: https://github.com/xchem/xchem_db/blob/main/xchem_db/models.py'''
    name = models.CharField(max_length=255, blank=False, null=False, unique=True, db_index=True)
    title = models.CharField(max_length=10, blank=True, null=True)
    fedids = models.TextField(blank=True, null=True)
    #SoakDB-related data
    industry_user = models.BooleanField(default=True) # just in case false by default - fewer privileges
    protein = models.OneToOneField(Protein, blank=True, null=True, on_delete=models.PROTECT)
    libraries = models.ManyToManyField(Library, blank=True)
    subsets = models.ManyToManyField(LibrarySubset, blank=True)
    
    def __str__(self):
         return self.name

class Preset(models.Model):
    name = models.CharField(max_length=64, blank=True, null=True)
    description = models.TextField()
    subsets = models.ManyToManyField(LibrarySubset)
	
class SoakDBCompound(models.Model):
    '''Compound data copied from inventory data when the compound is used
    in the experiment'''
    proposal = models.ForeignKey(Proposal, related_name="exp_compounds", on_delete=models.CASCADE)
    library_name = models.CharField(max_length=100)
    library_plate = models.CharField(max_length=100)
    well = models.CharField(max_length=4)
    code = models.CharField(max_length=100)
    smiles = models.CharField(max_length=256)
#    concentration = IntegerField(max_length=256) #not sure if needed

class CrystalPlate(models.Model):
    name = models.CharField(max_length=100)
    drop_volume = models.FloatField()
    plate_type = models.CharField(max_length=100) # may be changed to foreign key
    

class Crystal(models.Model):
    crystal_name = models.CharField(max_length=255, blank=False, null=False, db_index=True)
#    target = models.ForeignKey(Target, on_delete=models.CASCADE)
    compound = models.ForeignKey(Compound, on_delete=models.CASCADE, null=True, blank=True)
#    visit = models.ForeignKey(SoakdbFiles, on_delete=models.CASCADE)
    product = models.CharField(max_length=255, blank=True, null=True)

    # model types
    PREPROCESSING = 'PP'
    PANDDA = 'PD'
    PROASIS = 'PR'
    REFINEMENT = 'RE'
    COMPCHEM = 'CC'
    DEPOSITION = 'DP'

    CHOICES = (
        (PREPROCESSING, 'preprocessing'),
        (PANDDA, 'pandda'),
        (REFINEMENT, 'refinement'),
        (COMPCHEM, 'comp_chem'),
        (DEPOSITION, 'deposition')
    )

    status = models.CharField(choices=CHOICES, max_length=2, default=PREPROCESSING)

    #added attributes
    crystal_plate = models.ForeignKey(CrystalPlate, blank=True, null=True, on_delete=models.PROTECT, related_name="crystals") #need to do something about nullability
    well = models.CharField(max_length=4,  blank=True, null=True)
    echo_x = models.IntegerField(blank=True, null=True,) #double-check if it shouldn't be float
    echo_y = models.IntegerField(blank=True, null=True,) #double-check if it shouldn't be float
    score = models.IntegerField(blank=True, null=True,)
#    image -- need to figure out how this will be stored
    
#    class Meta:
#        if os.getcwd() != '/dls/science/groups/i04-1/software/luigi_pipeline/pipelineDEV':
#            app_label = 'xchem_db'
#        db_table = 'crystal'
#        unique_together = ('crystal_name', 'visit', 'compound', 'product')
    
class Batch(models.Model):
    '''A group of crystals that go through soaking and cryo together; most attributed moved from Lab class'''
    number = models.IntegerField(default=0)
    crystal_plate = models.ForeignKey(CrystalPlate, blank=True, null=True, on_delete=models.CASCADE)
    #soaking attributes
    soak_status = models.CharField(max_length=64, blank=True, null=True)
    soak_time = models.IntegerField(blank=True, null=True)
    solv_frac = models.FloatField(blank=True, null=True)
    stock_conc = models.FloatField(blank=True, null=True)
    #cryo attributes:
    cryo_frac = models.FloatField(blank=True, null=True)
    cryo_status = models.CharField(max_length=64, blank=True, null=True)
    cryo_stock_frac = models.FloatField(blank=True, null=True)
    cryo_location = models.CharField(max_length=4, blank=True, null=True)
    
    def batch_name(self):
        return 'Batch-' + self.number + '_' + self.crystal_plate.name #needs verification

    #based on macros in the original SoakDB file; consulted with Ailsa
    def soak_vol(self): #supposing it means soak transfer volume -- needs verification
        min_vol_unit = 2.5
        volume = (self.crystal_plate.drop_volume * self.solv_frac) / (100 - self.solv_frac)
        return round(volume /min_vol_unit , 0) * min_vol_unit
		
    def compound_conc(self):
        concentration = (self.stock_conc * self.soak_vol())/(self.crystal_plate.drop_vol + self.soak_vol)
        return round(concentration, 1)
        
    def cryo_transfer_vol(self):
        min_vol_unit = 2.5
        volume = (self.cryo_frac * self.crystal_plate.drop_volume)/(self.stock_frac - self.cryo_frac)
        return round(volume /min_vol_unit, 0) * min_vol_unit


class Lab(models.Model):
    crystal_name = models.OneToOneField(Crystal, blank=True, null=True, on_delete=models.CASCADE, unique=True)  # changed to foreign key; added blank and null fields to suppress errors; needs more consideration
    data_collection_visit = models.TextField(blank=True, null=True)
    expr_conc = models.FloatField(blank=True, null=True) #WHAT IS THIS???
    harvest_status = models.TextField(blank=True, null=True)
    mounting_result = models.TextField(blank=True, null=True)
    mounting_time = models.TextField(blank=True, null=True)
    visit = models.TextField(blank=True, null=True)
    #new attributes
    batch = models.ForeignKey(Batch, blank=True, null=True, on_delete=models.PROTECT)
    compound = models.ForeignKey(SoakDBCompound, blank=True, null=True, on_delete=models.PROTECT)
    puck = models.CharField(max_length=100, blank=True, null=True)
    position = models.CharField(max_length=100, blank=True, null=True)
    pin_barcode = models.CharField(max_length=100, blank=True, null=True)
    arrival_time = models.DateTimeField(blank=True, null=True)
    mounted_timestamp = models.DateTimeField(blank=True, null=True)
    ispyb_status = models.CharField(max_length=100, blank=True, null=True)
    
    
    
#    class Meta:
#        if os.getcwd() != '/dls/science/groups/i04-1/software/luigi_pipeline/pipelineDEV':
#            app_label = 'xchem_db'
#        db_table = 'lab'
