from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import get_user_model
from django.core.validators import validate_email
from django.core.exceptions import ValidationError
from django.contrib.auth import logout
from .serializers import UserSerializer

User = get_user_model()

def get_tokens_for_user(user):
    refresh = RefreshToken.for_user(user)
    return {
        'refresh': str(refresh),
        'access': str(refresh.access_token),
    }

class RegisterView(APIView):
    """User registration view"""
    def post(self, request):
        serializer = UserSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            tokens = get_tokens_for_user(user)
            return Response({
                'user': serializer.data,
                'tokens': tokens,
            }, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class LoginView(APIView):
    """User login view with JWT"""
    def post(self, request):
        email = request.data.get("email")
        password = request.data.get("password")

        if not email or not password:
            return Response({'error': 'Email and password are required.'},
                            status=status.HTTP_400_BAD_REQUEST)

        try:
            validate_email(email)
        except ValidationError:
            return Response({'error': 'Enter a valid email address.'},
                            status=status.HTTP_400_BAD_REQUEST)

        try:
            user = User.objects.get(email=email)
            if user.check_password(password):
                tokens = get_tokens_for_user(user)
                return Response({
                    "message": "Login successful.",
                    "tokens": tokens,
                }, status=status.HTTP_200_OK)
            else:
                return Response({"error": "Invalid email or password."}, status=status.HTTP_401_UNAUTHORIZED)
        except User.DoesNotExist:
            return Response({"error": "Invalid email or password."}, status=status.HTTP_401_UNAUTHORIZED)
        

class LogoutView(APIView):
    """system logout view"""
    def post(self, request):
        logout(request)
        return Response({"message": "Logged out successfully."}, status=status.HTTP_200_OK)     
        
