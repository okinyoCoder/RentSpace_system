from rest_framework import serializers
from django.contrib.auth import get_user_model
from .models import (
    Listing, ListingImage, Inquiry, Payment, Review,
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
            'latitude', 'longitude', 'description', 'created_at'
        ]
        read_only_fields = ['id', 'created_at']


class UnitSerializer(serializers.ModelSerializer):
    tenant = UserSerializer(read_only=True)

    class Meta:
        model = Unit
        fields = [
            'id', 'listing', 'unit_number', 'floor',
            'bedrooms', 'bathrooms', 'rent', 'is_occupied', 'tenant'
        ]
        read_only_fields = ['id', 'tenant']


class ListingSerializer(serializers.ModelSerializer):
    landlord = UserSerializer(read_only=True)
    avg_rating = serializers.FloatField(read_only=True)
    review_count = serializers.IntegerField(read_only=True)
    location = LocationSerializer()

    class Meta:
        model = Listing
        fields = [
            'id', 'landlord', 'title', 'description',
            'price', 'property_type', 'location',
            'is_verified', 'is_vacant', 'avg_rating',
            'review_count', 'created_at'
        ]
        read_only_fields = [
            'id', 'is_verified', 'avg_rating',
            'review_count', 'created_at'
        ]

    def create(self, validated_data):
        location_data = validated_data.pop('location', None)
        if location_data:
            location, _ = Location.objects.get_or_create(**location_data)
            validated_data['location'] = location
        return super().create(validated_data)

    def update(self, instance, validated_data):
        location_data = validated_data.pop('location', None)
        if location_data:
            Location.objects.update_or_create(
                id=instance.location.id if instance.location else None,
                defaults=location_data
            )
        return super().update(instance, validated_data)


class ListingImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ListingImage
        fields = ['id', 'listing', 'property_image', 'uploaded_at']
        read_only_fields = ['id', 'uploaded_at']


class InquirySerializer(serializers.ModelSerializer):
    tenant = UserSerializer(read_only=True)

    class Meta:
        model = Inquiry
        fields = ['id', 'tenant', 'listing', 'message', 'response', 'timestamp']
        read_only_fields = ['id', 'timestamp', 'response']


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

    class Meta(ListingSerializer.Meta):
        fields = ListingSerializer.Meta.fields + ['images', 'reviews', 'units']