from django.contrib import admin
from .models import Product, Categories, Order, OrderItem

admin.site.register(Product)
admin.site.register(Categories)
admin.site.register(Order)
admin.site.register(OrderItem)
