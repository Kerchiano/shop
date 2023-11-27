# from electron.models import SubCategory, Product
# from django.db import IntegrityError
# import random
#
# sub_category = [
#     'Геймерские кресла',
#     'Геймерские мониторы',
#     'Игры',
#     'Игровые компьютеры',
#     'Игровые ноутбуки',
#     'Игровые приставки',
#     'Повербанки и зарядные станции',
#     'Планшеты',
#     'Телевизоры',
#     'Мобильные телефоны',
#     'Кабели и переходники',
#     'Планшеты',
#     'Gaming',
#     'Мониторы',
#     'Компьютеры',
#     'Ноутбуки'
# ]
#
#
# def generate_fake_product():
#     sub_category = SubCategory.objects.first()  # Замените на вашу логику выбора подкатегории
#     return {
#         'sub_category': sub_category,
#         'slug': fake.unique.word(),
#         'name': fake.word(),
#         'description': fake.text(),
#         'price': round(random.uniform(10, 100), 2),
#         'image': 'путь/к/изображению.jpg',
#     }
#
#
# # Создание 10 случайных продуктов
# for _ in range(10):
#     product_data = generate_fake_product()
#     try:
#         Product.objects.create(**product_data)
#         print(f"Продукт '{product_data['name']}' успешно добавлен.")
#     except IntegrityError:
#         print(f"Продукт '{product_data['name']}' уже существует. Пропуск.")
#
# print("Генерация продуктов завершена.")
