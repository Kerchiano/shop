from django.conf import settings
from django.conf.urls.static import static
from django.urls import path

from users.views import my_view
from .models import WishlistItem
from .views import Home, ProductDetail, Checkout, BrandSubCategory, ProductList, Search, SearchProducts, \
    ProductDetailReview, ProductDetailPhoto, UserProfileDetailView, UserReviewsListView, AddToWishlistView, \
    WishlistListView

urlpatterns = [
    path('', Home.as_view(), name='home'),
    path('base/', my_view, name='base'),
    path('category/<slug:category_slug>/', BrandSubCategory.as_view(), name='category'),
    path('sub_category/<slug:sub_category>/', ProductList.as_view(), name='sub_category'),
    path('detail/<slug:detail_slug>/', ProductDetail.as_view(), name='detail'),
    path('detail/<slug:detail_slug>/reviews', ProductDetailReview.as_view(), name='detail_reviews'),
    path('detail/<slug:detail_slug>/photo/', ProductDetailPhoto.as_view(), name='detail_photo'),
    path('search/', Search.as_view(), name='search'),
    path('search_products/', SearchProducts.as_view(), name='search_products'),
    path('checkout', Checkout.as_view(), name='checkout'),
    path('cabinet/personal-information', UserProfileDetailView.as_view(), name='personal-information'),
    path('cabinet/reviews', UserReviewsListView.as_view(), name='user_reviews'),
    path('cabinet/wishlist', WishlistListView.as_view(), name='user_wishlist'),
    path('wishlist/remove-selected/', WishlistListView.as_view(), name='remove_selected_items'),
    path('wishlist/add/', AddToWishlistView.as_view(), name='add_to_wishlist'),
]

if settings.DEBUG:
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
