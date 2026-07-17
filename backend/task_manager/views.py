from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth import authenticate
from django.contrib.auth.models import User
from rest_framework.authtoken.models import Token
from .serializers import UserSerializer, RegisterSerializer, ProjectSerializer, TaskSerializer, CommentSerializer
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from .models import Project, Task, Comment
from django.db.models import Q

# Day 1: Health Check
@api_view(['GET'])
@permission_classes([AllowAny])
def health_check(request):
    try:
        return Response({"status": "healthy"})
    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

# Day 2: Register API
@api_view(['POST'])
@permission_classes([AllowAny])
def register_user(request):
    try:
        serializer = RegisterSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            token, created = Token.objects.get_or_create(user=user)
            return Response({
                "user": UserSerializer(user).data,
                "token": token.key
            }, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

# Day 2: Login API
@api_view(['POST'])
@permission_classes([AllowAny])
def login_user(request):
    try:
        username = request.data.get('username')
        password = request.data.get('password')
        
        user = authenticate(username=username, password=password)
        if user is not None:
            token, created = Token.objects.get_or_create(user=user)
            return Response({
                "user": UserSerializer(user).data,
                "token": token.key
            }, status=status.HTTP_200_OK)
            
        return Response({"error": "Invalid Credentials"}, status=status.HTTP_401_UNAUTHORIZED)
    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class ProjectListCreate(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        try:
            # FIX: Show projects they own OR projects where they are assigned a task
            projects = Project.objects.filter(
                Q(owner=request.user) | Q(tasks__assigned_to=request.user)
            ).distinct()
            serializer = ProjectSerializer(projects, many=True)
            return Response(serializer.data)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def post(self, request):
        try:
            serializer = ProjectSerializer(data=request.data)
            if serializer.is_valid():
                serializer.save(owner=request.user)
                return Response(serializer.data, status=status.HTTP_201_CREATED)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class ProjectDetail(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, pk):
        try:
            project = Project.objects.get(pk=pk)
            # FIX: Allow viewing if they own it OR if they have an assigned task in it
            is_owner = project.owner == request.user
            has_task = project.tasks.filter(assigned_to=request.user).exists()
            
            if not is_owner and not has_task:
                return Response({"error": "Unauthorized to view this project"}, status=status.HTTP_403_FORBIDDEN)
            
            serializer = ProjectSerializer(project)
            return Response(serializer.data)
        except Project.DoesNotExist:
            return Response({"error": "Not found"}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
    def delete(self, request, pk):
        try:
            project = Project.objects.get(pk=pk)
            if project.owner != request.user:
                return Response({"error": "You can only delete your own projects"}, status=status.HTTP_403_FORBIDDEN)
                
            project.delete()
            return Response({"message": "Deleted successfully"}, status=status.HTTP_204_NO_CONTENT)
        except Project.DoesNotExist:
            return Response({"error": "Project not found"}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
class UserList(APIView):
    permission_classes = [IsAuthenticated]
    def get(self, request):
        try:
            users = User.objects.all()
            serializer = UserSerializer(users, many=True)
            return Response(serializer.data)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class TaskListCreate(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        try:
            project_id = request.query_params.get('project')
            if project_id:
                project = Project.objects.get(pk=project_id)
                # FIX: Verify they have access to the project
                if project.owner != request.user and not project.tasks.filter(assigned_to=request.user).exists():
                    return Response({"error": "Unauthorized"}, status=status.HTTP_403_FORBIDDEN)
                tasks = Task.objects.filter(project_id=project_id)
            else:
                # FIX: Show tasks they created OR tasks assigned to them
                tasks = Task.objects.filter(
                    Q(project__owner=request.user) | Q(assigned_to=request.user) | Q(created_by=request.user)
                ).distinct()
            serializer = TaskSerializer(tasks, many=True)
            return Response(serializer.data)
        except Project.DoesNotExist:
            return Response({"error": "Project not found"}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def post(self, request):
        try:
            serializer = TaskSerializer(data=request.data)
            if serializer.is_valid():
                serializer.save(created_by=request.user)
                return Response(serializer.data, status=status.HTTP_201_CREATED)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class TaskDetail(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, pk):
        try:
            task = Task.objects.get(pk=pk)
            if task.project.owner != request.user and task.created_by != request.user and task.assigned_to != request.user:
                return Response({"error": "Unauthorized"}, status=status.HTTP_403_FORBIDDEN)
            return Response(TaskSerializer(task).data)
        except Task.DoesNotExist:
            return Response({"error": "Task not found"}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def put(self, request, pk):
        try:
            task = Task.objects.get(pk=pk)

            if task.project.owner != request.user and task.created_by != request.user and task.assigned_to != request.user:
                return Response({"error": "You do not have permission to edit this task."}, status=status.HTTP_403_FORBIDDEN)

            serializer = TaskSerializer(task, data=request.data)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except Task.DoesNotExist:
            return Response({"error": "Task not found"}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def patch(self, request, pk):
        try:
            task = Task.objects.get(pk=pk)
            
            if task.project.owner != request.user and task.created_by != request.user and task.assigned_to != request.user:
                return Response({"error": "You do not have permission to modify this task."}, status=status.HTTP_403_FORBIDDEN)

            serializer = TaskSerializer(task, data=request.data, partial=True)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except Task.DoesNotExist:
            return Response({"error": "Task not found"}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def delete(self, request, pk):
        try:
            task = Task.objects.get(pk=pk)
            
            if task.project.owner != request.user and task.created_by != request.user:
                return Response({"error": "You do not have permission to delete this task."}, status=status.HTTP_403_FORBIDDEN)
                
            task.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)
        except Task.DoesNotExist:
            return Response({"error": "Task not found"}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
class CommentListCreate(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        try:
            task_id = request.query_params.get('task')
            comments = Comment.objects.filter(task_id=task_id) if task_id else Comment.objects.all()
            serializer = CommentSerializer(comments, many=True)
            return Response(serializer.data)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def post(self, request):
        try:
            serializer = CommentSerializer(data=request.data)
            if serializer.is_valid():
                serializer.save(user=request.user)
                return Response(serializer.data, status=status.HTTP_201_CREATED)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
class DashboardStats(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        try:
            # FIX: Advanced filtering so assigned tasks show up on Dashboard!
            projects = Project.objects.filter(Q(owner=request.user) | Q(tasks__assigned_to=request.user)).distinct()
            total_projects = projects.count()

            tasks = Task.objects.filter(Q(project__owner=request.user) | Q(assigned_to=request.user) | Q(created_by=request.user)).distinct()
            total_tasks = tasks.count()
            completed_tasks = tasks.filter(status='Completed').count()
            pending_tasks = total_tasks - completed_tasks

            return Response({
                "total_projects": total_projects,
                "total_tasks": total_tasks,
                "completed_tasks": completed_tasks,
                "pending_tasks": pending_tasks
            }, status=status.HTTP_200_OK)
            
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)