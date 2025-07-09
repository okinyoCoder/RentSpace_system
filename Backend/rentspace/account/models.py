from django.db import models
import uuid
from django.contrib.auth.models import BaseUserManager, AbstractUser

class CustomUserManager(BaseUserManager):
    def create_user(self, email, username, password=None, user_type='tenant',**extra_fields):
        """
           Creates and saves a User 
        """
        if not email:
            raise ValueError("Email address  is required")
        if not username:
            raise ValueError("Username is required")
        
        user = self.model(
            email = self.normalize_email(email),
            username = username,
            user_type = user_type,
            **extra_fields
        )
        user.set_password(password)
        user.save(self._db)
        return user
    
    def create_superuser(self, email, username, password=None, **extra_fields):
        """ Creates and saves a superuser """
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)

        return self.create_user(email, username, password, user_type='admin', **extra_fields)

class CustomUser(AbstractUser):
    USER_CHOICES = (
        ('tenant', 'Tenant'),
        ('landlord', 'Landlord'),
        ('admin', 'Admin'),
    )
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    email = models.EmailField("email address", max_length=254, unique=True)
    date_of_birth = models.DateField()
    phone_number = models.IntegerField()
    profile_photo = models.ImageField(upload_to='profile_photos/', blank=True)
    first_name = models.CharField(max_length=50)
    last_name = models.CharField(max_length=50)
    username = models.CharField(max_length=50, unique=True)
    user_type = models.CharField(max_length=10,choices=USER_CHOICES, default='tenant')
    date_joined = models.DateField(auto_now_add=True)
    is_active = models.BooleanField(default=True)
    is_admin = models.BooleanField(default=False)
    
    objects = CustomUserManager()
    
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username']
    
    def __str__(self):
        return f"{self.username} ({self.user_type})"