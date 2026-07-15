from django.contrib import admin
from unfold.admin import ModelAdmin
from .models import (
    Account,
    Category,
    Record,
)


@admin.register(Account)
class AccountAdmin(ModelAdmin):
    raw_id_fields = ('profile',)
    search_fields = ('name',)
    list_display = (
        'profile',
        'name',
        'initial_balance',
        'created_at'
    )
    list_filter = ('profile',)


@admin.register(Category)
class CategoryAdmin(ModelAdmin):
    raw_id_fields = ('icon',)
    search_fields = ('name',)
    list_display = (
        'name',
        'type',
        'created_at'
    )


@admin.register(Record)
class RecordAdmin(ModelAdmin):
    raw_id_fields = (
        'account_from',
        'account_to',
        'category'
    )
    search_fields = ('merchant',)
    list_display = (
        'amount',
        'category',
        'type',
        'transaction_date',
        'created_at'
    )
    list_filter = (
        'account_from',
        'account_to',
        'category',
        'type',
        'created_at'
    )
