from django.urls import path
from .views import crear_orden

urlpatterns = [
    # Cuando alguien entre a '.../api/reservar/', ejecutamos la función crear_orden
    path('reservar/', crear_orden, name='crear_orden'),
]