from django.shortcuts import render
from ledger.models import Account, Category, CategoryType, Record
from main.models import Icons, IconType, Institution
from utils.decorators import login_required


@login_required
def add_category(request):
    icons = Icons.objects.filter(
        is_active=True,
        type=IconType.CATEGORIES)

    context = {
        "icons": icons
    }
    return render(request, template_name="screens/modals/add-category.html", context=context)


@login_required
def update_category(request, id):
    category = Category.objects.get(id=id)
    icons = Icons.objects.filter(
        is_active=True,
        type=IconType.CATEGORIES)

    context = {
        "icons": icons,
        "category": category
    }
    return render(request, template_name="screens/modals/update-category.html", context=context)


@login_required
def add_account(request):
    institutions = Institution.objects.filter(is_active=True).order_by('type')
    context = {
        "institutions": institutions
    }
    return render(request, template_name="screens/modals/add-account.html", context=context)


@login_required
def add_record(request):
    accounts = Account.objects.filter(
        owner=request.user,
        is_archived=False
    ).select_related("institution")

    categories = Category.objects.filter(
        is_active=True
    ).select_related("icon").order_by("name")

    context = {
        "income_category": [c for c in categories if c.type == CategoryType.INCOME],
        "expense_category": [c for c in categories if c.type == CategoryType.EXPENSE],
        "accounts": accounts
    }
    return render(request, template_name="screens/modals/add-record.html", context=context)


@login_required
def update_record(request, id):
    record = Record.objects.get(id=id)

    accounts = Account.objects.filter(
        owner=request.user,
        is_archived=False
    ).select_related("icon")

    categories = Category.objects.filter(
        is_active=True
    ).select_related("icon").order_by("name")

    context = {
        "categories": [c for c in categories if c.type == record.type],
        "accounts": accounts,
        "record": record
    }
    return render(request, template_name="screens/modals/update-record.html", context=context)
