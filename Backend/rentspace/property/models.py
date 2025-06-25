from django.db import models
from django.contrib.auth import get_user_model
import uuid

User = get_user_model()
# Create your models here.
class Tenant(models.Model):
    pass

class Landlord(models.Model):
    pass

class Listing(models.Model):
    PROPERTY_CHOICES = (
        
    )
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    landlord= models.ForeignKey(User, on_delete=models.CASCADE)
    title = models.CharField(max_length=254)
    description = models.TextField()
    price = models.DecimalField()
    latitide = models.DecimalField()
    longitude = models.DecimalField()
    property_type = models.CharField(max_length=20, choices=PROPERTY_CHOICES, default='bedsitter')
    is_verified = models.BooleanField(default=False)
    is_occupied = models.BooleanField(default=False)
    created_at = models.DateField(auto_now_add=True)
    avg_rating = models.FloatField(default=0.0)
    review_count = models.PositiveIntegerField(default=0)
    
    def __str__(self):
        return self.title

class ListingImage(models.Model):
    listing = models.ForeignKey(Listing, on_delete=models.CASCADE)
    property_image = models.ImageField(upload_to=('property_image/{self.listing.id}/'))
    
class Inquiry(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    tenant = models.ForeignKey(User, on_delete=models.CASCADE)
    listing = models.ForeignKey(Listing, on_delete=models.CASCADE)
    message = models.TextField(max_length=254)
    response = models.TextField(max_length=254)
    timestamp =models.DateTimeField()
    
    def __str__(self):
        return f"Inquiry by {self.tenant.username} on {self.listing.title}"
    
class Payment(models.Model):
    PAYMENT_STATUS = (
        
    )
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    tenant = models.ForeignKey(User, on_delete=models.CASCADE)
    landlord= models.ForeignKey(User, on_delete=models.CASCADE)
    listing = models.ForeignKey(Listing, on_delete=models.CASCADE)
    amount = models.DecimalField()
    status = models.CharField(max_length=10, choices=PAYMENT_STATUS, default='pending')
    Payment_method = models.CharField(max_length=10)
    transaction_id = models.CharField()
    paid_at = models.DateField(auto_now_add=True)
    
class Review(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    tenant = models.ForeignKey(User, on_delete=models.CASCADE)
    listing = models.ForeignKey(Listing, on_delete=models.CASCADE)
    rating = models.IntegerField()
    comment = models.TextField(max_length=254, null=True)
    created_at = models.DateField()
    updated_at = models.DateField()
    is_verified = models.BooleanField(default=False)