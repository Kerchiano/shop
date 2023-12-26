from django.contrib import admin
from .models import Product, Category, Order, OrderItem, SubCategory, Brand, Color


class OrderAdmin(admin.ModelAdmin):
    list_display = (
        "id", "get_user_id", "firstname", "lastname", "email", "phone_number", "location", "postOfficeAddress",
        "amount", "date")
    ordering = ('id',)

    def get_user_id(self, obj):
        return obj.user_id or 0

    get_user_id.short_description = 'User ID'


class OrderItemAdmin(admin.ModelAdmin):
    list_display = (
        "id", 'get_order_id', "get_product_id", "name", "image", "quantity", "price", "total")
    ordering = ('id',)

    def get_product_id(self, obj):
        return obj.product_id

    get_product_id.short_description = 'Product ID'

    def get_order_id(self, obj):
        return obj.order.id

    get_order_id.short_description = 'Order ID'


admin.site.register(Product)
admin.site.register(Color)
admin.site.register(SubCategory)
admin.site.register(Brand)
admin.site.register(Category)
admin.site.register(Order, OrderAdmin)
admin.site.register(OrderItem, OrderItemAdmin)
