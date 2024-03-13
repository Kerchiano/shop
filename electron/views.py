import json
import logging
import urllib
from urllib.parse import unquote

from django.contrib.auth.forms import AuthenticationForm, PasswordChangeForm
from django.contrib.auth.mixins import LoginRequiredMixin
from django.core.paginator import Paginator, EmptyPage, PageNotAnInteger
from django.db.models import Avg
from django.http import JsonResponse
from django.shortcuts import render, redirect
from django.urls import reverse_lazy
from django.views import View
from django.views.generic import ListView, TemplateView, DetailView

from electron.forms import ReviewForm, UserProfileForm, OrderForm
from electron.models import Product, Category, Order, OrderItem, Brand, SubCategory, Color, ProductPhoto, Review, \
    UserProfile, WishlistItem
from users.forms import SignUpForm

from users.models import User

logger = logging.getLogger(__name__)


class Home(TemplateView):
    template_name = 'electron/home.html'

    def get(self, request, *args, **kwargs):
        context = dict()
        context['form'] = AuthenticationForm
        context['formRegistration'] = SignUpForm
        context['category_list'] = Category.objects.all()
        sub_category = SubCategory.objects.all()
        context['sub_category_list'] = sub_category
        return render(request, self.template_name, context)


class ProductList(ListView):
    model = Product
    template_name = 'electron/product_list.html'
    context_object_name = 'products'

    def get_queryset(self):
        sub_category_slug = self.kwargs['sub_category']
        products = Product.objects.filter(sub_category__slug=sub_category_slug).order_by('id')

        filters_json = self.request.GET.get('filters', '{}')
        filters = json.loads(filters_json)
        brand = filters.get('brand', [])
        if brand:
            products = products.filter(brand__name__in=brand)

        color = filters.get('color', [])
        if color:
            products = products.filter(color__name__in=color)

        min_price = filters.get('priceMin', [])
        max_price = filters.get('priceMax', [])
        if min_price and max_price:
            products = products.filter(price__range=(min_price, max_price))

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
                                    'slug': product.slug,
                                    'count_like': WishlistItem.objects.filter(product=product).count()} for product in
                                   current_page
                                   ]
            return JsonResponse({"products": serialized_products, "amount_pages": paginator.num_pages})
        else:
            amount_pages = paginator.num_pages
            amount_pages = [i for i in range(1, int(amount_pages) + 1)]
            prev_page = current_page.previous_page_number() if current_page.has_previous() else None
            next_page = current_page.next_page_number() if current_page.has_next() else None
            products_with_likes = [(product, WishlistItem.objects.filter(product=product).count()) for product in
                                   current_page]
            context.update({"products_with_likes": products_with_likes, 'amount_pages': amount_pages,
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
        context['form'] = AuthenticationForm
        context['formRegistration'] = SignUpForm
        context['category_list'] = Category.objects.all()
        sub_category = SubCategory.objects.all()
        context['sub_category_list'] = sub_category

        return context


class Search(View):

    def get(self, request, *args, **kwargs):
        query = request.GET.get('query', '')

        if query:
            products = Product.objects.filter(name__icontains=query)[:10]
            results = [{'id': product.id, 'name': product.name, 'slug': product.slug} for product in products]
        else:
            results = []

        return JsonResponse({'results': results})


class SearchProducts(TemplateView):
    model = Product
    template_name = 'electron/search_page.html'

    def get(self, request, *args, **kwargs):
        page_number = request.GET.get('page', 1)
        per_page = 5
        query = request.GET.get('query', '')
        if query:
            filters_json = self.request.GET.get('filters', '')
            filters = json.loads(filters_json) if filters_json else {}
            price = filters.get('price', [])
            price = price if len(price) != 0 else [1550, 59809]
            products = Product.objects.filter(name__icontains=query).filter(price__range=(price[0], price[1]))
            paginator = Paginator(products, per_page)
            try:
                current_page = paginator.page(page_number)
                print(current_page.object_list)
            except EmptyPage:
                return JsonResponse({"error": "Страница не найдена"}, status=404)
            results = current_page
            amount_pages = paginator.num_pages
            amount_pages = [i for i in range(1, int(amount_pages) + 1)]
            prev_page = current_page.previous_page_number() if current_page.has_previous() else None
            next_page = current_page.next_page_number() if current_page.has_next() else None
            context = {'products': results, 'current_page': current_page.number, 'amount_pages': amount_pages,
                       "prev_page": prev_page, "next_page": next_page, 'form': AuthenticationForm,
                       'formRegistration': SignUpForm}
        else:
            results = {'form': AuthenticationForm,
                       'formRegistration': SignUpForm,
                       'category_list': Category.objects.all(),
                       'sub_category_list': SubCategory.objects.all()
                       }
            context = results
        return render(request, self.template_name, context)


class BrandSubCategory(ListView):
    model = Brand
    template_name = 'electron/brand_and_sub_category.html'
    context_object_name = 'brand_list'

    def get_queryset(self):
        return Brand.objects.filter(category__slug=self.kwargs['category_slug'])

    def get_context_data(self, **kwargs):
        context = super(BrandSubCategory, self).get_context_data(**kwargs)

        sub_category = SubCategory.objects.filter(category__slug=self.kwargs['category_slug'])
        context['current_sub_category_list'] = sub_category
        context['form'] = AuthenticationForm
        context['formRegistration'] = SignUpForm
        context['category_list'] = Category.objects.all()
        sub_category_catalog = SubCategory.objects.all()
        context['sub_category_list'] = sub_category_catalog
        return context


class Checkout(TemplateView):
    template_name = 'electron/checkout.html'

    def post(self, request, *args, **kwargs):
        data = request.POST
        form_data = {i.split('=')[0]: unquote(i.split('=')[1]) for i in data.get('formData', []).split('&')}
        order_detail = json.loads(data.get('order'))
        order = {**form_data, **order_detail}
        order_items = order.get('orderItems', '')
        del order['orderItems']

        if request.user.is_authenticated:
            order['user'] = request.user.id
        else:
            pass

        form = OrderForm(order)
        order = form.save()

        for i in order_items:
            product = Product.objects.get(id=i)
            quantity = order_items[i]['quantity']
            order_item = OrderItem(order=order, product=product,
                                   quantity=quantity)
            order_item.save()

        return render(request, self.template_name, {})


class ProductDetail(DetailView):
    model = Product
    template_name = 'electron/product_detail.html'
    slug_url_kwarg = 'detail_slug'
    context_object_name = 'product_data'

    def get(self, request, *args, **kwargs):
        product_name = request.GET.get('productName', '')
        product = Product.objects.filter(name__icontains=product_name).first()
        product_images = ProductPhoto.objects.filter(subcategory=product.sub_category)
        count_Like = WishlistItem.objects.filter(product_id=product.id).count()
        return render(request, self.template_name, {
            'product_data': product,
            'product_images': product_images,
            'category_list': Category.objects.all(),
            'sub_category_list': SubCategory.objects.all(),
            'form': AuthenticationForm,
            'formRegistration': SignUpForm,
            'count_Like': count_Like
        })


class ProductDetailReview(DetailView):
    model = Product
    template_name = 'electron/product_detail_reviews.html'
    slug_url_kwarg = 'detail_slug'
    context_object_name = 'product_data'

    @staticmethod
    def get_product_data(product):
        product_images = ProductPhoto.objects.filter(subcategory=product.sub_category)
        reviews = Review.objects.filter(product=product).order_by('-created_at')
        review_form = ReviewForm()
        authentication_form = AuthenticationForm()
        sign_up_form = SignUpForm()
        review_count = Review.objects.filter(product=product).count()
        average_rating = Review.objects.filter(product=product).aggregate(Avg('rating'))
        count_Like = WishlistItem.objects.filter(product_id=product.id).count()
        return {
            'product_data': product,
            'product_images': product_images,
            'reviews': reviews,
            'review_form': review_form,
            'form': authentication_form,
            'formRegistration': sign_up_form,
            'average_rating': average_rating,
            'review_count': review_count,
            'category_list': Category.objects.all(),
            'sub_category_list': SubCategory.objects.all(),
            'count_Like': count_Like
        }

    def get(self, request, *args, **kwargs):
        product_name = request.GET.get('productName', '')
        product = Product.objects.filter(name__icontains=product_name).first()
        context = self.get_product_data(product)
        return render(request, self.template_name, context)

    def post(self, request, *args, **kwargs):
        product_id = request.POST.get('product', '')
        product = Product.objects.filter(id=product_id).first()
        form = ReviewForm(request.POST)
        context = self.get_product_data(product)
        context['success'] = 400
        if form.is_valid():
            context['success'] = 200
            review = form.save(commit=False)
            review.user = request.user
            review.save()
            return render(request, self.template_name, context)

        return render(request, self.template_name, context)


class ProductDetailPhoto(DetailView):
    model = Product
    template_name = 'electron/product_detail_photo.html'
    slug_url_kwarg = 'detail_slug'
    context_object_name = 'product_data'

    def get(self, request, *args, **kwargs):
        product_name = request.GET.get('productName', '')
        product = Product.objects.filter(name__icontains=product_name).first()
        product_images = ProductPhoto.objects.filter(subcategory=product.sub_category)
        count_Like = WishlistItem.objects.filter(product_id=product.id).count()
        return render(request, self.template_name, {
            'product_data': product,
            'product_images': product_images,
            'category_list': Category.objects.all(),
            'sub_category_list': SubCategory.objects.all(),
            'form': AuthenticationForm,
            'formRegistration': SignUpForm,
            'count_Like': count_Like
        })


class UserProfileDetailView(DetailView):
    model = UserProfile
    template_name = 'electron/user_profile.html'
    context_object_name = 'user_profile'

    def get_object(self, queryset=None):
        if not self.request.user.is_authenticated:
            return redirect(reverse_lazy('login'))
        return self.request.user.userprofile

    def post(self, request):
        if self.request.user.is_authenticated and hasattr(self.request.user, 'userprofile'):
            user_profile = self.request.user.userprofile

            data = self.request.POST.dict()

            for field_name, field_value in data.items():
                if hasattr(user_profile, field_name):
                    setattr(user_profile, field_name, field_value)

            user_profile.save()

            for field_name, field_value in data.items():
                if hasattr(self.request.user, field_name):
                    setattr(self.request.user, field_name, field_value)
            self.request.user.save()

            return render(request, self.template_name, context={'user_profile': self.request.user.userprofile})
        else:
            return JsonResponse({'error': 'Authentication required'}, status=401)

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['changePasswordForm'] = PasswordChangeForm(user=self.request.user)
        context['category_list'] = Category.objects.all()
        context['sub_category_list'] = SubCategory.objects.all()
        context['UserProfileForm'] = UserProfileForm
        return context


class UserReviewsListView(ListView):
    model = Review
    template_name = 'electron/user_reviews_list.html'
    context_object_name = 'user_reviews'
    paginate_by = 3

    def get_queryset(self):
        return Review.objects.filter(user=self.request.user)

    def get(self, request, *args, **kwargs):
        reviews = self.get_queryset()
        paginator = Paginator(reviews, self.paginate_by)
        page_number = request.GET.get('page')

        try:
            page_obj = paginator.page(page_number)
        except PageNotAnInteger:
            page_obj = paginator.page(1)
        except EmptyPage:
            page_obj = paginator.page(paginator.num_pages)

        if request.headers.get('x-requested-with') == 'XMLHttpRequest':
            context = {'user_reviews': page_obj}
            return render(request, self.template_name, context)
        else:
            context = {'user_reviews': page_obj, 'category_list': Category.objects.all(),
                       'sub_category_list': SubCategory.objects.all(),
                       'changePasswordForm': PasswordChangeForm(user=self.request.user)}
            return render(request, self.template_name, context)


class AddToWishlistView(View):
    def post(self, request):
        user = request.user
        product_id = request.POST.get('product_id')

        try:
            wishlist_item = WishlistItem.objects.get(user=user, product_id=product_id)
            wishlist_item.delete()
            created = False
        except WishlistItem.DoesNotExist:
            WishlistItem.objects.create(user=user, product_id=product_id)
            created = True

        count = WishlistItem.objects.filter(product_id=product_id).count()

        return JsonResponse({'count': count, 'created': created})


class WishlistListView(ListView):
    model = WishlistItem
    template_name = 'electron/user_wishlist.html'
    context_object_name = 'wishlist'

    def get_queryset(self):
        return WishlistItem.objects.filter(user=self.request.user)

    def delete(self, request):
        if request.method == 'DELETE':
            decoded_data = urllib.parse.unquote(request.body.decode('utf-8'))
            data_dict = {}

            for item in decoded_data.split('&'):
                key, value = item.split('=')
                if key not in data_dict:
                    data_dict[key] = []
                data_dict[key].append(value)

            selected_items = data_dict.get('selected_items[]', [])
            WishlistItem.objects.filter(product_id__in=selected_items).delete()

            return JsonResponse({'success': True})
        else:
            return JsonResponse({'error': 'Invalid request method'}, status=400)

    def get(self, request, *args, **kwargs):
        context = dict()
        context['wishlist'] = WishlistItem.objects.filter(user=self.request.user)
        context['changePasswordForm'] = PasswordChangeForm(user=self.request.user)
        return render(request, self.template_name, context)

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['category_list'] = Category.objects.all()
        context['sub_category_list'] = SubCategory.objects.all()
        return context
