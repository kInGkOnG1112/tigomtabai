from django.shortcuts import render

from utils.decorators import login_required
from utils.helpers import get_global_context


@login_required
def dashboard(request):
    context = {
        'page': 'dashboard',
        'title': 'Dashboard'
    }
    context = get_global_context(request, context)
    return render(request, 'pages/dashboard.html', context)


@login_required
def entries(request):
    context = {
        'page': 'records',
        'title': 'Entries'
    }
    context = get_global_context(request, context)
    return render(request, 'pages/entries.html', context)


@login_required
def recurring_payments(request):
    context = {
        'page': 'records',
        'title': 'Recurring Payments'
    }
    context = get_global_context(request, context)
    return render(request, 'pages/recurring-payments.html', context)


@login_required
def budgets(request):
    context = {
        'page': 'budgets',
        'title': 'Budgets'
    }
    context = get_global_context(request, context)
    return render(request, 'pages/budgets.html', context)


@login_required
def accounts(request):
    context = {
        'page': 'accounts',
        'title': 'Accounts'
    }
    context = get_global_context(request, context)
    return render(request, 'pages/accounts.html', context)


@login_required
def categories(request):
    context = {
        'page': 'categories',
        'title': 'Categories'
    }
    context = get_global_context(request, context)
    return render(request, 'pages/categories.html', context)
