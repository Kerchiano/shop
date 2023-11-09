from django import forms

from .models import Order, OrderItem


class OrderForm(forms.ModelForm):
    class Meta:
        model = Order
        fields = ('user', 'firstname', 'lastname', 'location', 'postOfficeAddress', 'phone_number', 'email', 'amount',)

    def __str__(self):
        return self.firstname


class OrderItemForm(forms.ModelForm):
    class Meta:
        model = OrderItem
        fields = ('order', 'product', 'image', 'quantity', 'price', 'total',)

    def __str__(self):
        return self.order.firstname
