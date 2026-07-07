import os
import uuid

from django.urls import reverse
from django.utils.timezone import now



OPTIONAL_FIELD = {
    'null': True,
    'blank': True
}


def upload_files_to(instance, filename):
    filename_base, filename_ext = os.path.splitext(filename)
    path = instance._meta.model_name
    new_filename = '{}_{}{}'.format(
        uuid.uuid4(),
        now().strftime("%Y%m%d%H%M%S"),
        filename_ext.lower()
    )
    return '{}/{}'.format(path, new_filename)


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
            'menu_name': 'Records',
            'id': 'records',
            'sub_items': [
                {
                    'menu_name': 'Entries',
                    'id': 'entries',
                    'url': reverse('profile:entries'),
                    'icon': 'components/icons/svg/entries.html'
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
