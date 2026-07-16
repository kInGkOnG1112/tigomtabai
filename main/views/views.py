from django.contrib.auth import logout
from django.http import HttpResponseRedirect
from django.shortcuts import render
from django.urls import reverse

from profiles.models import Profile
from utils.audit_logging import user_activity_log
from utils.helpers import save_sessions


def login(request):
    if request.user.is_authenticated:
        profile = Profile.objects.get(user=request.user)
        save_sessions(request, profile)
        return HttpResponseRedirect(reverse('profile:dashboard'))

    context = {
        'title': 'Login',
        'success_reset': request.GET.get('success_reset', None)
    }
    return render(request, 'base/login-base.html', context)


def logout_user(request):
    user_activity_log.save(
        request=request,
        user=request.user,
        activity_type='Sign out',
        activity_details='User logged out'
    )
    logout(request)
    return HttpResponseRedirect('/')
