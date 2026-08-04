from datetime import datetime, timedelta
from decimal import Decimal, InvalidOperation
from django.db.models import Q, F
from django.utils import timezone

from ledger.models import Record, RecordType, Account, Category
from utils.helpers import search_result, paginate_key_set


class RecordForms:

    def __init__(self, request):
        self.request = request
        self.method = ""

    def filter_data(self):
        data = self.request.GET

        queryset = Record.objects.filter(
            Q(account_to__owner=self.request.user) |
            Q(account_from__owner=self.request.user)
        ).select_related(
            "account_to",
            "account_from",
            "category"
        ).order_by("-transaction_date")

        account_id = data.get("account_id")
        if account_id:
            queryset = queryset.filter(
                Q(account_to_id=account_id) |
                Q(account_from_id=account_id)
            )

        list_data_by = data.get("list_data_by")
        if list_data_by:
            now = timezone.now()
            queryset = queryset.filter(
                transaction_date__year=now.year
            )

            if list_data_by == "monthly":
                queryset = queryset.filter(
                    transaction_date__month=now.month
                )

            elif list_data_by == "weekly":
                start_of_week = (now - timedelta(days=now.weekday())).replace(
                    hour=0,
                    minute=0,
                    second=0,
                    microsecond=0
                )
                queryset = queryset.filter(
                    transaction_date__gte=start_of_week,
                    transaction_date__lte=now
                )

            else:
                queryset = queryset.filter(
                    transaction_date__day=now.day
                )


        search = data.get("search", "").strip()
        if search != "":
            orm_lookups = ["reference_number__icontains"]
            queryset = search_result(queryset, search, orm_lookups)

        return queryset

    def list_data(self):
        data = self.request.GET
        queryset = self.filter_data()

        pagination = {}
        paginated = data.get("paginated")
        if paginated:
            cursor = data.get("cursor")
            direction = data.get("direction", "next")
            page_size = int(data.get("page_size", 10))
            pagination_data = paginate_key_set(
                queryset=queryset,
                cursor=cursor,
                direction=direction,
                page_size=page_size,
            )
            queryset = pagination_data["results"]
            pagination = pagination_data["pagination"]

        return {
            "results": queryset,
            "pagination": pagination
        }

    def validate_data(self):
        data = self.request.POST
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

        record_id = data.get("id")
        record = None
        if record_id:
            try:
                record = Record.objects.get(id=record_id)
            except Record.DoesNotExist:
                response["error_message"] = "Record does not exist."
                return response

        cleaned_data.update(
            {
                "record_type": record_type,
                "record": record,
                "amount": amount,
                "notes": (data.get(f"{record_type}_notes") or "").strip(),
                "tdt": datetime.strptime((data.get(f"{record_type}_tdt") or "").strip(), '%m/%d/%Y %I:%M %p'),
            }
        )

        if record_type.upper() in [RecordType.INCOME, RecordType.EXPENSE]:
            account_id = data.get(f"{record_type}_account")
            category_id = data.get(f"{record_type}_category")

            account = Account.objects.filter(
                id=account_id, owner=self.request.user, is_archived=False
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
                response[
                    "error_message"] = f"Insufficient balance in '{account.name.title()}'. Available: ₱{account.balance:,.2f}"
                return response

        elif record_type.upper() == RecordType.TRANSFER:
            from_id = data.get("account_from", "")
            to_id = data.get("account_to", "")

            if from_id == to_id:
                response["error_message"] = "Source and destination accounts cannot be the same."
                return response

            from_account = Account.objects.filter(
                id=from_id, owner=self.request.user, is_archived=False
            ).first()
            to_account = Account.objects.filter(
                id=to_id, owner=self.request.user, is_archived=False
            ).first()

            if not from_account:
                response["error_message"] = "Source account not found."
                return response

            if not to_account:
                response["error_message"] = "Destination account not found."
                return response

            if from_account.balance < amount:
                response[
                    "error_message"] = f"Insufficient balance in source account '{from_account.name.title()}'. Available: ₱{from_account.balance:,.2f}"
                return response

            cleaned_data.update(
                {"account_from": from_account, "account_to": to_account}
            )

        return response


    def revert_transaction(self, record: Record):
        self.method = "Revert Record Transaction"

        if not record:
            return False

        balance_updates = {}

        if record.type == RecordType.INCOME and record.account_to_id:
            balance_updates[record.account_to_id] = -record.amount

        elif record.type == RecordType.EXPENSE and record.account_from_id:
            balance_updates[record.account_from_id] = record.amount

        elif record.type == RecordType.TRANSFER:
            if record.account_from_id:
                balance_updates[record.account_from_id] = record.amount
            if record.account_to_id:
                balance_updates[record.account_to_id] = -record.amount

        for account_id, delta in balance_updates.items():
            Account.objects.filter(id=account_id).update(balance=F("balance") + delta)

        return True


