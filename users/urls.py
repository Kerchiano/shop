from django.urls import path
from .views import MyLoginView, RegisterView, get_user_data, CustomLogoutView, ChangePasswordView, DeleteAccountView

urlpatterns = [
    path('login/', MyLoginView.as_view(), name='login'),
    path('logout/', CustomLogoutView.as_view(next_page='login'), name='logout'),
    path('register/', RegisterView.as_view(), name='register'),
    path('change-password/', ChangePasswordView.as_view(), name='change_password'),
    path('delete-account/', DeleteAccountView.as_view(), name='delete_account'),
    path('get_user_data/<int:user_id>/', get_user_data, name='get_user_data'),
]
