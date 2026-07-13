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
        if Category.objects.filter(name__iexact=data.get("name")).exists():
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
                type=data.get('type', '')
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
