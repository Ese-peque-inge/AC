#!/usr/bin/env python
"""
Script para crear un superusuario administrador en el sistema.
Ejecutar con: python manage.py shell < scripts/crear_superusuario.py
"""

from usuarios.models import Usuario
from django.contrib.auth.hashers import make_password

# Datos del administrador
username = "admin"
password = "admin123"  # CAMBIAR ESTA CONTRASEÑA EN PRODUCCIÓN
email = "admin@academiamusica.com"
nombre_completo = "Administrador Sistema"

# Verificar si ya existe
if Usuario.objects.filter(username=username).exists():
    print(f"⚠️  El usuario '{username}' ya existe.")
    admin = Usuario.objects.get(username=username)
else:
    # Crear superusuario
    admin = Usuario.objects.create(
        username=username,
        email=email,
        password=make_password(password),
        nombre_completo=nombre_completo,
        rol='Administrador',
        is_staff=True,
        is_superuser=True,
        is_active=True
    )
    print(f"✅ Superusuario '{username}' creado exitosamente!")

print("\n" + "="*50)
print("CREDENCIALES DE ADMINISTRADOR:")
print("="*50)
print(f"Username: {username}")
print(f"Password: {password}")
print(f"Rol: {admin.rol}")
print("="*50)
print("\n⚠️  IMPORTANTE: Cambia la contraseña después del primer login!")
