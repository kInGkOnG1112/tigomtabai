import datetime

from django.conf import settings
from django.contrib.auth import authenticate, login
from django.contrib.auth.models import User
from django.db import transaction
from django.http import JsonResponse
from django.utils.timezone import now
from django.views.decorators.http import require_POST

from profiles.models import Profile
from utils.helpers import GenericResponse


@require_POST
def login_signin(request):
    method = 'Sign in'
    try:
        data = request.POST
        username = data.get('username')
        password = data.get('password')

        try:
            profile = Profile.objects.select_related('user').get(user__username=username)
        except Profile.DoesNotExist:
            profile = None

        if profile and profile.is_locked:
            cooldown = datetime.timedelta(minutes=settings.LOGIN_FAILED_RECOVERY)
            if profile.locked_at and (now() - profile.locked_at) < cooldown:
                return JsonResponse(GenericResponse.error(
                    request=request,
                    user=profile.user,
                    method=method,
                    message='Account is temporarily locked. Please try again later.',
                ))

            profile.is_locked = False
            profile.locked_at = None
            profile.login_failed = 0
            profile.save()

        user = authenticate(username=username, password=password)

        if user is None:
            if profile:
                profile.login_failed += 1
                if profile.login_failed >= settings.LOGIN_FAILED_LIMIT:
                    profile.is_locked = True
                    profile.locked_at = now()
                profile.save()

            return JsonResponse(GenericResponse.error(
                request=request,
                user=profile.user if profile else None,  # Safe fallback if profile doesn't exist
                method=method,
                message='Invalid username/password.',
            ))

        if profile:
            profile.login_failed = 0
            profile.is_locked = False
            profile.locked_at = None
            profile.save()

        login(request, user)

        return JsonResponse(GenericResponse.success(
            request=request,
            user=user,
            method=method,
            message='Successfully logged in.',
        ))

    except Exception as ex:
        return JsonResponse(GenericResponse.error(
            request=request,
            method=method,
            message=str(ex),
        ))


@require_POST
def login_signup(request):
    method = 'Sign up'
    try:
        data = request.POST
        email = data.get('email', '')

        if User.objects.filter(email=email).exists():
            return JsonResponse(GenericResponse.error(
                request=request,
                method=method,
                user_message='Email already registered.',
            ))

        with transaction.atomic():
            user = User.objects.create(
                first_name=data.get('firstname', ''),
                last_name=data.get('lastname', ''),
                email=email,
                username=email
            )
            user.set_password(data.get('password', ''))
            user.save()

            Profile.objects.create(user=user)

        return JsonResponse(GenericResponse.success(
            request=request,
            method=method,
            message='Your account has been created successfully.'
        ))

    except Exception as ex:
        return JsonResponse(GenericResponse.error(
            request=request,
            method=method,
            message=str(ex),
        ))






