import random
import string
from electron.models import Category, SubCategory, Brand, Product, Color
from django.core.management.base import BaseCommand
import json

category_data_file_path = 'C:/Users/Kerchiano/bombastic/electron/management/commands/category_data.json'
subcategory_data_file_path = 'C:/Users/Kerchiano/bombastic/electron/management/commands/subcategory_data.json'
subcategory_images_data_file_path = 'C:/Users/Kerchiano/bombastic/electron/management/commands' \
                                    '/subcategory_images_data.json'
brand_data_file_path = 'C:/Users/Kerchiano/bombastic/electron/management/commands/brand_data.json'


def generate_random_string(length):
    characters = string.ascii_letters.upper() + string.digits
    return ''.join(random.choice(characters) for _ in range(length))


class Command(BaseCommand):

    @staticmethod
    def create_colors():
        color_names = ["Red", "Green", "Blue", "Yellow", "Purple", "Orange", "Black", "White", "Gray", "Pink"]

        for color_name in color_names:
            Color.objects.get_or_create(name=color_name)

    def handle(self, *args, **options):
        def load_json_data(file_path):
            with open(file_path, 'r') as json_file:
                data = json.load(json_file)
            return data

        self.create_colors()

        category_data = load_json_data(category_data_file_path)
        subcategory_data = load_json_data(subcategory_data_file_path)
        subcategory_images = load_json_data(subcategory_images_data_file_path)
        brand_data = load_json_data(brand_data_file_path)

        categories = []
        for category_info in category_data:
            category, created = Category.objects.get_or_create(slug=category_info['slug'], name=category_info['name'])
            category.icon = category_info['icon']
            category.save()
            categories.append(category)

        subcategories = {}
        for category in categories:
            subcategory_data_for_category = subcategory_data.get(category.name, [])
            subcategories[category] = []
            for subcategory_info in subcategory_data_for_category:
                subcategory, created = SubCategory.objects.get_or_create(slug=subcategory_info['name'].lower(),
                                                                         category=category,
                                                                         name=subcategory_info['name'])
                subcategory.image = subcategory_info['image']
                subcategory.save()
                subcategories[category].append(subcategory)

        brands = {}

        for brand_info in brand_data:
            brand_name = brand_info['name']
            subcategories_for_brand = brand_info.get('subcategories', [])
            categories_for_brand = brand_info.get('categories', [])

            brand, created = Brand.objects.get_or_create(slug=brand_name.lower(), name=brand_name)
            brand.logo = brand_info['logo']

            brand.sub_category.clear()
            brand.category.clear()

            for subcategory_name in subcategories_for_brand:
                if isinstance(subcategory_name, dict):
                    subcategory_name = subcategory_name['name']

                subcategory_image = subcategory_name.get('image', '') if isinstance(subcategory_name, dict) else ''
                subcategory = SubCategory.objects.filter(name=subcategory_name).first()

                if not subcategory:
                    category_name = brand_name
                    category = Category.objects.get(name=category_name)
                    subcategory = SubCategory.objects.create(slug=subcategory_name.lower(), category=category,
                                                             name=subcategory_name)
                    subcategory.image = subcategory_image
                    subcategory.save()

                brand.sub_category.add(subcategory)

            for category_name in categories_for_brand:
                category = Category.objects.filter(name=category_name).first()
                if category:
                    brand.category.add(category)

            brand.save()

            brands[brand_name] = brand
            print(
                f"Brand '{brand_name}' processed with subcategories: "
                f"{brand.sub_category.all()}, categories: {brand.category.all()}")

        for subcategory_list in subcategories.values():
            for subcategory in subcategory_list:
                images_for_subcategory = subcategory_images.get(subcategory.name, {})
                for brand in brands.values():
                    images_for_brand = images_for_subcategory.get(brand.name, [])

                    if images_for_brand:
                        for i in range(3):
                            product_name = f'{brand.name} {generate_random_string(10)}'
                            product_price = int(random.uniform(2000, 20000))

                            product_image = random.choice(images_for_brand)
                            random_color = Color.objects.order_by('?').first()
                            product_slug = f"{brand.name.lower()}{generate_random_string(10)}"

                            Product.objects.create(slug=product_slug, name=product_name, price=product_price,
                                                   sub_category=subcategory, brand=brand, color=random_color,
                                                   image=product_image)
