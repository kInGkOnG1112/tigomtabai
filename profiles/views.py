from django.shortcuts import render

from utils.helpers import get_global_context


def dashboard(request):
    context = {
        'page': 'dashboard'
    }
    context = get_global_context(request, context)
    return render(request, 'pages/dashboard.html', context)


def entries(request):
    context = {
        'page': 'records'
    }
    context = get_global_context(request, context)
    return render(request, 'pages/dashboard.html', context)


def recurring_payments(request):
    context = {
        'page': 'records'
    }
    context = get_global_context(request, context)
    return render(request, 'pages/dashboard.html', context)
