from django.contrib.auth.views import LogoutView
from django.urls import path
from .views import MyLoginView, RegisterView, get_user_data

urlpatterns = [
    path('login/', MyLoginView.as_view(), name='login'),
    path('logout/', LogoutView.as_view(next_page='login'), name='logout'),
    path('register/', RegisterView.as_view(), name='register'),
    path('get_user_data/<int:user_id>/', get_user_data, name='get_user_data'),
]
