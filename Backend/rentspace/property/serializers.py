from rest_framework import serializers
from django.contrib.auth import get_user_model
from .models import Listing, ListingImage, Inquiry, Payment, Review
from account.serializers import UserSerializer

User = get_user_model()

class ListingSerializer(serializers.ModelSerializer):
    landlord = UserSerializer(read_only=True)
    avg_rating = serializers.FloatField(read_only=True)
    review_count = serializers.IntegerField(read_only=True)

    class Meta:
        model = Listing
        fields = [
            'id', 'landlord', 'title', 'description',
            'price', 'latitude', 'longitude',
            'property_type', 'is_verified', 'is_occupied',
            'avg_rating', 'review_count', 'created_at'
        ]
        read_only_fields = [
            'id', 'is_verified', 'avg_rating', 'review_count',
            'is_occupied', 'created_at'
        ]


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

    class Meta(ListingSerializer.Meta):
        fields = ListingSerializer.Meta.fields + ['images', 'reviews']