from django.db.models import Q, QuerySet
from django.http import JsonResponse

from ledger.models import Record
from utils.helpers import search_result, paginate_key_set, GenericResponse


class RecordForms:

    def __init__(self, request):
        self.request = request

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
