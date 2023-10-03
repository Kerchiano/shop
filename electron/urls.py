from django.urls import path
from .views import Home, ProductList, ProductDetail

urlpatterns = [
    path('', Home.as_view(), name='home'),
    path('category/<slug:category_slug>/', ProductList.as_view(), name='category'),
    path('detail/<slug:detail_slug>/', ProductDetail.as_view(), name='detail'),
]
