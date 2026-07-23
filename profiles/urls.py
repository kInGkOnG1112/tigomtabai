from django.urls import path
from profiles.views import views, modals, ajax, subpage

app_name = 'profile'
urlpatterns = []
urlpatterns_views = [
    path('dashboard/', views.dashboard, name='dashboard'),
    path('ledger/records/', views.records, name='records'),
    path('ledger/recurring-payments/', views.recurring_payments, name='recurring_payments'),
    path('budgets/', views.budgets, name='budgets'),
    path('accounts/', views.accounts, name='accounts'),
    path('categories/', views.categories, name='categories'),
]

urlpatterns_subpages = []

urlpatterns_table_subpages = []

urlpatterns_ajax = []

urlpatterns_modals = []


urlpatterns = urlpatterns + urlpatterns_views + urlpatterns_subpages + urlpatterns_table_subpages + urlpatterns_ajax + urlpatterns_modals
