from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth import authenticate
from django.contrib.auth.models import User
from rest_framework.authtoken.models import Token
from .serializers import UserSerializer, RegisterSerializer

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