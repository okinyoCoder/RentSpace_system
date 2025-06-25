from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .serializers import UserSerializer
from django.contrib.auth import authenticate, logout
from django.contrib.auth import get_user_model
from django.core.validators import validate_email
from django.core.exceptions import ValidationError

User = get_user_model()


class RegisterView(APIView):
    """User registration views"""
    def post(self, request):
        serializer = UserSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
class LoginView(APIView):
    """user login views"""
    def post(self, request):
        email = request.data.get["email"]
        password = request.data.get["password"]
        
        try:
            validate_email(email)
        except ValidationError:
            return Response({'error': 'Enter valid email address'},
                            status=status.HTTP_400_BAD_REQUEST
                            )
        user = authenticate(request, email=email, password=password)
        if user:
            return Response({"message":"Login successful."})
        return Response({"error": "invalid email or password"},  status=status.HTTP_401_UNAUTHORIZED)
    
class LogoutView(APIView):
    """system logout view"""
    def post(self, request):
        logout(request)
        return Response({"message": "Logged out successfully."}, status=status.HTTP_200_OK)     
        