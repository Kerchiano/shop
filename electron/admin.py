from django.contrib import admin
from .models import Product, Category, Order, OrderItem, SubCategory, Brand, Color, ProductPhoto, Review, UserProfile, \
    WishlistItem


class OrderAdmin(admin.ModelAdmin):
    list_display = (
        "user_id",
        "firstname", "lastname", "email", "phone_number", "location", "postOfficeAddress",
        "amount", "date")


class OrderItemAdmin(admin.ModelAdmin):
    list_display = (
        "get_product_id", "get_order_item_id", "get_order_id", "quantity")

    def get_product_id(self, obj):
        return obj.product_id

    get_product_id.short_description = 'Product ID'

    def get_order_id(self, obj):
        return obj.order.id

    get_order_id.short_description = 'Order ID'

    def get_order_item_id(self, obj):
        return obj.id

    get_order_item_id.short_description = 'Order item ID'


admin.site.register(Product)
admin.site.register(UserProfile)
admin.site.register(WishlistItem)
admin.site.register(Color)
admin.site.register(Review)
admin.site.register(SubCategory)
admin.site.register(Brand)
admin.site.register(Category)
admin.site.register(Order, OrderAdmin)
admin.site.register(OrderItem, OrderItemAdmin)
admin.site.register(ProductPhoto)
