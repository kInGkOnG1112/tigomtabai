from django.contrib.auth.models import User
from django.db import models
from utils.model_helpers import OPTIONAL_FIELD


class CategoryType(models.TextChoices):
    EXPENSE = "EXPENSE", "Expense"
    INCOME = "INCOME", "Income"


class RecordType(models.TextChoices):
    EXPENSE = "EXPENSE", "Expense"
    INCOME = "INCOME", "Income"
    TRANSFER = "TRANSFER", "Transfer"


class Account(models.Model):
    owner = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name="owner_user"
    )
    name = models.CharField(max_length=255)
    description = models.TextField(max_length=500, **OPTIONAL_FIELD)
    balance = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    is_lock = models.BooleanField(default=False, **OPTIONAL_FIELD)
    is_favorite = models.BooleanField(default=False, **OPTIONAL_FIELD)
    is_archived = models.BooleanField(default=False, **OPTIONAL_FIELD)
    icon = models.ForeignKey(
        "main.Icons",
        on_delete=models.DO_NOTHING,
        related_name="account_icon"
    )
    latest_transaction_date = models.DateField(**OPTIONAL_FIELD)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-pk"]

    def __str__(self):
        return f"{self.name}"


class Category(models.Model):
    name = models.CharField(max_length=150)
    icon = models.ForeignKey(
        "main.Icons",
        on_delete=models.DO_NOTHING,
        related_name="category_icon"
    )
    description = models.TextField(max_length=500, **OPTIONAL_FIELD)
    type = models.CharField(
        max_length=20,
        choices=CategoryType.choices,
        default=CategoryType.INCOME
    )
    is_active = models.BooleanField(default=True, **OPTIONAL_FIELD)
    is_default = models.BooleanField(default=True, **OPTIONAL_FIELD)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-pk"]
        verbose_name_plural = "Categories"

    def __str__(self):
        return f"{self.name} ({self.type})"


class Record(models.Model):
    reference_number = models.CharField(max_length=200, **OPTIONAL_FIELD)
    amount = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    account_from = models.ForeignKey(
        Account,
        on_delete=models.CASCADE,
        related_name="outgoing_records",
        **OPTIONAL_FIELD
    )
    account_to = models.ForeignKey(
        Account,
        on_delete=models.CASCADE,
        related_name="incoming_records",
        **OPTIONAL_FIELD
    )
    category = models.ForeignKey(
        Category,
        on_delete=models.CASCADE,
        related_name="records",
        **OPTIONAL_FIELD
    )
    notes = models.TextField(max_length=250, **OPTIONAL_FIELD)
    type = models.CharField(
        max_length=20,
        choices=RecordType.choices,
        default=RecordType.INCOME
    )
    merchant = models.CharField(max_length=150, **OPTIONAL_FIELD)
    transaction_date = models.DateTimeField(**OPTIONAL_FIELD)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        indexes = [
            models.Index(fields=["account_from", "category"]),
            models.Index(fields=["transaction_date"]),
            models.Index(fields=["reference_number"]),
        ]
        ordering = ["-pk"]

    def __str__(self):
        return f"{self.type} - {self.amount} ({self.transaction_date})"
