from django import forms

from .models import Order, OrderItem, Review, UserProfile


class OrderForm(forms.ModelForm):
    class Meta:
        model = Order
        fields = (
            'user',
            'firstname',
            'lastname',
            'location',
            'postOfficeAddress',
            'phone_number',
            'email',
            'amount'
        )

    def __str__(self):
        return self.firstname


class OrderItemForm(forms.ModelForm):
    class Meta:
        model = OrderItem
        fields = ('order', 'product', 'quantity')

    def __str__(self):
        return self.order.firstname


class ReviewForm(forms.ModelForm):
    class Meta:
        model = Review
        fields = ['product', 'text', 'rating']
        labels = {
            'product': 'Product name',
            'text': 'Review',
            'rating': 'Rating',
        }

    text = forms.CharField(required=False, widget=forms.Textarea)

    def clean_text(self):
        text = self.cleaned_data.get('text')
        if not text:
            raise forms.ValidationError("This field cannot be empty")
        return text


class UserProfileForm(forms.ModelForm):
    class Meta:
        model = UserProfile
        fields = ['date_of_birth', 'gender']
        widgets = {
            'date_of_birth': forms.DateInput(attrs={'type': 'date'}),
            'gender': forms.Select(choices=UserProfile.GENDER_CHOICES)
        }
