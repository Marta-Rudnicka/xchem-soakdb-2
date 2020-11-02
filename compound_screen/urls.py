from django.urls import path
from . import views


urlpatterns = [
	#path("", views.index, name="index"),
	path("source", views.source, name="source"),
	path("crystals", views.crystals, name="crystals"),
	path("batches", views.batches, name="batches"),
	path("soak", views.soak, name="soak"),
	path("batch_details", views.batch_details, name="batch_details"),
	path("cryo", views.cryo, name="cryo"),
	path("harvesting", views.harvesting, name="harvesting"),
	path("collection", views.collection, name="collection"),	
]
