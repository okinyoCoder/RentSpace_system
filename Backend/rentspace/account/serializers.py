from rest_framework import serializers
from django.contrib.auth import get_user_model
from django.contrib.auth.password_validation import validate_password

User = get_user_model()


class UserSerializer(serializers.ModelSerializer):
    """User serializer"""
    class Meta:
        password = serializers.CharField(
            write_only=True, required=True, validators=[validate_password]
        )
        
        model = User
        fields = ['id', 'email', 'username', 'phone_number', 'user_type', 'profile_picture', 'password','password1','date_joined']
        read_only_fields =[ 'id', 'date_joined']
        
        def validate_email(self, value):
            if User.objects.filter(email=value).exists():
                raise serializers.ValidationError("Email already in Use")
            return value
        
        def validate(self, data):
            if data['password'] != data['password1']:
                raise serializers.ValidationError("password must match")
            validate_password(data['password'])
            return data
            
                    
        def create(self, validated_data):
            validated_data.pop('password1')
            password = validated_data.pop('password')
            user = User(**validated_data)
            user.set_password(password)
            user.save()
            return user