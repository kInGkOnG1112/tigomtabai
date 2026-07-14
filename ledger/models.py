from django.db import models
from profiles.models import Profile
from utils.model_helpers import upload_files_to, OPTIONAL_FIELD


class CategoryType(models.TextChoices):
    EXPENSE = 'EXPENSE', 'Expense'
    INCOME = 'INCOME', 'Income'


class RecordType(models.TextChoices):
    EXPENSE = 'EXPENSE', 'Expense'
    INCOME = 'INCOME', 'Income'
    TRANSFER = 'TRANSFER', 'Transfer'


class Account(models.Model):
    profile = models.ForeignKey(
        Profile,
        on_delete=models.CASCADE,
        related_name='accounts'
    )
    name = models.CharField(max_length=255)
    initial_balance = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    icon = models.ImageField(upload_to=upload_files_to, **OPTIONAL_FIELD)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-pk']

    def __str__(self):
        return f"{self.name} ({self.profile.user.username if hasattr(self.profile, 'user') else self.profile.pk})"


class Category(models.Model):
    name = models.CharField(max_length=150)
    icon = models.ForeignKey(
        'main.Icons',
        on_delete=models.DO_NOTHING,
        related_name='category_icon'
    )
    description = models.TextField(max_length=500, **OPTIONAL_FIELD)
    type = models.CharField(
        max_length=20,
        choices=CategoryType.choices,
        default=CategoryType.INCOME
    )
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-pk']
        verbose_name_plural = "Categories"

    def __str__(self):
        return f"{self.name} ({self.type})"


class Record(models.Model):
    amount = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    account_from = models.ForeignKey(
        Account,
        on_delete=models.CASCADE,
        related_name='outgoing_records'
    )
    account_to = models.ForeignKey(
        Account,
        on_delete=models.CASCADE,
        related_name='incoming_records',
        **OPTIONAL_FIELD
    )
    category = models.ForeignKey(
        Category,
        on_delete=models.CASCADE,
        related_name='records'
    )
    notes = models.TextField(max_length=250, **OPTIONAL_FIELD)
    type = models.CharField(
        max_length=20,
        choices=RecordType.choices,
        default=RecordType.INCOME
    )
    merchant = models.CharField(max_length=150, **OPTIONAL_FIELD)
    transaction_date = models.DateField(**OPTIONAL_FIELD)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        indexes = [
            models.Index(fields=['account_from', 'category']),
            models.Index(fields=['transaction_date']),
        ]
        ordering = ['-pk']

    def __str__(self):
        return f"{self.type} - {self.amount} ({self.transaction_date})"
