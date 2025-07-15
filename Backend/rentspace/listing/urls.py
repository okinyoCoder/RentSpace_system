from django.urls import path
from .views import (
    # Listings
    ListingListCreateAPIView, ListingDetailAPIView, BookingRequestAPIView,
    
    # Listing Images
    ListingImageListCreateAPIView, ListingImageDetailAPIView,
    
    # Messages
    MessageListCreateAPIView, MessagesGroupedByTenantView,
    
    # Payments
    PaymentListCreateAPIView, PaymentDetailAPIView,
    
    # Reviews
    ReviewListCreateAPIView, ReviewDetailAPIView,
    
    # Locations
    LocationListCreateAPIView, LocationDetailAPIView,
    
    # Units
    UnitListCreateAPIView, UnitDetailAPIView,
    
    # Landlord-related
    LandlordTenantsAPIView, UnitApprovalAPIView, TenantListView,
)

urlpatterns = [
    # --- Listings ---
    path('listings/', ListingListCreateAPIView.as_view(), name='listing-list-create'),
    path('listings/<uuid:pk>/', ListingDetailAPIView.as_view(), name='listing-detail'),
    path('listings/<uuid:listing_pk>/book/', BookingRequestAPIView.as_view(), name='booking-request'),

    # --- Listing Images ---
    path('listing-images/', ListingImageListCreateAPIView.as_view(), name='listing-image-list-create'),
    path('listing-images/<int:pk>/', ListingImageDetailAPIView.as_view(), name='listing-image-detail'),

    # --- Messages ---
    path('messages/', MessageListCreateAPIView.as_view(), name='message-list'),
    path('messages/grouped/', MessagesGroupedByTenantView.as_view(), name='grouped-messages'),

    # --- Payments ---
    path('payments/', PaymentListCreateAPIView.as_view(), name='payment-list-create'),
    path('payments/<uuid:pk>/', PaymentDetailAPIView.as_view(), name='payment-detail'),

    # --- Reviews ---
    path('reviews/', ReviewListCreateAPIView.as_view(), name='review-list-create'),
    path('reviews/<uuid:pk>/', ReviewDetailAPIView.as_view(), name='review-detail'),

    # --- Locations ---
    path('locations/', LocationListCreateAPIView.as_view(), name='location-list-create'),
    path('locations/<uuid:pk>/', LocationDetailAPIView.as_view(), name='location-detail'),

    # --- Units ---
    path('units/', UnitListCreateAPIView.as_view(), name='unit-list-create'),
    path('units/<int:pk>/', UnitDetailAPIView.as_view(), name='unit-detail'),

    # --- Landlord Controls ---
    path('landlord/tenants/', LandlordTenantsAPIView.as_view(), name='landlord-tenants'),
    path('landlord/tenants/approve/<int:unit_id>/', UnitApprovalAPIView.as_view(), name='unit-approval'),
    
    # --- Admin/Utility ---
    path('admin/tenants/', TenantListView.as_view(), name='all-tenants'),
]
