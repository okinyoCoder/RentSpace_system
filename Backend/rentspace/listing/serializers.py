from rest_framework import serializers
from django.contrib.auth import get_user_model
from .models import (
    Listing, ListingImage, Message, Payment, Review,
    Location, Unit
)
from account.serializers import UserSerializer

User = get_user_model()


class LocationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Location
        fields = [
            'id', 'county', 'sub_county', 'ward',
            'street_address', 'postal_code',
            'latitude', 'longitude', 'created_at'
        ]
        read_only_fields = ['id', 'created_at']


class UnitSerializer(serializers.ModelSerializer):
    tenant = UserSerializer(read_only=True)

    class Meta:
        model = Unit
        fields = [
            'id', 'listing', 'unit_number', 'floor',
            'bedrooms', 'bathrooms', 'rent', 'is_occupied', 'tenant', 'status'
        ]
        read_only_fields = ['id', 'tenant', 'is_occupied', 'status']


class ListingSerializer(serializers.ModelSerializer):
    landlord = UserSerializer(read_only=True)
    avg_rating = serializers.FloatField(read_only=True)
    review_count = serializers.IntegerField(read_only=True)
    unit_count = serializers.SerializerMethodField()
    occupied_count = serializers.SerializerMethodField()
    approved_units = serializers.SerializerMethodField()
    pending_units = serializers.SerializerMethodField()
    class Meta:
        model = Listing
        fields = [
            'id', 'landlord', 'title', 'description',
            'property_type', 'location',
            'is_verified', 'avg_rating',
            'review_count', 'created_at',
            'unit_count', 'approved_units', 'pending_units', 'occupied_count',
            
        ]
        read_only_fields = [
            'id', 'is_verified', 'avg_rating',
            'review_count', 'created_at', 'unit_count', 'approved_units', 'pending_units', 'occupied_count',
        ]

    def create(self, validated_data):
        request = self.context.get("request")
        landlord = request.user if request else None
        location_data = validated_data.pop('location', None)

        if location_data:
            unique_fields = {
                "county": location_data.get("county"),
                "sub_county": location_data.get("sub_county"),
                "ward": location_data.get("ward"),
                "street_address": location_data.get("street_address"),
            }
            location, _ = Location.objects.get_or_create(
                **unique_fields,
                defaults=location_data
            )
            validated_data['location'] = location

        validated_data["landlord"] = landlord
        return super().create(validated_data)

    def update(self, instance, validated_data):
        location_data = validated_data.pop('location', None)
        if location_data:
            Location.objects.update_or_create(
                id=instance.location.id if instance.location else None,
                defaults=location_data
            )
        return super().update(instance, validated_data)

    def get_unit_count(self, obj):
        return obj.units.count()

    def get_approved_units(self, obj):
        return obj.units.filter(is_occupied=True).count()

    def get_pending_units(self, obj):
        return obj.units.filter(is_occupied=False, tenant__isnull=False).count()

    def get_occupied_count(self, obj):
        return obj.units.filter(is_occupied=True).count()

    def get_avg_rating(self, obj):
        avg = obj.reviews.aggregate(avg=models.Avg('rating'))['avg']
        return round(avg, 1) if avg is not None else None

    def get_review_count(self, obj):
        return obj.reviews.count()
    
    def get_unit_count(self, obj):
        return obj.units.count()

    def get_occupied_count(self, obj):
        return obj.units.filter(is_occupied=True).count()

    def get_approved_units(self, obj):
        return obj.units.filter(status='approved').count()

    def get_pending_units(self, obj):
        return obj.units.filter(status='pending').count()

class ListingImageSerializer(serializers.ModelSerializer):
    property_image = serializers.SerializerMethodField()
    
    class Meta:
        model = ListingImage
        fields = ['id', 'listing', 'property_image', 'uploaded_at']
        read_only_fields = ['id', 'uploaded_at']

    def get_property_image(self, obj):
        request = self.context.get('request')
        if obj.property_image and hasattr(obj.property_image, 'url'):
            return request.build_absolute_uri(obj.property_image.url)
        return None


class MessageSerializer(serializers.ModelSerializer):
    sender = UserSerializer(read_only=True)
    recipient = UserSerializer(read_only=True)

    class Meta:
        model = Message
        fields = ['id', 'sender', 'recipient', 'listing', 'content', 'timestamp', 'is_read']
        read_only_fields = ['id', 'timestamp', 'sender']


class PaymentSerializer(serializers.ModelSerializer):
    tenant = UserSerializer(read_only=True)
    landlord = UserSerializer(read_only=True)

    class Meta:
        model = Payment
        fields = [
            'id', 'tenant', 'landlord', 'listing', 'amount',
            'status', 'payment_method', 'transaction_id', 'paid_at'
        ]
        read_only_fields = ['id', 'status', 'transaction_id', 'paid_at']


class ReviewSerializer(serializers.ModelSerializer):
    tenant = UserSerializer(read_only=True)

    class Meta:
        model = Review
        fields = [
            'id', 'tenant', 'listing', 'rating', 'comment',
            'is_verified', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at', 'is_verified']


class ListingDetailSerializer(ListingSerializer):
    images = ListingImageSerializer(many=True, read_only=True)
    reviews = ReviewSerializer(many=True, read_only=True)
    units = UnitSerializer(many=True, read_only=True)
    location = LocationSerializer(read_only=True)

    class Meta(ListingSerializer.Meta):
        fields = ListingSerializer.Meta.fields + ['images', 'reviews', 'units']
