import json
from django.contrib import messages
from django.views.generic import ListView, TemplateView, DetailView
from electron.models import Product, Categories, Order, OrderItem

from users.models import User


class Home(TemplateView):
    template_name = 'electron/home.html'

    def get_context_data(self, **kwargs):
        context = super(Home, self).get_context_data(**kwargs)

        context['category_list'] = Categories.objects.all()
        return context


class ProductList(ListView):
    model = Product

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


class Checkout(TemplateView):
    template_name = 'electron/checkout.html'

    def post(self, *args, **kwargs):
        user_id = self.request.user.id
        # if self.request.user.is_authenticated:
        # user_id = self.request.user.id
        # else:
        #     user_id = 'Anon'

        data = self.request.POST
        orderItems = json.loads(data['orderItems'])

        order = Order(user_id=user_id, firstname=data['firstname'], lastname=data['lastname'],
                      location=data['location'],
                      postOfficeAddress=data['postOfficeAddress'], phone_number=data['phone_number'],
                      email=data['email'], amount=data['amount'])
        order.save()
        for i in orderItems:
            name = orderItems[i]['name']
            price = orderItems[i]['price']
            image = orderItems[i]['image'][6:]
            quantity = orderItems[i]['quantity']
            total = price * quantity
            orderItemsDB = OrderItem(order=order, product=name, price=price, image=image, quantity=quantity,
                                     total=total)
            orderItemsDB.save()
        return self.get(*args, **kwargs)

    # def form_valid(self, form):
    #     form.save()
    #     messages.success(self.request, form.cleaned_data['name'] + " successfully created")
    #     return super(Checkout, self).form_valid(form)
