from django.urls import path
from profiles.views import views, modals, ajax, subpage

app_name = 'profile'
urlpatterns = []
urlpatterns_views = [
    path('dashboard/', views.dashboard, name='dashboard'),
    path('entries/', views.entries, name='entries'),
    path('recurring-payments/', views.recurring_payments, name='recurring_payments'),
    path('budgets/', views.budgets, name='budgets'),
    path('accounts/', views.accounts, name='accounts'),
    path('categories/', views.categories, name='categories'),
]

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
]

urlpatterns_modals = [
    path('modals/category/add/', modals.add_category, name='modal_add_category'),
    path('modals/category/update/<int:id>/', modals.update_category, name='modal_update_category'),
    path('modals/account/add/', modals.add_account, name='modal_add_account'),
]


urlpatterns = urlpatterns + urlpatterns_views + urlpatterns_subpages + urlpatterns_table_subpages + urlpatterns_ajax + urlpatterns_modals
