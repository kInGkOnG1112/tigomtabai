from django.db import models
from django.contrib.auth.models import User
from utils.model_helpers import upload_files_to, OPTIONAL_FIELD


class Profile(models.Model):
    user = models.OneToOneField(
        User,
        on_delete=models.CASCADE,
        related_name='profile'
    )
    avatar = models.ImageField(upload_to=upload_files_to, **OPTIONAL_FIELD)
    login_failed = models.IntegerField(default=0, **OPTIONAL_FIELD)
    is_locked = models.BooleanField(default=False, **OPTIONAL_FIELD)
    locked_at = models.DateTimeField(**OPTIONAL_FIELD)
    pass_updated_at = models.DateTimeField(**OPTIONAL_FIELD)
    onboarded_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-pk']

    def __str__(self):
        return f"{self.user.first_name} {self.user.last_name}"