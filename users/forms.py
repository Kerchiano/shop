from django import forms
from django.contrib.auth.forms import UserCreationForm
from django.contrib.auth.models import User

# from bombastic import settings
#
# User = settings.AUTH_USER_MODEL


class RegisterForm(UserCreationForm):
    email = forms.EmailField(max_length=254)

    class Meta:
        model = User
        fields = ('username',  'email', 'password1', 'password2', )