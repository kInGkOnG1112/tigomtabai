from functools import wraps
from django.http import JsonResponse, HttpResponseRedirect
from django.urls import reverse


def login_required(view_func):
    """
    Decorator for views that checks that the user is logged in.
    If the user is not authenticated, it returns a JSON error response
    instead of redirecting to a login page.
    """

    @wraps(view_func)
    def _wrapped_view(request, *args, **kwargs):
        if request.user.is_authenticated:
            return view_func(request, *args, **kwargs)

        # If not authenticated, back to signin
        return HttpResponseRedirect(reverse('main:login'))

    return _wrapped_view
