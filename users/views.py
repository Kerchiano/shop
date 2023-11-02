from django.contrib.auth.views import LoginView
from django.contrib.messages.views import SuccessMessageMixin
from django.urls import reverse_lazy
from django.contrib import messages
from django.views.generic import FormView

from electron.models import Categories
from users.forms import SignUpForm


class MyLoginView(LoginView):

    def get_success_url(self):
        return reverse_lazy('home')

    def form_invalid(self, form):
        messages.error(self.request, 'Invalid username or password')
        return self.render_to_response(self.get_context_data(form=form))

    def get_context_data(self, **kwargs):
        context = super(MyLoginView, self).get_context_data(**kwargs)

        context['category_list'] = Categories.objects.all()
        return context


class RegisterView(FormView, SuccessMessageMixin):
    template_name = 'registration/register.html'
    form_class = SignUpForm
    success_url = reverse_lazy('login')
    success_message = "%(name)s was created successfully"

    def form_valid(self, form):
        form.save()
        # user = form.save()
        # if user:
        #     login(self.request, user)
        messages.success(self.request, form.cleaned_data['name'] + " successfully created")
        return super(RegisterView, self).form_valid(form)

    def get_context_data(self, **kwargs):
        context = super(RegisterView, self).get_context_data(**kwargs)

        context['category_list'] = Categories.objects.all()
        return context
