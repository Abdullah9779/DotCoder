from django.urls import path
from . import views

urlpatterns = [
    path('', views.landing_page, name='landing_page'),
    path('sign-up/', views.sign_up_page, name='sign_up_page'),
    path('sign-in/', views.sign_in_page, name='sign_in_page'),
    path('reset-password/', views.reset_password_page, name='reset_password_page'),
    path('request-email-verification/', views.get_email_verification_link_page, name='get_email_verification_link_page'),
]