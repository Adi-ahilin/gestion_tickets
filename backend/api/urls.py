from django.urls import path
# IMPORTANTE: Agregamos listar_ordenes y confirmar_pago aquí abajo 👇
from .views import crear_orden, listar_ordenes, confirmar_pago 

urlpatterns = [
    path('reservar/', crear_orden, name='crear_orden'),
    
    # --- NUEVAS RUTAS ---
    path('ordenes/', listar_ordenes, name='listar_ordenes'),
    path('ordenes/<str:orden_id>/confirmar/', confirmar_pago, name='confirmar_pago'),
]