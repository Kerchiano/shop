import json
from django.views.generic import ListView, TemplateView, DetailView
from electron.models import Product, Categories, Order, OrderItem, Brand, SubCategory

from users.models import User


class Home(TemplateView):
    template_name = 'electron/home.html'

    def get_context_data(self, **kwargs):
        context = super(Home, self).get_context_data(**kwargs)

        context['category_list'] = Categories.objects.all()
        return context


class ProductList(ListView):
    model = Product
    template_name = 'electron/product_list.html'
    context_object_name = 'product_list'

    def get_queryset(self):
        return Product.objects.filter(sub_category__slug=self.kwargs['sub_category'])


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

        context['category_list'] = Categories.objects.all()
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
