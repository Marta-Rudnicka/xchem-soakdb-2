from django.urls import path
from . import views


urlpatterns = [
	path("", views.index, name="index"),
	path("dummy", views.dummy, name="dummy"),
	path("protein", views.protein, name="protein"),
	path("testing", views.testing, name="testing"),
	path("picker", views.picker, name="picker"),
	#path("<str:library>/<str:plate>", views.lib, name="lib"),
	path("<str:library>/<str:plate>", views.Lib.as_view(), name="lib"),
	path("proposal", views.proposal, name="proposal"),
	path("summary", views.summary, name="summary"),
	path("complete_data", views.all, name="all"),
	path("add_library", views.add_library, name="add_library"),
	path("upload_user_library", views.upload_user_library, name="upload_user_library"),
	path("upload_subset", views.upload_subset, name="upload_subset"),
	path("remove_plate", views.remove_plate, name="remove_plate"),
	path("all", views.all, name="all"),
	path("sources", views.sources, name="sources"),
	path("import_compounds", views.import_compounds, name="import_compounds"),
	path("library_list", views.LibraryList.as_view(), name="library_list"),
	path("in_house_library_list", views.InHouseLibraryList.as_view(), name="in_house_library_list"),
	path("library_selection_list", views.CurrentPlateList.as_view(), name="library_selection_list"),
	path("preset_list", views.PresetList.as_view(), name="preset_list"),
	path("crystals_list", views.CrystalsInPlates.as_view(), name="crystals_list"),
	path("api/<str:library>/<str:plate>", views.PlateCompoundList.as_view(), name="api_lib"),
]
