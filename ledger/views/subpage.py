from datetime import datetime

from django.db.models import Q
from django.shortcuts import render
from django.views.decorators.http import require_GET

from ledger.forms import RecordForms
from utils.decorators import login_required
from utils.helpers import search_result, paginate_key_set
from ledger.models import Category, Account, Record, Budget


@login_required
@require_GET
def category_list(request):
    data = request.GET
    template = data.get("template") if data.get("template") else "card-symbol-2.html"

    queryset = Category.objects.filter(
        Q(is_default=True) | Q(added_by=request.user)
    ).order_by("name")

    usage = data.get("usage", "")
    if usage and usage == "budget":
        now = datetime.now()
        budget_ids = Budget.objects.filter(
            owner=request.user,
            month=now.month,
            year=now.year
        ).values_list("category_id", flat=True)

        queryset = queryset.exclude(id__in=budget_ids)

    type = data.get("type", "")
    if type:
        queryset = queryset.filter(type=type.upper())

    search = data.get("search", "").strip()
    if search != "":
        orm_lookups = ["name__icontains"]
        queryset = search_result(queryset, search, orm_lookups)

    context = {
        "data_list": queryset,
        "payload_data": data.dict(),
        "col_class": "col-lg-4"
    }
    return render(request, template_name=f"components/cards/{template}", context=context)


@login_required
@require_GET
def account_list(request):
    data = request.GET

    queryset = Account.objects.filter(owner=request.user).prefetch_related("institution").order_by("name")

    search = data.get("search", "").strip()
    if search != "":
        orm_lookups = ["name__icontains"]
        queryset = search_result(queryset, search, orm_lookups)

    context = {
        "data_list": queryset,
        "payload_data": data.dict(),
        "col_class": "col-lg-3"
    }
    return render(request, template_name="components/cards/card-symbol-1.html", context=context)


@login_required
@require_GET
def record_list(request):
    response = RecordForms(request).list_data()
    payload_data = request.GET.dict()
    account_id = payload_data.get("account_id", "")

    template = "table-2.html" if account_id else "table-1.html"

    context = {
        "data_list": response["results"],
        "pagination": response["pagination"],
        "payload_data": request.GET.dict(),
        "account_id": int(account_id) if account_id else None
    }
    return render(request, template_name=f"components/tables/{template}", context=context)


@login_required
@require_GET
def budget_list(request):
    data = request.GET
    now = datetime.now()
    template = data.get("template", "card-symbol-3.html")

    queryset = Budget.objects.filter(owner=request.user)

    month = data.get("month", now.month)
    year = data.get("year", now.year)

    if month:
        queryset = queryset.filter(month=int(month))

    if year:
        queryset = queryset.filter(year=int(year))

    search = data.get("search", "").strip()
    if search != "":
        orm_lookups = ["category__name__icontains"]
        queryset = search_result(queryset, search, orm_lookups)

    pagination = {}
    paginated = data.get("paginated")
    if paginated:
        cursor = data.get("cursor")
        direction = data.get("direction", "next")
        page_size = int(data.get("page_size", 10))
        pagination_data = paginate_key_set(
            queryset=queryset,
            cursor=cursor,
            direction=direction,
            page_size=page_size,
        )
        queryset = pagination_data["results"]
        pagination = pagination_data["pagination"]

    context = {
        "data_list": queryset,
        "pagination": pagination,
        "payload_data": data.dict(),
    }
    return render(request, template_name=f"components/cards/{template}", context=context)
