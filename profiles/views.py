from django.shortcuts import render

from utils.helpers import get_global_context


def dashboard(request):
    context = {
        'page': 'dashboard',
        'title': 'Dashboard'
    }
    context = get_global_context(request, context)
    return render(request, 'pages/dashboard.html', context)


def entries(request):
    context = {
        'page': 'records',
        'title': 'Entries'
    }
    context = get_global_context(request, context)
    return render(request, 'pages/entries.html', context)


def recurring_payments(request):
    context = {
        'page': 'records',
        'title': 'Recurring Payments'
    }
    context = get_global_context(request, context)
    return render(request, 'pages/recurring-payments.html', context)


def budgets(request):
    context = {
        'page': 'budgets',
        'title': 'Budgets'
    }
    context = get_global_context(request, context)
    return render(request, 'pages/budgets.html', context)


def accounts(request):
    context = {
        'page': 'accounts',
        'title': 'Accounts'
    }
    context = get_global_context(request, context)
    return render(request, 'pages/accounts.html', context)


def categories(request):
    context = {
        'page': 'categories',
        'title': 'Categories'
    }
    context = get_global_context(request, context)
    return render(request, 'pages/categories.html', context)
