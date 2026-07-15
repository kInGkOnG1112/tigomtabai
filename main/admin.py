from django.contrib import admin
from unfold.admin import ModelAdmin
from .models import Icons


@admin.register(Icons)
class IconAdmin(ModelAdmin):
    search_fields = ('name', )
    list_display = ('name', 'type', 'is_active', 'created_at')
