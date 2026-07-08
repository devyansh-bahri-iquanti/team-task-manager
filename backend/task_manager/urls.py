from django.urls import path
from .views import health_check, register_user, login_user, ProjectListCreate, ProjectDetail

urlpatterns = [
    path('status/', health_check, name='health_check'),
    path('register/', register_user, name='register'),
    path('login/', login_user, name='login'),
    
    # Day 3 URLs
    path('projects/', ProjectListCreate.as_view(), name='project_list_create'),
    path('projects/<int:pk>/', ProjectDetail.as_view(), name='project_detail'),
]