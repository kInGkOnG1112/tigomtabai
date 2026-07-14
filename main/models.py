from django.db import models
from django.contrib.auth.models import User
from utils.model_helpers import upload_files_to, OPTIONAL_FIELD


class Icons(models.Model):
    name = models.CharField(max_length=155, **OPTIONAL_FIELD)
    image = models.ImageField(upload_to=upload_files_to, **OPTIONAL_FIELD)
    is_active = models.BooleanField(default=True, **OPTIONAL_FIELD)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['name']
        verbose_name_plural = 'Icons'

    def __str__(self):
        return self.name



class ActivityLog(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, **OPTIONAL_FIELD)
    activity_type = models.CharField(max_length=250)
    activity_details = models.TextField(**OPTIONAL_FIELD)
    ip_address = models.GenericIPAddressField(**OPTIONAL_FIELD)
    success = models.BooleanField(default=False)
    reference_number_list = models.JSONField(**OPTIONAL_FIELD)
    metadata = models.JSONField(**OPTIONAL_FIELD)
    timestamp = models.DateTimeField(**OPTIONAL_FIELD)

    class Meta:
        ordering = ['-pk']
        indexes = [
            models.Index(fields=[
                'user',
                'activity_type',
                'timestamp'
            ]),
        ]

    def __str__(self):
        return self.activity_type
