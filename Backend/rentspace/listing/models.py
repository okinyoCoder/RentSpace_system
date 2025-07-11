from django.db import models
from django.contrib.auth import get_user_model
import uuid

User = get_user_model()


class Location(models.Model):
    county = models.CharField(max_length=100)
    sub_county = models.CharField(max_length=100)
    ward = models.CharField(max_length=100)
    street_address = models.CharField(max_length=255, blank=True, null=True)
    postal_code = models.CharField(max_length=20, blank=True, null=True)
    latitude = models.DecimalField(max_digits=9, decimal_places=6, null=True, blank=True)
    longitude = models.DecimalField(max_digits=9, decimal_places=6, null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('county', 'sub_county', 'ward', 'street_address')

    def __str__(self):
        return f"{self.ward}, {self.sub_county}, {self.county}"


class Listing(models.Model):
    PROPERTY_CHOICES = (
        ('bedsitter', 'Bedsitter'),
        ('one_bedroom', '1 Bedroom'),
        ('two_bedroom', '2 Bedroom'),
        ('studio', 'Studio'),
        ('mansion', 'Mansion'),
        ('single_room', 'Single'),
        ('double_room', 'Double Room'),
        ('bungalow', 'Bungalow'),
    )

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    landlord = models.ForeignKey(User, on_delete=models.CASCADE, related_name='listings')
    title = models.CharField(max_length=254)
    description = models.TextField()
    property_type = models.CharField(max_length=20, choices=PROPERTY_CHOICES, default='bedsitter')
    location = models.ForeignKey(Location, on_delete=models.SET_NULL, null=True, blank=True, related_name='listings')
    is_verified = models.BooleanField(default=False)
    is_vacant = models.BooleanField(default=False)
    created_at = models.DateField(auto_now_add=True)
    avg_rating = models.FloatField(default=0.0)
    review_count = models.PositiveIntegerField(default=0)

    def __str__(self):
        return self.title


class Unit(models.Model):
    APPROVAL_STATUS = (
        ('pending', 'Pending'),
        ('approved', 'Approved'),
        ('rejected', 'Rejected'),
    )
    listing = models.ForeignKey(Listing, on_delete=models.CASCADE, related_name='units')
    unit_number = models.CharField(max_length=50)
    floor = models.IntegerField(default=1)
    bedrooms = models.IntegerField(default=1)
    bathrooms = models.IntegerField(default=1)
    rent = models.DecimalField(max_digits=10, decimal_places=2)
    is_occupied = models.BooleanField(default=False)
    status = models.CharField(max_length=10, choices=APPROVAL_STATUS, default='pending')
    tenant = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name='occupied_units')

    def __str__(self):
        return f"{self.listing.title} - Unit {self.unit_number}"

class ListingImage(models.Model):
    listing = models.ForeignKey(Listing, on_delete=models.CASCADE, related_name='images')
    property_image = models.ImageField(upload_to='property/images/')
    uploaded_at = models.DateTimeField(auto_now_add=True)


class Message(models.Model):
    sender = models.ForeignKey(User, related_name='sent_messages', on_delete=models.CASCADE)
    recipient = models.ForeignKey(User, related_name='received_messages', on_delete=models.CASCADE)
    listing = models.ForeignKey(Listing, on_delete=models.CASCADE, related_name='messages')
    content = models.TextField()
    timestamp = models.DateTimeField(auto_now_add=True)
    is_read = models.BooleanField(default=False)

    class Meta:
        ordering = ['-timestamp']

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
