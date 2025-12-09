from rest_framework import serializers
from .models import Comprador, OrdenCompra, Ticket

# ---------------------------------------------------------
# 1. SERIALIZADORES DE MODELOS (Salida de datos)
# ---------------------------------------------------------

class CompradorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Comprador
        fields = '__all__'

class TicketSerializer(serializers.ModelSerializer):
    class Meta:
        model = Ticket
        fields = '__all__'

class OrdenCompraSerializer(serializers.ModelSerializer):
    # Anidamos el comprador para que al ver la orden, veamos sus datos completos
    comprador = CompradorSerializer(read_only=True)
    # Anidamos los tickets para verlos dentro de la orden
    tickets = TicketSerializer(many=True, read_only=True)

    class Meta:
        model = OrdenCompra
        fields = '__all__'

# ---------------------------------------------------------
# 2. SERIALIZADOR DE ENTRADA (Validación del Formulario)
# Este no está conectado a la BD directamente.
# Sirve para verificar que los datos que manda Carlos sean correctos.
# ---------------------------------------------------------
class CrearReservaSerializer(serializers.Serializer):
    nombre = serializers.CharField(max_length=100)
    apellido = serializers.CharField(max_length=100)
    email = serializers.EmailField()
    telefono = serializers.CharField(max_length=20)
    cantidad = serializers.IntegerField(min_value=1, max_value=10) # Regla: Máximo 10 tickets