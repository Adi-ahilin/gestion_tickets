from django.contrib import admin
from django.urls import path, include # <--- 1. IMPORTANTE: Agrega 'include' aquí

urlpatterns = [
    path('admin/', admin.site.urls),
    
    # 2. AGREGA ESTA LÍNEA:
    # Todo lo que empiece con 'api/' se mandará a tu app api
    path('api/', include('api.urls')), 
]