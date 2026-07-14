from django.shortcuts import render
from django.views.decorators.http import require_GET

from utils.decorators import login_required
from utils.helpers import search_result
from ledger.models import Category


@login_required
@require_GET
def category_list(request):
    data = request.GET

    queryset = Category.objects.all().order_by('name')

    search = data.get('search', '').strip()
    if search != '':
        orm_lookups = ['name__icontains']
        queryset = search_result(queryset, search, orm_lookups)

    context = {
        'data_list': queryset,
        'payload_data': data.dict(),
        'col_class': 'col-lg-4'
    }
    return render(request, template_name='components/cards/card-symbol.html', context=context)
