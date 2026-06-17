from django.urls import path
from . import views

urlpatterns = [
    # Contact API
    path('contacts/', views.contact_list_api, name='contact_list_api'),

    # Tollplaza API
    path('tollplazas/', views.tollplaza_list_api, name='tollplaza_list_api'),
    path("tollplazas/<int:pk>/", views.tollplaza_detail_api),
    #contractor API
    path('contractors/', views.contractor_list_api, name='contractor_list_api'),
    path("contractors/<int:pk>/", views.contractor_detail_api),
    path('projects/', views.project_list_api, name='project_list_api'),
    # Parking
    path('parkings/', views.parking_list_api, name='parking_list_api'),
    path("parkings/<int:pk>/", views.parking_detail_api),
    # Office
    path('offices/', views.office_list_api, name='office_list_api'),
    path("offices/<int:pk>/", views.office_detail_api),
    # Global Search
    path('search/', views.global_search, name='global_search'),
    
]
