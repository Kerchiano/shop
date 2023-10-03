from django.views.generic import ListView, TemplateView, DetailView

from electron.models import Product, Categories


class Home(TemplateView):
    template_name = 'electron/home.html'

    def get_context_data(self, **kwargs):
        context = super(Home, self).get_context_data(**kwargs)

        context['category_list'] = Categories.objects.all()
        return context


class ProductList(ListView):
    model = Product
    template_name = 'electron/product_list.html'

    def get_queryset(self):
        return Product.objects.filter(category__slug=self.kwargs['category_slug'])

    def get_context_data(self, **kwargs):
        context = super(ProductList, self).get_context_data(**kwargs)

        context['category_list'] = Categories.objects.all()
        return context


class ProductDetail(DetailView):
    model = Product
    slug_url_kwarg = 'detail_slug'
    context_object_name = 'detail'

    def get_context_data(self, **kwargs):
        context = super(ProductDetail, self).get_context_data(**kwargs)

        context['category_list'] = Categories.objects.all()
        return context
