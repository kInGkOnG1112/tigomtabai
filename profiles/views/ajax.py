from django.db import transaction
from django.http import JsonResponse
from django.views.decorators.http import require_POST
from utils.helpers import GenericResponse
from ledger.models import Category
from main.models import Icons


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
