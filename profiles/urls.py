from django.urls import path
from . import views

app_name = 'profile'
urlpatterns = []
urlpatterns += {
    path('dashboard/', views.dashboard, name='dashboard'),
    path('entries/', views.entries, name='entries'),
    path('recurring-payments/', views.recurring_payments, name='recurring_payments'),
}
