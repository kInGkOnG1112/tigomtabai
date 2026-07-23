from django.urls import path
from ledger.views import modals, ajax, subpage

app_name = 'ledger'
urlpatterns = []

urlpatterns_subpages = []

urlpatterns_table_subpages = [
    path('subpage/category-list/', subpage.category_list, name='subpage_category_list'),
    path('subpage/account-list/', subpage.account_list, name='subpage_account_list')
]

urlpatterns_ajax = [
    path('ajax/add-category/', ajax.add_category, name='ajax_add_category'),
    path('ajax/update-category/', ajax.update_category, name='ajax_update_category'),

    path('ajax/add-account/', ajax.add_account, name='ajax_add_account'),
    path('ajax/update-account/', ajax.update_account, name='ajax_update_account'),

    path('ajax/add-record/', ajax.add_record, name='ajax_add_record'),
]

urlpatterns_modals = [
    path('modals/records/add/', modals.add_record, name='modal_add_record'),

    path('modals/category/add/', modals.add_category, name='modal_add_category'),
    path('modals/category/update/<int:id>/', modals.update_category, name='modal_update_category'),

    path('modals/account/add/', modals.add_account, name='modal_add_account'),
]


urlpatterns = urlpatterns + urlpatterns_subpages + urlpatterns_table_subpages + urlpatterns_ajax + urlpatterns_modals
