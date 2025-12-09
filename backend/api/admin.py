from django.contrib import admin
from .models import Comprador, OrdenCompra, Ticket

# Esto hace que aparezcan las tablas en el panel visual
admin.site.register(Comprador)
admin.site.register(OrdenCompra)
admin.site.register(Ticket)
