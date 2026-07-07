from django.urls import path
from .views import health_check, register_user, login_user

urlpatterns = [
    path('status/', health_check, name='health_check'),
    path('register/', register_user, name='register'),
    path('login/', login_user, name='login'),
]