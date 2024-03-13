from django.db import models
from django.conf import settings
from django.utils import timezone

User = settings.AUTH_USER_MODEL


class Category(models.Model):
    slug = models.SlugField(max_length=255, blank=True, unique=True, db_index=True, verbose_name="URL")
    name = models.CharField(max_length=30)
    icon = models.CharField(max_length=50, blank=True, null=True)

    class Meta:
        verbose_name_plural = 'categories'

    def __str__(self):
        return self.name


class SubCategory(models.Model):
    slug = models.SlugField(max_length=255, blank=True, unique=False, db_index=True, verbose_name="URL")
    category = models.ForeignKey("Category", on_delete=models.CASCADE)
    name = models.CharField(max_length=30, blank=True)
    image = models.ImageField(upload_to='images/', blank=True)

    class Meta:
        verbose_name_plural = 'subcategories'

    def __str__(self):
        return self.name


class Brand(models.Model):
    slug = models.SlugField(max_length=255, blank=True, unique=False, db_index=True, verbose_name="URL")
    name = models.CharField(max_length=30)
    logo = models.ImageField(upload_to='images/', blank=True)
    category = models.ManyToManyField(Category)
    sub_category = models.ManyToManyField(SubCategory, blank=True)

    def __str__(self):
        return self.name


class Color(models.Model):
    name = models.CharField(max_length=50, unique=True)

    def __str__(self):
        return self.name


class ProductPhoto(models.Model):
    image = models.ImageField(upload_to='images/')
    subcategory = models.ForeignKey('SubCategory', null=True, on_delete=models.CASCADE, related_name='photos')

    def __str__(self):
        return f'Photo {self.id}'


class Product(models.Model):
    sub_category = models.ForeignKey("SubCategory", on_delete=models.CASCADE, blank=True, null=True)
    brand = models.ForeignKey("Brand", on_delete=models.CASCADE, blank=True, null=True)
    slug = models.SlugField(max_length=255, blank=True, unique=True, db_index=True, verbose_name="URL")
    name = models.CharField(max_length=30)
    description = models.CharField(max_length=255, blank=True)
    price = models.IntegerField()
    color = models.ForeignKey(Color, on_delete=models.SET_NULL, null=True, blank=True)
    image = models.ImageField(upload_to='images/')
    photos = models.ManyToManyField(ProductPhoto, related_name='products')

    def __str__(self):
        return self.name


class Order(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, null=True, blank=True)
    product = models.ForeignKey(Product, on_delete=models.CASCADE, null=True)
    firstname = models.CharField(max_length=100)
    lastname = models.CharField(max_length=100)
    location = models.CharField(max_length=100)
    postOfficeAddress = models.TextField()
    phone_number = models.CharField(max_length=20, null=True, blank=True)
    email = models.EmailField(max_length=100)
    amount = models.CharField(max_length=100)
    date = models.DateField(auto_now=True)

    def __str__(self):
        return str(self.user)


class OrderItem(models.Model):
    product = models.ForeignKey(Product, on_delete=models.CASCADE, null=True)
    order = models.ForeignKey(Order, on_delete=models.CASCADE)
    quantity = models.CharField(max_length=20)

    def __str__(self):
        return str(self.order)


class Review(models.Model):
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    text = models.TextField()
    rating = models.DecimalField(max_digits=1, decimal_places=0, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f'User pk: {self.user.pk} - Date created review: {self.created_at}'


class UserProfile(models.Model):
    GENDER_CHOICES = [
        ('M', 'Male'),
        ('F', 'Female'),
    ]
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    date_of_birth = models.DateField(blank=True, null=True)
    gender = models.CharField(max_length=1, choices=[('', '')] + GENDER_CHOICES, blank=True)

    def __str__(self):
        return self.user.email


class WishlistItem(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    added_at = models.DateTimeField(default=timezone.now)

    class Meta:
        unique_together = ['user', 'product']
