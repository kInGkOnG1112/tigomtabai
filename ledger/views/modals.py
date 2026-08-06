from datetime import datetime, timedelta

from django.shortcuts import render
from ledger.models import Account, Category, CategoryType, Record, Budget
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
def add_budget(request, category_id):
    category = Category.objects.get(id=category_id)
    context = {"category": category}
    return render(request, template_name="screens/modals/add-budget.html", context=context)


@login_required
def update_budget(request, budget_id):
    budget = Budget.objects.get(id=budget_id)
    context = {"budget": budget}
    return render(request, template_name="screens/modals/update-budget.html", context=context)


@login_required
def copy_budget(request):
    current_date = datetime.now().replace(day=1)
    previous_months = []
    for _ in range(25):
        current_date = current_date - timedelta(days=1)
        previous_months.append({
            "value": current_date.strftime("%B %Y"),
            "month": current_date.month,
            "year": current_date.year
        })
        current_date = current_date.replace(day=1)

    context = {
        "last_month": previous_months[0],
        "previous_months": previous_months[::-1]
    }
    return render(request, template_name="screens/modals/copy-budget.html", context=context)


@login_required
def add_record(request):
    data = request.GET
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
        "accounts": accounts,
        "account_id": int(data.get("account")) if data.get("account") else None,
    }
    return render(request, template_name="screens/modals/add-record.html", context=context)


@login_required
def update_record(request, id):
    record = Record.objects.get(id=id)

    accounts = Account.objects.filter(
        owner=request.user
    ).select_related("institution")

    categories = Category.objects.filter(
        is_active=True
    ).select_related("icon").order_by("name")

    context = {
        "categories": [c for c in categories if c.type == record.type],
        "accounts": accounts,
        "record": record
    }
    return render(request, template_name="screens/modals/update-record.html", context=context)
