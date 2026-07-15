from django.urls import path
from .views import health_check, register_user, login_user, ProjectListCreate, ProjectDetail, TaskListCreate, TaskDetail, UserList, CommentListCreate, DashboardStats

urlpatterns = [
    path('status/', health_check, name='health_check'),
    path('register/', register_user, name='register'),
    path('login/', login_user, name='login'),
    
    # Day 3 URLs
    path('projects/', ProjectListCreate.as_view(), name='project_list_create'),
    path('projects/<int:pk>/', ProjectDetail.as_view(), name='project_detail'),

    # Day 4
    path('users/', UserList.as_view(), name='user_list'),
    path('tasks/', TaskListCreate.as_view(), name='task_list_create'),
    path('tasks/<int:pk>/', TaskDetail.as_view(), name='task_detail'),

    path('comments/', CommentListCreate.as_view(), name='comment_list_create'),

    path('dashboard/', DashboardStats.as_view(), name='dashboard_stats'),
] 