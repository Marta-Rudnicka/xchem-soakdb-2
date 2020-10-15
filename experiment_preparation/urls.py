from django.urls import path
from . import views


urlpatterns = [
	path("", views.index, name="index"),
	path("compound_selection", views.cherrypicking, name="cherrypicking"),
	path("compound_check", views.c_check, name="c_check"),
	
	#path("lib_explorer", views.lib_explorer, name="lib_explorer"),
	#path("screen_selection", views.screen_selection, name="screen_selection"),
	
]
