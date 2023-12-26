from django.urls import path
from .views import Home, ProductDetail, Checkout, BrandSubCategory, ProductList

urlpatterns = [
    path('', Home.as_view(), name='home'),
    path('category/<slug:category_slug>/', BrandSubCategory.as_view(), name='category'),
    path('sub_category/<slug:sub_category>/', ProductList.as_view(), name='sub_category'),
    path('detail/<slug:detail_slug>/', ProductDetail.as_view(), name='detail'),
    # path('products/', ProductListView.as_view(), name='product-list'),
    path('checkout', Checkout.as_view(), name='checkout')
]

# if settings.DEBUG:
#     urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
