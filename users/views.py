import json

from django.contrib.auth import authenticate, login
from django.contrib.auth.views import LoginView
from django.contrib.messages.views import SuccessMessageMixin
from django.http import JsonResponse
from django.urls import reverse_lazy
from django.contrib import messages
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_exempt
from django.views.generic import FormView

from electron.models import Category
from users.forms import SignUpForm
from users.models import User


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


@method_decorator(csrf_exempt, name='dispatch')
class MyLoginView(LoginView):

    def post(self, request, *args, **kwargs):
        data = json.loads(request.body)
        print(data)

        email = data.get('email')
        password = data.get('password')

        user = authenticate(request, email=email, password=password)

        if user is not None:
            print('Успешная аутентификация. Информация о пользователе:', user.__dict__)
            login(request, user)

            return JsonResponse({'userId': user.id, 'email': user.email})
        else:
            print('Неудачная аутентификация. Пользователь не найден.')

            return JsonResponse({'error': 'Неверные учетные данные'}, status=401)

    def get_success_url(self):
        return reverse_lazy('home')

    def form_invalid(self, form):
        messages.error(self.request, 'Invalid username or password')
        return self.render_to_response(self.get_context_data(form=form))

    def get_context_data(self, **kwargs):
        context = super(MyLoginView, self).get_context_data(**kwargs)

        context['category_list'] = Category.objects.all()
        return context


class RegisterView(FormView, SuccessMessageMixin):
    template_name = 'registration/register.html'
    form_class = SignUpForm
    success_url = reverse_lazy('login')
    success_message = "%(name)s was created successfully"

    def form_valid(self, form):
        form.save()
        messages.success(self.request, form.cleaned_data['name'] + " successfully created")
        return super(RegisterView, self).form_valid(form)

    def get_context_data(self, **kwargs):
        context = super(RegisterView, self).get_context_data(**kwargs)

        context['category_list'] = Category.objects.all()
        return context
