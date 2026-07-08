from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth import authenticate
from django.contrib.auth.models import User
from rest_framework.authtoken.models import Token
from .serializers import UserSerializer, RegisterSerializer
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from .models import Project
from .serializers import ProjectSerializer

# Day 1: Health Check
@api_view(['GET'])
@permission_classes([AllowAny]) # Anyone can check if server is healthy
def health_check(request):
    return Response({"status": "healthy"})

# Day 2: Register API
@api_view(['POST'])
@permission_classes([AllowAny]) # Anyone can register
def register_user(request):
    serializer = RegisterSerializer(data=request.data)
    if serializer.is_valid():
        user = serializer.save()
        token, created = Token.objects.get_or_create(user=user)
        return Response({
            "user": UserSerializer(user).data,
            "token": token.key
        }, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# Day 2: Login API
@api_view(['POST'])
@permission_classes([AllowAny]) # Anyone can try to log in
def login_user(request):
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

class ProjectListCreate(APIView):
    permission_classes = [IsAuthenticated] # Require Token!

    def get(self, request):
        projects = Project.objects.all()
        serializer = ProjectSerializer(projects, many=True)
        return Response(serializer.data)

    def post(self, request):
        serializer = ProjectSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(owner=request.user) # Automatically assign owner!
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class ProjectDetail(APIView):
    permission_classes = [IsAuthenticated]

    def delete(self, request, pk):
        try:
            project = Project.objects.get(pk=pk)
        except Project.DoesNotExist:
            return Response({"error": "Project not found"}, status=status.HTTP_404_NOT_FOUND)
        
        # Security check: Are you the owner?
        if project.owner != request.user:
            return Response({"error": "You can only delete your own projects"}, status=status.HTTP_403_FORBIDDEN)
            
        project.delete()
        return Response({"message": "Deleted successfully"}, status=status.HTTP_204_NO_CONTENT)