from datetime import date
from decimal import Decimal

from django.db.models import Q, Sum, Value, Count
from django.db.models.functions import Coalesce
from django.shortcuts import render
from django.utils import timezone

from ledger.models import Account, Record, RecordType
from utils.decorators import login_required
from utils.helpers import get_global_context


@login_required
def dashboard(request):
    context = {
        "page": "dashboard",
        "title": "Dashboard"
    }
    context = get_global_context(request, context)
    return render(request, "pages/dashboard.html", context)


@login_required
def records(request):
    context = {
        "page": "records",
        "title": "Ledger",
        "subheader": "Records"
    }
    context = get_global_context(request, context)
    return render(request, "pages/records.html", context)


@login_required
def recurring_payments(request):
    context = {
        "page": "records",
        "title": "Recurring Payments"
    }
    context = get_global_context(request, context)
    return render(request, "pages/recurring-payments.html", context)


@login_required
def budgets(request):
    context = {
        "page": "budgets",
        "title": "Budgets"
    }
    context = get_global_context(request, context)
    return render(request, "pages/budgets.html", context)


@login_required
def accounts(request):
    context = {
        "page": "accounts",
        "title": "Accounts"
    }
    context = get_global_context(request, context)
    return render(request, "pages/accounts.html", context)


@login_required
def account_details(request, id):
    account = Account.objects.get(id=id)
    today = timezone.now().date()
    account_records = Record.objects.filter(
        Q(account_from=account) | Q(account_to=account),
        transaction_date__year=today.year,
        transaction_date__month=today.month,
    )

    totals = account_records.aggregate(
        income=Coalesce(
            Sum("amount", filter=Q(type=RecordType.INCOME, account_to=account)),
            Value(Decimal("0")),
        ),
        expense=Coalesce(
            Sum("amount", filter=Q(type=RecordType.EXPENSE, account_from=account)),
            Value(Decimal("0")),
        ),
        transfer_in=Coalesce(
            Sum("amount", filter=Q(type=RecordType.TRANSFER, account_to=account)),
            Value(Decimal("0")),
        ),
        transfer_out=Coalesce(
            Sum("amount", filter=Q(type=RecordType.TRANSFER, account_from=account)),
            Value(Decimal("0")),
        ),
        total_records=Count("id"),
    )
    print(account_records)

    context = {
        "page": "accounts",
        "title": "Accounts",
        "account": account,
        "totals": totals,
        "total_records": account_records.count()
    }
    context = get_global_context(request, context)
    return render(request, "pages/account-details.html", context)


@login_required
def categories(request):
    context = {
        "page": "categories",
        "title": "Categories"
    }
    context = get_global_context(request, context)
    return render(request, "pages/categories.html", context)
