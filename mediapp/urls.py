from django.urls import path,include
from . import views

urlpatterns = [
    path('',views.login, name='login'),
    path("signup/", views.signup, name="signup"),
    path("api/get-profile/", views.get_profile, name="get_profile"),
    path('home_page/',views.home_page, name='index'),
    path('api/activities/', views.get_health_activities, name='health_activities'),
    #path('mediapp/', include('mediapp.urls')),
    path('api/add-member/', views.add_family_member, name='add_member'),
    path('api/doctors/', views.get_doctors, name='get_doctors'),
    path('api/send-consultation/', views.send_consultation_message, name='send_consultation'),
    

]