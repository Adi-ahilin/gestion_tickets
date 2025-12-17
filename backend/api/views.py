from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from .models import Comprador, OrdenCompra, Ticket
from .serializers import CrearReservaSerializer, OrdenCompraSerializer
import uuid

# Configuración de Precios
PRECIO_PREVENTA = 4500
PRECIO_GENERAL = 6000
FECHA_FIN_PREVENTA = "2025-12-10" 

@api_view(['POST'])
def crear_orden(request):
    # 1. Validar datos entrantes
    serializer = CrearReservaSerializer(data=request.data)
    
    if not serializer.is_valid():
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    datos = serializer.validated_data
    nombre = datos['nombre']
    apellido = datos['apellido']  # <--- CORRECCIÓN 1: Capturamos el apellido
    email = datos['email']
    telefono = datos['telefono']
    cantidad = datos['cantidad']
    
    # 2. Crear o Actualizar Comprador
    # Esto busca por email. Si existe, actualiza nombre/apellido/teléfono. Si no, lo crea.
    comprador, created = Comprador.objects.update_or_create(
        email=email,
        defaults={
            'nombre': nombre,
            'apellido': apellido, # <--- CORRECCIÓN 2: Guardamos el apellido en la BD
            'telefono': telefono
        }
    )

    # 3. Crear la Orden de Compra
    total_a_pagar = cantidad * PRECIO_PREVENTA 
    
    orden = OrdenCompra.objects.create(
        comprador=comprador,
        total=total_a_pagar,
        estado='PENDIENTE'
    )

    # 4. Crear los Tickets
    for _ in range(cantidad):
        Ticket.objects.create(
            orden=orden,
            codigo_qr_hash=str(uuid.uuid4()),
            asistente_nombre=nombre,
            asistente_apellido=apellido, # <--- CORRECCIÓN 3: El ticket ahora tiene apellido
            estado='VIGENTE'
        )

    # 5. Responder
    return Response({
        'mensaje': 'Orden creada exitosamente',
        'id': orden.id,
        'total': total_a_pagar,
        'cantidad_tickets': cantidad
    }, status=status.HTTP_201_CREATED)

@api_view(['GET'])
def listar_ordenes(request):
    ordenes = OrdenCompra.objects.all().order_by('-id') 
    serializer = OrdenCompraSerializer(ordenes, many=True)
    return Response(serializer.data)

@api_view(['POST'])
def confirmar_pago(request, orden_id):
    try:
        orden = OrdenCompra.objects.get(id=orden_id)
        orden.estado = 'CONFIRMADA'
        orden.save()
        return Response({'mensaje': 'Pago confirmado exitosamente'})
    except OrdenCompra.DoesNotExist:
        return Response({'error': 'Orden no encontrada'}, status=status.HTTP_404_NOT_FOUND)