from django.db import models
# Importamos el modelo de Usuario que ya trae Django por defecto
# Esto nos sirve para conectar las órdenes con la "Dueña" (Administradora)
from django.contrib.auth.models import User 
import uuid # Librería para generar IDs largos y únicos (ej: 550e8400-e29b...)

# ---------------------------------------------------------
# 1. MODELO COMPRADOR
# Representa a la persona que entra a la web y hace la reserva.
# ---------------------------------------------------------
class Comprador(models.Model):
    nombre = models.CharField(max_length=100)
    apellido = models.CharField(max_length=100)
    # unique=True: Impide que dos personas se registren con el mismo correo.
    email = models.EmailField(unique=True)
    telefono = models.CharField(max_length=20)
    fecha_registro = models.DateTimeField(auto_now_add=True)

    # Esta función define cómo se ve el objeto en el panel de administración.
    # En vez de decir "Comprador object (1)", dirá "Juan Pérez".
    def __str__(self):
        return f"{self.nombre} {self.apellido}"

# ---------------------------------------------------------
# 2. MODELO ORDEN DE COMPRA
# Es la "boleta" o transacción que agrupa los tickets.
# ---------------------------------------------------------
class OrdenCompra(models.Model):
    
    ESTADOS = [
        ('PENDIENTE', 'Pendiente'),     # Recién creada
        ('CONFIRMADA', 'Confirmada'),   # Dueña revisó el banco y aprobó
        ('EXPIRADA', 'Expirada'),       # Pasaron 48h sin pago
    ]

    # Usamos UUID en lugar de ID numérico (1, 2, 3) por seguridad.
    # Así nadie puede adivinar la orden de otra persona cambiando la URL.
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    
    # Relación: Una orden pertenece a un Comprador.
    # on_delete=models.RESTRICT: Si intentas borrar un comprador, Django no te dejará
    # si ese comprador tiene órdenes activas (para proteger el historial de ventas).
    comprador = models.ForeignKey(Comprador, on_delete=models.RESTRICT, related_name='ordenes')
    
    # Relación con la Administradora (User de Django).
    # null=True, blank=True: Significa que este campo es OPCIONAL.
    # Es vital porque cuando el cliente crea la orden, NINGÚN administrador la ha visto aún.
    administrador = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True)
    
    fecha_orden = models.DateTimeField(auto_now_add=True)
    
    # DecimalField es mejor para dinero que Float.
    # decimal_places=0: Porque en Chile no usamos centavos (ej: $4.500).
    total = models.DecimalField(max_digits=10, decimal_places=0)
    
    # Aquí usamos la lista de ESTADOS definida arriba. Por defecto nace 'PENDIENTE'.
    estado = models.CharField(max_length=20, choices=ESTADOS, default='PENDIENTE')
    
    # Fechas opcionales que se llenarán más tarde con lógica del sistema.
    fecha_expiracion = models.DateTimeField(null=True, blank=True)
    fecha_confirmacion = models.DateTimeField(null=True, blank=True)

    def __str__(self):
        # Muestra los primeros 8 caracteres del UUID y el email
        return f"Orden {str(self.id)[:8]} - {self.comprador.email}"

# ---------------------------------------------------------
# 3. MODELO TICKET
# Es la entrada individual. Si una orden tiene 3 entradas, habrá 3 registros aquí.
# ---------------------------------------------------------
class Ticket(models.Model):
    ESTADOS_TICKET = [
        ('VIGENTE', 'Vigente'),     # Listo para usar
        ('UTILIZADO', 'Utilizado'), # Ya pasó por la puerta
        ('ANULADO', 'Anulado'),     # Cancelado por admin
    ]

    # Relación: Un ticket pertenece a una OrdenCompra.
    # on_delete=models.CASCADE: Si borras la Orden, se borran sus Tickets automáticamente.
    orden = models.ForeignKey(OrdenCompra, on_delete=models.CASCADE, related_name='tickets')
    
    # El hash único para el QR. unique=True asegura que no existan dos QRs iguales.
    codigo_qr_hash = models.CharField(max_length=255, unique=True)
    # Datos del asistente real (puede ser distinto al comprador)
    asistente_nombre = models.CharField(max_length=100)
    asistente_apellido = models.CharField(max_length=100)
    estado = models.CharField(max_length=20, choices=ESTADOS_TICKET, default='VIGENTE')
    
    # Se llena solo cuando el Portero escanea el QR.
    fecha_uso = models.DateTimeField(null=True, blank=True)

    def __str__(self):
        # Agregamos el apellido aquí también para que se vea completo en todas partes
        return f"Ticket {self.id} - {self.asistente_nombre} {self.asistente_apellido}"