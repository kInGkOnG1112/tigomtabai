from django.contrib import admin
from unfold.admin import ModelAdmin
from .models import Profile


@admin.register(Profile)
class ProfileAdmin(ModelAdmin):
    raw_id_fields = ('user',)
    search_fields = (
        'user__first_name',
        'user__last_name',
    )
    list_display = (
        'user',
        'login_failed',
        'is_locked',
        'locked_at',
        'onboarded_at'
    )
    list_filter = ('is_locked',)
