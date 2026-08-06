from django.urls import path
from ledger.views import modals, ajax, subpage

app_name = 'ledger'
urlpatterns = []

urlpatterns_subpages = []

urlpatterns_table_subpages = [
    path('subpage/category-list/', subpage.category_list, name='subpage_category_list'),
    path('subpage/account-list/', subpage.account_list, name='subpage_account_list'),
    path('subpage/record-list/', subpage.record_list, name='subpage_record_list'),
    path('subpage/budget-list/', subpage.budget_list, name='subpage_budget_list')
]

urlpatterns_ajax = [
    path('ajax/add-category/', ajax.add_category, name='ajax_add_category'),
    path('ajax/update-category/', ajax.update_category, name='ajax_update_category'),

    path('ajax/add-account/', ajax.add_account, name='ajax_add_account'),
    path('ajax/update-account/', ajax.update_account, name='ajax_update_account'),

    path('ajax/add-record/', ajax.add_record, name='ajax_add_record'),
    path('ajax/update-record/', ajax.update_record, name='ajax_update_record'),
    path('ajax/delete-record/', ajax.delete_record, name='ajax_delete_record'),

    path('ajax/add-budget/', ajax.add_budget, name='ajax_add_budget'),
    path('ajax/bulk-insert-budget/', ajax.bulk_insert_budget, name='ajax_bulk_insert_budget'),
    path('ajax/update-budget/', ajax.update_budget, name='ajax_update_budget'),
    path('ajax/delete-budget/', ajax.delete_budget, name='ajax_delete_budget'),
]

urlpatterns_modals = [
    path('modals/records/add/', modals.add_record, name='modal_add_record'),
    path('modals/records/update/<int:id>/', modals.update_record, name='modal_update_record'),

    path('modals/category/add/', modals.add_category, name='modal_add_category'),
    path('modals/category/update/<int:id>/', modals.update_category, name='modal_update_category'),

    path('modals/account/add/', modals.add_account, name='modal_add_account'),

    path('modals/budget/add/<int:category_id>', modals.add_budget, name='modal_add_budget'),
    path('modals/budget/update/<int:budget_id>', modals.update_budget, name='modal_update_budget'),
    path('modals/budget/copy/', modals.copy_budget, name='modal_copy_budget'),
]


urlpatterns = urlpatterns + urlpatterns_subpages + urlpatterns_table_subpages + urlpatterns_ajax + urlpatterns_modals
