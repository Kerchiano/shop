from django.db import models
from django.conf import settings

User = settings.AUTH_USER_MODEL


class Categories(models.Model):
    name = models.CharField(max_length=30)
    slug = models.SlugField(max_length=255, blank=True, unique=True, db_index=True, verbose_name="URL")

    def __str__(self):
        return self.name


class Product(models.Model):
    category = models.ForeignKey("Categories", on_delete=models.CASCADE)
    slug = models.SlugField(max_length=255, blank=True, unique=True, db_index=True, verbose_name="URL")
    name = models.CharField(max_length=30)
    description = models.CharField(max_length=255)
    price = models.IntegerField()
    image = models.ImageField(upload_to='images/')

    def __str__(self):
        return self.name


class Order(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    firstname = models.CharField(max_length=100)
    lastname = models.CharField(max_length=100)
    location = models.CharField(max_length=100)
    postOfficeAddress = models.TextField()
    phone_number = models.IntegerField()
    email = models.EmailField(max_length=100)
    amount = models.CharField(max_length=100)
    date = models.DateField(auto_now=True)

    def __str__(self):
        # return self.user.name
        return self.firstname


class OrderItem(models.Model):
    order = models.ForeignKey(Order, on_delete=models.CASCADE)
    product = models.CharField(max_length=200)
    image = models.ImageField(upload_to='images/')
    quantity = models.CharField(max_length=20)
    price = models.CharField(max_length=50)
    total = models.CharField(max_length=1000)

    def __str__(self):
        # return self.order.user.name
        return self.order.firstname
