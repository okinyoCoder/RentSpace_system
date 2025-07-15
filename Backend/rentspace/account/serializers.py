from rest_framework import serializers
from django.contrib.auth import get_user_model
from django.contrib.auth.password_validation import validate_password

User = get_user_model()

class UserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(
        write_only=True,
        required=True,
        validators=[validate_password],
        style={'input_type': 'password'}
    )
    password1 = serializers.CharField(
        write_only=True,
        required=True,
        style={'input_type': 'password'}
    )

    class Meta:
        model = User
        fields = [
            'id', 'email', 'username', 'phone_number',
            'user_type', 'profile_picture', 'password', 'password1', 'date_joined'
        ]
        read_only_fields = ['id', 'date_joined']

    def validate_email(self, value):
        value = value.lower()
        if User.objects.filter(email=value).exists():
            raise serializers.ValidationError("Email is already in use.")
        return value

    def validate_user_type(self, value):
        valid_types = [choice[0] for choice in User.USER_TYPE_CHOICES]
        if value not in valid_types:
            raise serializers.ValidationError("Invalid user type.")
        return value

    def validate(self, data):
        if data.get('password') != data.get('password1'):
            raise serializers.ValidationError({"password1": "Passwords must match."})
        return data

    def create(self, validated_data):
        validated_data.pop('password1')
        password = validated_data.pop('password')
        user = User(**validated_data)
        user.set_password(password)
        user.save()
        return user

    def to_representation(self, instance):
        """Convert profile_picture to full URL if request is available."""
        data = super().to_representation(instance)
        request = self.context.get('request')
        if instance.profile_picture and request:
            try:
                data['profile_picture'] = request.build_absolute_uri(instance.profile_picture.url)
            except Exception:
                data['profile_picture'] = None
        return data
