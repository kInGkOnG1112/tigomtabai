from datetime import datetime
from decimal import Decimal, InvalidOperation

from django.db import transaction
from django.http import JsonResponse
from django.views.decorators.http import require_POST

from utils.decorators import login_required
from utils.helpers import GenericResponse, generate_unique_ref
from ledger.models import Category, Account, RecordType, Record
from main.models import Icons


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
            icon = Icons.objects.filter(id=data.get("institution")).first()
            Account.objects.create(
                icon=icon,
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
        validated_data = validate_record(request)
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



def validate_record(request):
    data = request.POST
    record_type = (data.get("record_type") or "").strip().lower()
    cleaned_data = {key: value for key, value in data.items() if key != "csrfmiddlewaretoken"}

    response = {"data": cleaned_data, "error_message": ""}

    if record_type.upper() not in [RecordType.INCOME, RecordType.EXPENSE, RecordType.TRANSFER]:
        response["error_message"] = "Invalid record type."
        return response

    raw_amount = (str(data.get(f"{record_type}_amount", "0")).replace(",", "").strip())
    try:
        amount = Decimal(raw_amount)
        if amount <= 0:
            response["error_message"] = "Amount must be greater than zero."
            return response
    except (InvalidOperation, ValueError):
        response["error_message"] = "Please enter a valid numeric amount."
        return response

    import pdb; pdb.set_trace()
    cleaned_data.update(
        {
            "record_type": record_type,
            "amount": amount,
            "notes": (data.get(f"{record_type}_notes") or "").strip(),
            "tdt": datetime.strptime((data.get(f"{record_type}_tdt") or "").strip(), '%m/%d/%Y %I:%M %p'),
        }
    )

    if record_type.upper() in [RecordType.INCOME, RecordType.EXPENSE]:
        account_id = data.get(f"{record_type}_account")
        category_id = data.get(f"{record_type}_category")

        account = Account.objects.filter(
            id=account_id, owner=request.user, is_archived=False
        ).first()
        category = Category.objects.filter(
            id=category_id, is_active=True
        ).first()

        if not account:
            response["error_message"] = "Selected account was not found."
            return response

        if not category:
            response["error_message"] = "Selected category was not found."
            return response

        cleaned_data.update({"account": account, "category": category})

        if record_type.upper() == RecordType.EXPENSE and account.balance < amount:
            response["error_message"] = f"Insufficient balance in '{account.name.title()}'. Available: ₱{account.balance:,.2f}"
            return response

    elif record_type.upper() == RecordType.TRANSFER:
        from_id = data.get("account_from", "")
        to_id = data.get("account_to", "")

        if from_id == to_id:
            response["error_message"] = "Source and destination accounts cannot be the same."
            return response

        from_account = Account.objects.filter(
            id=from_id, owner=request.user, is_archived=False
        ).first()
        to_account = Account.objects.filter(
            id=to_id, owner=request.user, is_archived=False
        ).first()

        if not from_account:
            response["error_message"] = "Source account not found."
            return response

        if not to_account:
            response["error_message"] = "Destination account not found."
            return response

        if from_account.balance < amount:
            response["error_message"] = f"Insufficient balance in source account '{from_account.name.title()}'. Available: ₱{from_account.balance:,.2f}"
            return response

        cleaned_data.update(
            {"account_from": from_account, "account_to": to_account}
        )

    return response
