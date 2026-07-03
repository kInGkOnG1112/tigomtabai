from django.db import models
from django.contrib.auth.models import User
from utils.helpers import upload_files_to, OPTIONAL_FIELD


class Profile(models.Model):
    user = models.OneToOneField(
        User,
        on_delete=models.CASCADE,
        related_name='profile'
    )
    avatar = models.ImageField(upload_to=upload_files_to, **OPTIONAL_FIELD)
    onboarded_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-pk']

    def __str__(self):
        return f"{self.user.first_name} {self.user.last_name}"