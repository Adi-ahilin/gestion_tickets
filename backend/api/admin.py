from django.contrib import admin
from .models import Comprador, OrdenCompra, Ticket

# ... (Las configuraciones de Comprador y OrdenCompra las puedes dejar igual) ...

@admin.register(Comprador)
class CompradorAdmin(admin.ModelAdmin):
    list_display = ('id', 'nombre', 'apellido', 'email', 'telefono', 'fecha_registro')
    search_fields = ('nombre', 'apellido', 'email')
    ordering = ('-fecha_registro',)

@admin.register(OrdenCompra)
class OrdenCompraAdmin(admin.ModelAdmin):
    list_display = ('id', 'mostrar_comprador', 'total', 'estado', 'fecha_orden')
    list_filter = ('estado', 'fecha_orden')
    search_fields = ('comprador__email', 'comprador__nombre', 'comprador__apellido', 'id')

    def mostrar_comprador(self, obj):
        if obj.comprador:
            return f"{obj.comprador.nombre} {obj.comprador.apellido}"
        return "Sin Comprador"
    mostrar_comprador.short_description = "Comprador"

# --- AQUÍ ESTÁ EL CAMBIO IMPORTANTE ---
@admin.register(Ticket)
class TicketAdmin(admin.ModelAdmin):
    # Agregamos 'telefono_contacto' a la lista de columnas
    list_display = ('id', 'asistente_nombre', 'asistente_apellido', 'telefono_contacto', 'ver_orden', 'estado')
    list_filter = ('estado',)
    # Ahora también podrás buscar tickets escribiendo el número de teléfono
    search_fields = ('asistente_nombre', 'asistente_apellido', 'orden__comprador__telefono')

    # Función puente para traer el teléfono del Comprador
    def telefono_contacto(self, obj):
        # Accedemos: Ticket -> Orden -> Comprador -> Telefono
        return obj.orden.comprador.telefono
    telefono_contacto.short_description = "Teléfono (Comprador)"

    def ver_orden(self, obj):
        return f"Orden {str(obj.orden.id)[:8]}"
    ver_orden.short_description = "Pertenece a Orden"