from datetime import datetime
from decimal import Decimal, InvalidOperation

from django.db import transaction
from django.db.models import F
from django.http import JsonResponse
from django.views.decorators.http import require_POST

from ledger.forms import RecordForms
from utils.decorators import login_required
from utils.helpers import GenericResponse, generate_unique_ref
from ledger.models import Category, Account, RecordType, Record
from main.models import Icons, Institution


@login_required
@require_POST
def add_category(request):
    method = "Add Category"
    try:
        data = request.POST
        if Category.objects.filter(name__iexact=data.get("name")).exists():
            return JsonResponse(GenericResponse.error(
                request=request,
                method=method,
                message=f"Category '{data.get("name")}' already exists!",
            ))

        with transaction.atomic():
            icon = Icons.objects.filter(id=data.get("selected_icon")).first()
            Category.objects.create(
                icon=icon,
                name=data.get("name", ""),
                description=data.get("description", ""),
                type=data.get("category_type", "").upper()
            )

        return JsonResponse(GenericResponse.success(
            request=request,
            method=method,
            message="Category successfully added"
        ))

    except Exception as e:
        return JsonResponse(GenericResponse.error(
            request=request,
            method=method,
            message=str(e),
        ))


@login_required
@require_POST
def update_category(request):
    method = "Update Category"
    try:
        data = request.POST
        if Category.objects.filter(name__iexact=data.get("name")).exclude(id=data.get("id", "")).exists():
            return JsonResponse(GenericResponse.error(
                request=request,
                method=method,
                message=f"Category '{data.get("name")}' already exists!",
            ))

        with transaction.atomic():
            icon = Icons.objects.filter(id=data.get("selected_icon")).first()
            category = Category.objects.filter(id=data.get("id")).first()
            category.icon = icon
            category.name = data.get("name", category.name)
            category.description = data.get("description", category.description)
            category.type = data.get("category_type", "").upper()
            category.save()

        return JsonResponse(GenericResponse.success(
            request=request,
            method=method,
            message="Category successfully updated"
        ))

    except Exception as e:
        print(str(e))
        return JsonResponse(GenericResponse.error(
            request=request,
            method=method,
            message=str(e),
        ))


@login_required
@require_POST
def add_account(request):
    method = "Add Account"
    try:
        data = request.POST
        with transaction.atomic():
            institution = Institution.objects.filter(id=data.get("institution")).first()
            Account.objects.create(
                institution=institution,
                owner=request.user,
                name=data.get("name", ""),
                description=data.get("description", ""),
                balance=float(data.get("balance", 0).replace(",", ""))
            )

        return JsonResponse(GenericResponse.success(
            request=request,
            method=method,
            message="Account successfully added"
        ))

    except Exception as e:
        return JsonResponse(GenericResponse.error(
            request=request,
            method=method,
            message=str(e),
        ))


@login_required
@require_POST
def update_account(request):
    method = "Update Account"
    try:
        data = request.POST

        with transaction.atomic():
            account = Account.objects.get(id=data.get("id"))

            boolean_fields = ["is_lock", "is_archived", "is_favorite"]
            for field in boolean_fields:
                if field in request.POST:
                    is_true = request.POST.get(field) == "True"
                    setattr(account, field, is_true)

            account.description = data.get("description", account.description)
            account.save()

        return JsonResponse(GenericResponse.success(
            request=request,
            method=method,
            message="Account successfully updated"
        ))

    except Exception as e:
        print(str(e))
        return JsonResponse(GenericResponse.error(
            request=request,
            method=method,
            message=str(e),
        ))


@login_required
@require_POST
def add_record(request):
    method = "Add Ledger Record"
    try:
        record_form = RecordForms(request)
        validated_data = record_form.validate_data()
        if validated_data.get("error_message"):
            return JsonResponse(GenericResponse.error(
                request=request,
                method=method,
                user_message=validated_data.get("error_message"),
            ))

        data = validated_data.get("data", {})
        record_type = data.get("record_type", "").upper()

        amount = data.get("amount", 0)
        transaction_date = data.get("tdt") or datetime.now()

        prefix = f"{record_type[:3]}-" if record_type else "REC-"
        reference_number = generate_unique_ref(prefix=prefix)

        with transaction.atomic():
            record = Record.objects.create(
                reference_number=reference_number,
                amount=amount,
                notes=data.get("notes", ""),
                transaction_date=transaction_date,
                type=record_type
            )

            if record_type in [RecordType.INCOME, RecordType.EXPENSE]:
                account = data.get("account")
                account.latest_transaction_date = transaction_date
                record.category = data.get("category")

                if record_type == RecordType.INCOME:
                    account.balance += amount
                    record.account_to = account
                else:
                    account.balance -= amount
                    record.account_from = account

                account.save()

            elif record_type == RecordType.TRANSFER:
                account_from = data.get("account_from")
                account_to = data.get("account_to")

                record.account_from = account_from
                record.account_to = account_to

                account_from.latest_transaction_date = transaction_date
                account_to.latest_transaction_date = transaction_date

                account_from.balance -= amount
                account_to.balance += amount

                account_from.save()
                account_to.save()

            record.save()

        return JsonResponse(GenericResponse.success(
            request=request,
            method=method,
            message="Record successfully added"
        ))

    except Exception as e:
        print(str(e))
        return JsonResponse(GenericResponse.error(
            request=request,
            method=method,
            message=str(e),
        ))


@login_required
@require_POST
def update_record(request):
    method = "Update Ledger Record"
    try:
        record_form = RecordForms(request)
        validated_data = record_form.validate_data()
        if validated_data.get("error_message"):
            return JsonResponse(GenericResponse.error(
                request=request,
                method=method,
                user_message=validated_data.get("error_message"),
            ))

        data = validated_data.get("data", {})
        record_type = data.get("record_type", "").upper()

        amount = data.get("amount", 0)
        transaction_date = data.get("tdt") or datetime.now()

        record = data.get("record")

        with transaction.atomic():

            reverted = record_form.revert_transaction(record)
            if not reverted:
                return JsonResponse(GenericResponse.error(
                    request=request,
                    method=method,
                    user_message="Record not found!",
                ))

            record.amount = amount
            record.transaction_date = transaction_date
            record.notes = data.get("notes", record.notes)

            if record_type in [RecordType.INCOME, RecordType.EXPENSE]:
                account = data.get("account")
                record.category = data.get("category")

                if record_type == RecordType.INCOME:
                    account.balance += amount
                    record.account_to = account
                    record.account_from = None
                    delta = amount
                else:
                    account.balance -= amount
                    record.account_from = account
                    record.account_to = None
                    delta = -amount

                Account.objects.filter(id=account.id).update(
                    balance=F("balance") + delta,
                    latest_transaction_date=transaction_date,
                )

            elif record_type == RecordType.TRANSFER:
                account_from = data.get("account_from")
                account_to = data.get("account_to")

                record.account_from = account_from
                record.account_to = account_to

                Account.objects.filter(id=account_from.id).update(
                    balance=F("balance") - amount,
                    latest_transaction_date=transaction_date,
                )

                Account.objects.filter(id=account_to.id).update(
                    balance=F("balance") + amount,
                    latest_transaction_date=transaction_date,
                )

            record.save()

        return JsonResponse(GenericResponse.success(
            request=request,
            method=method,
            message="Record successfully updated"
        ))

    except Exception as e:
        print(str(e))
        return JsonResponse(GenericResponse.error(
            request=request,
            method=method,
            message=str(e),
        ))


@login_required
@require_POST
def delete_record(request):
    method = "Delete/remove Ledger Record"
    try:
        data = request.POST

        record = Record.objects.filter(id=data.get("id")).first()
        if not record:
            return JsonResponse(GenericResponse.error(
                request=request,
                method=method,
                user_message="Record not found!",
            ))

        with transaction.atomic():
            record_form = RecordForms(request)
            record_form.revert_transaction(record)
            record.delete()


        return JsonResponse(GenericResponse.success(
            request=request,
            method=method,
            message="Record successfully deleted"
        ))

    except Exception as e:
        print(str(e))
        return JsonResponse(GenericResponse.error(
            request=request,
            method=method,
            message=str(e),
        ))