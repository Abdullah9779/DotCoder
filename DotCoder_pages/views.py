from django.shortcuts import render

# Create your views here.

def landing_page(request):
    return render(request, 'landing_page.html')

def sign_up_page(request):
    return render(request, 'sign_up_page.html')

def sign_in_page(request):
    return render(request, 'sign_in_page.html')
