from django.contrib import admin
from .models import Icons


@admin.register(Icons)
class IconAdmin(admin.ModelAdmin):
    search_fields = ('name', )
    list_display = ('name', 'is_active', 'created_at')
