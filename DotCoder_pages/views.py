from django.shortcuts import render

# Create your views here.

def landing_page(request):
    return render(request, 'landing_page.html')

def sign_up_page(request):
    return render(request, 'sign_up_page.html')

def sign_in_page(request):
    return render(request, 'sign_in_page.html')

def reset_password_page(request):
    return render(request, 'reset_password_page.html')

def get_email_verification_link_page(request):
    return render(request, 'request_email_verification_page.html')

def terms_and_conditions_page(request):
    return render(request, 'terms_and_conditions_page.html')


