from django.urls import path
from . import views

urlpatterns = [
    path('', views.landing_page, name='landing_page'),
    path('sign-up/', views.sign_up_page, name='sign_up_page'),
    path('sign-in/', views.sign_in_page, name='sign_in_page'),
]