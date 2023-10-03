from django.db import models
from django.conf import settings
from django.urls import reverse

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
