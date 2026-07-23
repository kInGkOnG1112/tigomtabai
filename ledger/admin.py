from django.contrib import admin
from unfold.admin import ModelAdmin
from unfold.paginator import InfinitePaginator
from unfold.contrib.filters.admin import (
    ChoicesDropdownFilter,
    BooleanRadioFilter
)
from .models import (
    Account,
    Category,
    Record,
)


@admin.register(Account)
class AccountAdmin(ModelAdmin):
    raw_id_fields = ("owner",)
    search_fields = ("name",)
    list_display = (
        "owner",
        "name",
        "balance",
        "created_at"
    )
    list_filter = ("owner",)


@admin.register(Category)
class CategoryAdmin(ModelAdmin):
    paginator = InfinitePaginator
    list_filter_submit = True
    list_per_page = 15

    raw_id_fields = ("icon",)
    search_fields = ("name",)
    list_display = (
        "name",
        "type",
        "is_active",
        "is_default",
        "created_at"
    )
    list_filter = (
        ("is_active", BooleanRadioFilter),
        ("type", ChoicesDropdownFilter)
    )


@admin.register(Record)
class RecordAdmin(ModelAdmin):
    raw_id_fields = (
        "account_from",
        "account_to",
        "category"
    )
    search_fields = ("merchant",)
    list_display = (
        "reference_number",
        "amount",
        "category",
        "type",
        "transaction_date",
        "created_at"
    )
    list_filter = (
        "account_from",
        "account_to",
        "category",
        "type",
        "created_at"
    )
