from django.contrib.auth import authenticate, login, update_session_auth_hash, logout
from django.contrib.auth.forms import AuthenticationForm, PasswordChangeForm
from django.contrib.auth.mixins import LoginRequiredMixin
from django.contrib.auth.views import LoginView, LogoutView
from django.db.models import Avg
from django.http import JsonResponse
from django.shortcuts import render
from django.views import View
from django.views.generic import FormView

from electron.forms import ReviewForm
from electron.models import Category, Product, ProductPhoto, Review, SubCategory, UserProfile
from users.forms import SignUpForm
from users.models import User


def my_view(request):
    form = AuthenticationForm
    return render(request, 'electron/base.html', {'form': form})


def get_user_data(request, user_id):
    try:
        user = User.objects.get(pk=user_id)
        user_data = {
            'name': user.name,
            'email': user.email,
            'last_name': user.last_name,
            'phone_number': user.phone_number,
        }
        return JsonResponse(user_data)
    except User.DoesNotExist:
        return JsonResponse({'error': 'Пользователь не найден.'}, status=404)


def get_product_data(request):
    product_name = request.GET.get('productName', '')
    product = Product.objects.filter(name__icontains=product_name).first()
    product_images = ProductPhoto.objects.filter(subcategory=product.sub_category)
    reviews = Review.objects.filter(product=product)
    review_form = ReviewForm()
    review_count = reviews.count()
    average_rating = Review.objects.filter(product=product).aggregate(Avg('rating'))
    return {
        'product_data': product,
        'product_images': product_images,
        'reviews': reviews,
        'review_form': review_form,
        'form': AuthenticationForm,
        'formRegistration': SignUpForm,
        'average_rating': average_rating,
        'review_count': review_count,
    }


class MyLoginView(LoginView):

    def post(self, request, *args, **kwargs):
        email = request.POST.get('username')
        password = request.POST.get('password')

        user = authenticate(request, email=email, password=password)

        if user is not None:
            login(request, user)
            context = get_product_data(request)
            return render(request, 'electron/product_detail_reviews.html', context)
        else:
            return JsonResponse({'success': False, 'message': 'Invalid credentials.'}, status=401)

    def get_context_data(self, **kwargs):
        context = super(MyLoginView, self).get_context_data(**kwargs)
        context['category_list'] = Category.objects.all()
        context['form'] = AuthenticationForm
        context['formRegistration'] = SignUpForm

        return context


class RegisterView(FormView):
    form_class = SignUpForm
    template_name = 'registration/register.html'

    def post(self, request, *args, **kwargs):
        data = request.POST
        form = SignUpForm(data)
        if form.is_valid():
            form.save()
            email = data.get('email')
            password = data.get('password2')
            user = authenticate(request, email=email, password=password)
            login(request, user)
            context = get_product_data(request)
            return render(request, 'electron/product_detail_reviews.html', context)
        else:
            errors = form.errors.as_json()
            return JsonResponse({'success': False, 'errors': errors})

    def get_context_data(self, **kwargs):
        context = super(RegisterView, self).get_context_data(**kwargs)

        context['category_list'] = Category.objects.all()
        context['form'] = AuthenticationForm
        context['formRegistration'] = SignUpForm
        return context


class CustomLogoutView(LogoutView):
    def dispatch(self, request, *args, **kwargs):
        response = super().dispatch(request, *args, **kwargs)
        context = get_product_data(request)
        context['form'] = AuthenticationForm
        context['formRegistration'] = SignUpForm
        return render(request, 'electron/product_detail_reviews.html', context)


class ChangePasswordView(LoginRequiredMixin, View):
    def post(self, request, *args, **kwargs):
        form = PasswordChangeForm(request.user, request.POST)
        if form.is_valid():
            form.save()
            update_session_auth_hash(request, form.user)
            return JsonResponse({'success': True})
        else:
            errors = form.errors
            return JsonResponse({'errors': errors}, status=400)


class DeleteAccountView(View):
    def delete(self, request, *args, **kwargs):
        user = request.user
        user.delete()
        logout(request)
        context = dict()
        context['category_list'] = Category.objects.all()
        context['sub_category_list'] = SubCategory.objects.all()
        context['form'] = AuthenticationForm
        context['formRegistration'] = SignUpForm
        return render(request, 'electron/home.html', context)

    def post(self, request, *args, **kwargs):
        return JsonResponse({'success': False, 'error': 'Метод не разрешен'}, status=405)
