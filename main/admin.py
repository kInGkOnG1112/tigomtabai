from django.contrib import admin
from unfold.admin import ModelAdmin
from unfold.paginator import InfinitePaginator
from unfold.contrib.filters.admin import (
    RangeDateFilter,
    ChoicesDropdownFilter
)
from .models import (
    Icons,
    ActivityLog
)


@admin.register(Icons)
class IconAdmin(ModelAdmin):
    unfold_icon = "image"
    list_per_page = 10
    list_filter_submit = True

    search_fields = ('name', )
    list_display = (
        'name',
        'type',
        'is_active',
        'created_at'
    )
    list_filter = (
        ('type', ChoicesDropdownFilter),
    )


@admin.register(ActivityLog)
class ActivityLogAdmin(ModelAdmin):
    paginator = InfinitePaginator
    list_filter_submit = True
    list_per_page = 10

    raw_id_fields = ('user',)
    search_fields = ('name', )
    list_display = (
        'user',
        'activity_type',
        'activity_details',
        'ip_address',
        'success',
        'timestamp'
    )
    list_filter = (
        'activity_type',
        ('timestamp', RangeDateFilter)
    )
