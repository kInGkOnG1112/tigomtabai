from django.shortcuts import render

from main.models import Icons


def add_category(request):
    icons = Icons.objects.filter(is_active=True)
    context = {
        'icons': icons
    }
    return render(request, template_name="screens/modals/add-category.html", context=context)
