import json
import operator
import secrets
import string
from datetime import datetime
from functools import reduce
from django.db.models import Q
from django.urls import reverse

from ledger.models import Record
from utils.audit_logging import user_activity_log


def get_global_context(request, context):
    navigations = get_navigation_items(request)

    active_page = context.get('page')
    filtered_navigations = []
    for nav in navigations:
        if active_page == nav['id']:
            nav['is_active'] = True

        filtered_navigations.append(nav)

    global_context = {
        'g_navigations': filtered_navigations
    }
    return {**context, **global_context}



def get_navigation_items(request):
    navigations = [
        {
            'menu_name': 'Dashboard',
            'id': 'dashboard',
            'url': reverse('profile:dashboard'),
        },
        {
            'menu_name': 'Ledger',
            'id': 'records',
            'sub_items': [
                {
                    'menu_name': 'Records',
                    'id': 'records',
                    'url': reverse('profile:records'),
                    'icon': 'components/icons/svg/records.html'
                },

                {
                    'menu_name': 'Recurring Payments',
                    'id': 'recurring_payments',
                    'url': reverse('profile:recurring_payments'),
                    'icon': 'components/icons/svg/check-records.html'
                }
            ]
        },
        {
            'menu_name': 'Budgets',
            'id': 'budgets',
            'url': reverse('profile:budgets'),
        },
        {
            'menu_name': 'Accounts',
            'id': 'accounts',
            'url': reverse('profile:accounts'),
        },
        {
            'menu_name': 'Categories',
            'id': 'categories',
            'url': reverse('profile:categories'),
        },
    ]

    return navigations


class GenericResponse:

    @staticmethod
    def error(
        request,
        user=None,
        method='',
        message='',
        user_message='Unable to process the request as of this moment.',
        reference_number_list: dict = None
    ):
        user_activity_log.save(
            request=request,
            user=user if user else request.user if request.user else None,
            activity_type=method,
            activity_details=message if message else user_message,
            success=False,
            reference_number_list=reference_number_list
        )

        return {
            'success': False,
            'error': message if message else user_message,
            'message': user_message
        }

    @staticmethod
    def success(
        request,
        user=None,
        method='',
        message='Success!',
        data=None,
        redirection=None,
        reference_number_list: dict = None
    ):
        user_activity_log.save(
            request=request,
            user=user if user else request.user if request.user else None,
            activity_type=method,
            activity_details=message,
            reference_number_list=reference_number_list
        )
        return {
            'success': True,
            'message': message,
            'data': data,
            'redirection': redirection
        }


def search_result(queryset, search, orm_lookups):
    search_terms = search.split()
    if not search_terms:
        return queryset

    or_queries = [
        Q(**{orm_lookup: term})
        for term in search_terms
        for orm_lookup in orm_lookups
    ]
    combined_query = reduce(operator.or_, or_queries)

    return queryset.filter(combined_query)


def save_sessions(request, data):
    if data:
        request.session['last_login'] = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
        request.session['email'] = request.user.email
        request.session['first_name'] = request.user.first_name
        request.session['last_name'] = request.user.last_name
        request.session['avatar'] = str(json.dumps(str(data.avatar))).replace('"', '')
    request.session.modified = True
    return True


def generate_unique_ref(
    length=8,
    prefix="REF-",
    model=Record,
    field_name="reference_number",
):
    """Generates a unique reference number with configurable length and prefix.

    - length: Total number of random characters (excluding prefix)
    - prefix: String prepended to the reference (e.g., "REF-", "TXN-")
    - model: Django Model class to check against for uniqueness
    - field_name: Model field name storing the reference
    """
    allowed_chars = string.ascii_uppercase + string.digits
    allowed_chars = allowed_chars.translate(str.maketrans("", "", "0O1I"))

    while True:
        random_str = "".join(
            secrets.choice(allowed_chars) for _ in range(length)
        )
        ref_code = f"{prefix}{random_str}"

        lookup = {field_name: ref_code}
        if not model.objects.filter(**lookup).exists():
            return ref_code

