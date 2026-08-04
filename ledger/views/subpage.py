from django.db.models import Q
from django.shortcuts import render
from django.views.decorators.http import require_GET

from ledger.forms import RecordForms
from utils.decorators import login_required
from utils.helpers import search_result
from ledger.models import Category, Account, Record


@login_required
@require_GET
def category_list(request):
    data = request.GET

    queryset = Category.objects.all().order_by("name")

    search = data.get("search", "").strip()
    if search != "":
        orm_lookups = ["name__icontains"]
        queryset = search_result(queryset, search, orm_lookups)

    context = {
        "data_list": queryset,
        "payload_data": data.dict(),
        "col_class": "col-lg-4"
    }
    return render(request, template_name="components/cards/card-symbol.html", context=context)


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
        "col_class": "col-lg-4"
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
