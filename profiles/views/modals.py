from django.shortcuts import render
from ledger.models import Category
from main.models import Icons


def add_category(request):
    icons = Icons.objects.filter(is_active=True)
    context = {
        'icons': icons
    }
    return render(request, template_name="screens/modals/add-category.html", context=context)


def update_category(request, id):
    category = Category.objects.get(id=id)
    icons = Icons.objects.filter(is_active=True)
    context = {
        'icons': icons,
        'category': category
    }
    return render(request, template_name="screens/modals/update-category.html", context=context)
