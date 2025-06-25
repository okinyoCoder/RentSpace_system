from django.db import models
from django.contrib.auth import get_user_model
import uuid

User = get_user_model()


class Listing(models.Model):
    PROPERTY_CHOICES = (
        ('bedsitter', 'Bedsitter'),
        ('1br', '1 Bedroom'),
        ('2br', '2 Bedroom'),
        ('studio', 'Studio'),
        ('mansion', 'Mansion'),
    )

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    landlord = models.ForeignKey(User, on_delete=models.CASCADE, related_name='listings')
    title = models.CharField(max_length=254)
    description = models.TextField()
    price = models.DecimalField(max_digits=10, decimal_places=2)
    latitude = models.DecimalField(max_digits=8, decimal_places=6, null=True, blank=True)
    longitude = models.DecimalField(max_digits=9, decimal_places=6, null=True, blank=True)
    property_type = models.CharField(max_length=20, choices=PROPERTY_CHOICES, default='bedsitter')
    is_verified = models.BooleanField(default=False)
    is_occupied = models.BooleanField(default=False)
    created_at = models.DateField(auto_now_add=True)
    avg_rating = models.FloatField(default=0.0)
    review_count = models.PositiveIntegerField(default=0)

    def __str__(self):
        return self.title
    
def listing_image_upload_path(instance, filename):
    return f'property_image/{instance.listing.id}/{filename}'

class ListingImage(models.Model):
    listing = models.ForeignKey(Listing, on_delete=models.CASCADE, related_name='images')
    property_image = models.ImageField(upload_to=listing_image_upload_path)
    uploaded_at = models.DateTimeField(auto_now_add=True)


class Inquiry(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    tenant = models.ForeignKey(User, on_delete=models.CASCADE, related_name='inquiries')
    listing = models.ForeignKey(Listing, on_delete=models.CASCADE, related_name='inquiries')
    message = models.TextField(max_length=254)
    response = models.TextField(max_length=254, blank=True)
    timestamp = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Inquiry by {self.tenant.username} on {self.listing.title}"


class Payment(models.Model):
    PAYMENT_STATUS = (
        ('pending', 'Pending'),
        ('completed', 'Completed'),
        ('failed', 'Failed'),
    )

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    tenant = models.ForeignKey(User, on_delete=models.CASCADE, related_name='tenant_payments')
    landlord = models.ForeignKey(User, on_delete=models.CASCADE, related_name='landlord_payments')
    listing = models.ForeignKey(Listing, on_delete=models.CASCADE, related_name='payments')
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    status = models.CharField(max_length=10, choices=PAYMENT_STATUS, default='pending')
    payment_method = models.CharField(max_length=20)
    transaction_id = models.CharField(max_length=100)
    paid_at = models.DateField(auto_now_add=True)


class Review(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    tenant = models.ForeignKey(User, on_delete=models.CASCADE, related_name='reviews')
    listing = models.ForeignKey(Listing, on_delete=models.CASCADE, related_name='reviews')
    rating = models.IntegerField()
    comment = models.TextField(max_length=254, null=True, blank=True)
    created_at = models.DateField(auto_now_add=True)
    updated_at = models.DateField(auto_now=True)
    is_verified = models.BooleanField(default=False)

    def __str__(self):
        return f"{self.tenant.username} review on {self.listing.title}"
