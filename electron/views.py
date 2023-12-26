import json
import logging

from django.core.paginator import Paginator, EmptyPage
from django.http import JsonResponse
from django.shortcuts import render
from django.views.generic import ListView, TemplateView, DetailView
from electron.models import Product, Category, Order, OrderItem, Brand, SubCategory, Color

from users.models import User

logger = logging.getLogger(__name__)


class Home(TemplateView):
    template_name = 'electron/home.html'

    def get_context_data(self, **kwargs):
        context = super(Home, self).get_context_data(**kwargs)

        context['category_list'] = Category.objects.all()
        return context


class ProductList(ListView):
    model = Product
    template_name = 'electron/product_list.html'
    context_object_name = 'products'

    def get_queryset(self):
        sub_category_slug = self.kwargs['sub_category']
        products = Product.objects.filter(sub_category__slug=sub_category_slug).order_by('id')
        return products

    def get(self, request, *args, **kwargs):
        page_number = request.GET.get('page', 1)
        per_page = 5

        products = self.get_queryset()
        paginator = Paginator(products, per_page)

        try:
            current_page = paginator.page(page_number)
            print(current_page.object_list)
        except EmptyPage:
            return JsonResponse({"error": "Страница не найдена"}, status=404)

        context = self.get_context_data(object_list=current_page)

        if request.headers.get('x-requested-with') == 'XMLHttpRequest' and request.headers.get(
                'X-Infinite-Scroll') == 'true':
            serialized_products = [{"id": product.id, "name": product.name,
                                    "brand": product.brand.name, 'image': product.image.url,
                                    'price': product.price, 'color': product.color.name,
                                    'slug': product.slug} for product in current_page
                                   ]
            return JsonResponse({"products": serialized_products})
        else:
            amount_pages = paginator.num_pages
            amount_pages = [i for i in range(1, int(amount_pages) + 1)]
            prev_page = current_page.previous_page_number() if current_page.has_previous() else None
            next_page = current_page.next_page_number() if current_page.has_next() else None

            context.update({"products": current_page, 'amount_pages': amount_pages,
                            "prev_page": prev_page, "next_page": next_page})

            return render(request, self.template_name, context)

    def get_context_data(self, **kwargs):
        context = super(ProductList, self).get_context_data(**kwargs)

        all_brands = Brand.objects.all()
        unique_first_letters = sorted(set(brand.name[0].upper() for brand in all_brands if brand.name))
        all_colors = Color.objects.all()
        context['all_brands'] = all_brands.count()
        context['list_brands'] = all_brands.order_by('name')
        context['all_colors'] = all_colors
        context['amount_colors'] = all_colors.count()
        context['alphabet'] = unique_first_letters

        return context


# class ProductListView(ListView):
#     model = Product
#     template_name = 'electron/product_list_test.html'
#     context_object_name = 'products'
#
#     def get(self, request, *args, **kwargs):
#         page_number = request.GET.get('page', 1)
#         per_page = 5
#
#         products = Product.objects.all().order_by('id')
#         paginator = Paginator(products, per_page)
#
#         try:
#             current_page = paginator.page(page_number)
#             print(current_page.object_list)
#         except EmptyPage:
#             return JsonResponse({"error": "Страница не найдена"}, status=404)
#
#         if request.headers.get('x-requested-with') == 'XMLHttpRequest' and request.headers.get(
#                 'X-Infinite-Scroll') == 'true':
#             serialized_products = [{"id": product.id, "name": product.name,
#                                     "brand": product.brand.name, 'image': product.image.url,
#                                     'price': product.price, 'color': product.color.name,
#                                     'slug': product.slug} for product in current_page
#                                    ]
#             return JsonResponse({"products": serialized_products})
#         else:
#             amount_pages = paginator.num_pages
#             amount_pages = [i for i in range(1, int(amount_pages) + 1)]
#             prev_page = current_page.previous_page_number() if current_page.has_previous() else None
#             next_page = current_page.next_page_number() if current_page.has_next() else None
#             return render(request, self.template_name,
#                           {"products": current_page, 'amount_pages': amount_pages, "prev_page": prev_page,
#                            "next_page": next_page})


class BrandSubCategory(ListView):
    model = Brand
    template_name = 'electron/brand_and_sub_category.html'
    context_object_name = 'brand_list'

    def get_queryset(self):
        return Brand.objects.filter(category__slug=self.kwargs['category_slug'])

    def get_context_data(self, **kwargs):
        context = super(BrandSubCategory, self).get_context_data(**kwargs)

        sub_category = SubCategory.objects.filter(category__slug=self.kwargs['category_slug'])
        context['sub_category_list'] = sub_category
        return context


class ProductDetail(DetailView):
    model = Product
    slug_url_kwarg = 'detail_slug'

    context_object_name = 'detail'

    def get_context_data(self, **kwargs):
        context = super(ProductDetail, self).get_context_data(**kwargs)

        context['category_list'] = Category.objects.all()
        return context


class Checkout(TemplateView):
    template_name = 'electron/checkout.html'

    def set_anonymous_user_id(self):
        if self.request.user.is_anonymous:
            self.request.user.id = 0

    def post(self, *args, **kwargs):
        data = self.request.POST
        if self.request.user.is_authenticated:
            user_id = self.request.user.id
            user = User.objects.get(id=user_id)
            order = Order(user_id=user_id, firstname=user.name, lastname=user.last_name,
                          location=data['location'],
                          postOfficeAddress=data['postOfficeAddress'], phone_number=user.phone_number,
                          email=user.email, amount=data['amount'])
            order.save()
        else:
            order = Order(user_id=None, firstname=data['name'], lastname=data['last_name'],
                          location=data['location'],
                          postOfficeAddress=data['postOfficeAddress'], phone_number=data['phone_number'],
                          email=data['email'], amount=data['amount'])
            order.save()

        order_items = json.loads(data['orderItems'])
        for i in order_items:
            product = Product.objects.get(id=i)
            product_id = i
            name = product.name
            price = product.price
            image = product.image
            quantity = order_items[i]['quantity']
            total = price * quantity
            order_item_db = OrderItem(order=order, product_id=product_id, name=name, price=price, image=image,
                                      quantity=quantity,
                                      total=total)
            order_item_db.save()
        return self.get(*args, **kwargs)
