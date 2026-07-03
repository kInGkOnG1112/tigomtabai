from django.shortcuts import render


# Create your views here.
def login(request):
    # if request.user.is_authenticated:
    #     post_account_login(request)
    #     return HttpResponseRedirect(get_user_redirect(request.user))

    context = {
        'title': 'Login',
        'success_reset': request.GET.get('success_reset', None)
    }
    return render(request, 'pages/login.html', context)


def dashboard(request):

    context = {
        'title': 'Dashboard',
        'success_reset': request.GET.get('success_reset', None)
    }
    return render(request, 'pages/dashboard.html', context)
