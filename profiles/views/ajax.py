from django.db import transaction
from django.http import JsonResponse
from django.views.decorators.http import require_POST

from utils.decorators import login_required
from utils.helpers import GenericResponse
from ledger.models import Category, Account
from main.models import Icons


@login_required
@require_POST
def add_category(request):
    method = 'Add Category'
    try:
        data = request.POST
        if Category.objects.filter(name__iexact=data.get('name')).exists():
            return JsonResponse(GenericResponse.error(
                request=request,
                method=method,
                message=f'Category "{data.get('name')}" already exists!',
            ))

        with transaction.atomic():
            icon = Icons.objects.filter(id=data.get('selected_icon')).first()
            Category.objects.create(
                icon=icon,
                name=data.get('name', ''),
                description=data.get('description', ''),
                type=data.get('category_type', '').upper()
            )

        return JsonResponse(GenericResponse.success(
            request=request,
            method=method,
            message='Category successfully added'
        ))

    except Exception as e:
        return JsonResponse(GenericResponse.error(
            request=request,
            method=method,
            message=str(e),
        ))


@login_required
@require_POST
def update_category(request):
    method = 'Update Category'
    try:
        data = request.POST
        if Category.objects.filter(name__iexact=data.get('name')).exclude(id=data.get('id', '')).exists():
            return JsonResponse(GenericResponse.error(
                request=request,
                method=method,
                message=f'Category "{data.get('name')}" already exists!',
            ))

        with transaction.atomic():
            icon = Icons.objects.filter(id=data.get('selected_icon')).first()
            category = Category.objects.filter(id=data.get('id')).first()
            category.icon = icon
            category.name = data.get('name', category.name)
            category.description = data.get('description', category.description)
            category.type = data.get('category_type', '').upper()
            category.save()

        return JsonResponse(GenericResponse.success(
            request=request,
            method=method,
            message='Category successfully updated'
        ))

    except Exception as e:
        print(str(e))
        return JsonResponse(GenericResponse.error(
            request=request,
            method=method,
            message=str(e),
        ))


@login_required
@require_POST
def add_account(request):
    method = 'Add Account'
    try:
        data = request.POST
        with transaction.atomic():
            icon = Icons.objects.filter(id=data.get('institution')).first()
            Account.objects.create(
                icon=icon,
                owner=request.user,
                name=data.get('name', ''),
                description=data.get('description', ''),
                balance=float(data.get('balance', 0).replace(',', ''))
            )

        return JsonResponse(GenericResponse.success(
            request=request,
            method=method,
            message='Account successfully added'
        ))

    except Exception as e:
        return JsonResponse(GenericResponse.error(
            request=request,
            method=method,
            message=str(e),
        ))


@login_required
@require_POST
def update_account(request):
    method = 'Update Account'
    try:
        data = request.POST

        with transaction.atomic():
            account = Account.objects.get(id=data.get('id'))

            boolean_fields = ['is_lock', 'is_archived', 'is_favorite']
            for field in boolean_fields:
                if field in request.POST:
                    is_true = request.POST.get(field) == 'True'
                    setattr(account, field, is_true)

            account.description = data.get('description', account.description)
            account.save()

        return JsonResponse(GenericResponse.success(
            request=request,
            method=method,
            message='Account successfully updated'
        ))

    except Exception as e:
        print(str(e))
        return JsonResponse(GenericResponse.error(
            request=request,
            method=method,
            message=str(e),
        ))
