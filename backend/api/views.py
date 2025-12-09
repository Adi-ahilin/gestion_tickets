from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from .models import Comprador, OrdenCompra, Ticket
from .serializers import CrearReservaSerializer, OrdenCompraSerializer
import uuid

# Configuración de Precios (Podrías mover esto a variables de entorno luego)
PRECIO_PREVENTA = 4500
PRECIO_GENERAL = 6000
FECHA_FIN_PREVENTA = "2025-12-10" # Ejemplo

@api_view(['POST']) # Solo permitimos enviar datos (POST), no leer (GET)
def crear_orden(request):
    # 1. Pasamos los datos de Carlos por el "Portero" (Serializer)
    serializer = CrearReservaSerializer(data=request.data)
    
    # 2. Si los datos están mal (ej: email inválido), devolvemos error al tiro
    if not serializer.is_valid():
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    # 3. Si todo está bien, extraemos los datos limpios
    datos = serializer.validated_data
    cantidad = datos['cantidad']
    
    # ---------------------------------------------------
    # LÓGICA DE NEGOCIO (Cálculos)
    # ---------------------------------------------------
    
    # Aquí podríamos comparar fechas real, por ahora usaremos precio preventa fijo
    # para el PMV Sprint 1.
    precio_unitario = PRECIO_PREVENTA 
    total_a_pagar = precio_unitario * cantidad

    try:
        # 4. Crear o buscar el Comprador
        # get_or_create sirve por si el cliente ya compró antes, no duplicarlo
        comprador, created = Comprador.objects.get_or_create(
            email=datos['email'],
            defaults={
                'nombre': datos['nombre'],
                'apellido': datos['apellido'],
                'telefono': datos['telefono']
            }
        )

        # 5. Crear la Orden de Compra
        orden = OrdenCompra.objects.create(
            comprador=comprador,
            total=total_a_pagar,
            estado='PENDIENTE'
        )

        # 6. Crear los Tickets (Bucle según cantidad)
        for i in range(cantidad):
            Ticket.objects.create(
                orden=orden,
                asistente_nombre=datos['nombre'], # Por defecto ponemos el nombre del comprador
                asistente_apellido=datos['apellido'],
                # Generamos un hash único combinando el ID de la orden y el número de ticket
                codigo_qr_hash=str(uuid.uuid4()) 
            )

        # 7. Respuesta Exitosa
        # Devolvemos la orden creada usando el Serializador de Salida
        orden_serializada = OrdenCompraSerializer(orden)
        
        return Response({
            "mensaje": "Orden creada exitosamente",
            "datos": orden_serializada.data
        }, status=status.HTTP_201_CREATED)

    except Exception as e:
        # Si algo falla en la base de datos (ej: base de datos caída)
        return Response(
            {"error": str(e)}, 
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )
    # --- Agrega esto al final de backend/api/views.py ---

@api_view(['GET'])
def listar_ordenes(request):
    # Traemos todas las órdenes, las más nuevas primero
    ordenes = OrdenCompra.objects.all().order_by('-id') 
    serializer = OrdenCompraSerializer(ordenes, many=True)
    return Response(serializer.data)

@api_view(['POST'])
def confirmar_pago(request, orden_id):
    try:
        # Buscamos la orden por su ID
        orden = OrdenCompra.objects.get(id=orden_id)
        orden.estado = 'CONFIRMADA' # Asegúrate que este string coincida con tus modelos
        orden.save()
        return Response({'mensaje': 'Pago confirmado exitosamente'})
    except OrdenCompra.DoesNotExist:
        return Response({'error': 'Orden no encontrada'}, status=status.HTTP_404_NOT_FOUND)
    
# --- Pega esto al final de backend/api/views.py ---

@api_view(['GET'])
def listar_ordenes(request):
    # Trae todas las órdenes, las más nuevas primero
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