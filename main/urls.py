from django.urls import path
from .views import views, ajax

app_name = 'main'
urlpatterns = []
urlpatterns_views = [
    path('', views.login, name='login'),
    path('logout/', views.logout_user, name='logout')
]

urlpatterns_ajax = [
    path('ajax/login-signin/', ajax.login_signin, name='ajax_login_signin'),
    path('ajax/login-signup/', ajax.login_signup, name='ajax_login_signup'),
]

urlpatterns = urlpatterns + urlpatterns_views + urlpatterns_ajax
