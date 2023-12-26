# from django.core.management.base import BaseCommand
# from django.db import connection
#
#
# class Command(BaseCommand):
#     help = 'Clears the Order table and resets migrations.'
#
#     def handle(self, *args, **options):
#         with connection.cursor() as cursor:
#             cursor.execute("DELETE FROM electron_orderitem;")
#             cursor.execute("DELETE FROM electron_order;")
#
#             cursor.execute("DELETE FROM sqlite_sequence WHERE name='electron_order';")
#             cursor.execute("DELETE FROM sqlite_sequence WHERE name='electron_orderitem';")
#
#         self.stdout.write(self.style.SUCCESS('Successfully cleared and reset the Order table ID sequence.'))
