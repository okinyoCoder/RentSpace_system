from django.urls import path
from .views import ListingListCreateAPIView, ListingDetailAPIView,ListingImageListCreateAPIView, ListingImageDetailAPIView 
from .views import  ReviewListCreateAPIView, ReviewDetailAPIView, LocationListCreateAPIView, LocationDetailAPIView,UnitListCreateAPIView
from .views import MessageListCreateAPIView, MessagesGroupedByTenantView, PaymentListCreateAPIView, PaymentDetailAPIView, UnitDetailAPIView
from .views import  BookingRequestAPIView,  LandlordTenantsAPIView, UnitApprovalAPIView, TenantListView

urlpatterns = [
    path('listings/', ListingListCreateAPIView.as_view(), name='listing-list-create'),
    path('listings/<uuid:pk>/', ListingDetailAPIView.as_view(), name='listing-detail'),
    path('listings/<uuid:listing_pk>/book/', BookingRequestAPIView.as_view(), name='booking-request'),
    
    path('listing-images/', ListingImageListCreateAPIView.as_view(), name='listing-image-list-create'),
    path('listing-images/<int:pk>/', ListingImageDetailAPIView.as_view(), name='listing-image-detail'),
    
    path('messages/', MessageListCreateAPIView.as_view(), name='message-list'),
    path('messages/grouped/', MessagesGroupedByTenantView.as_view(), name='grouped-messages'),
    
    path('payments/', PaymentListCreateAPIView.as_view(), name='payment-list-create'),
    path('payments/<uuid:pk>/', PaymentDetailAPIView.as_view(), name='payment-detail'),
    
    path('reviews/', ReviewListCreateAPIView.as_view(), name='review-list-create'),
    path('reviews/<uuid:pk>/', ReviewDetailAPIView.as_view(), name='review-detail'),
    
    path('locations/', LocationListCreateAPIView.as_view(), name='location-list-create'),
    path('locations/<uuid:pk>/', LocationDetailAPIView.as_view(), name='location-detail'),
    
    path('units/', UnitListCreateAPIView.as_view(), name='unit-list-create'),
    path('units/<int:pk>/', UnitDetailAPIView.as_view(), name='unit-detail'),

    path('landlord/tenants/', LandlordTenantsAPIView.as_view()),
    path('landlord/tenants/approve/<int:unit_id>/', UnitApprovalAPIView.as_view()),
    path('landlord/tenants/', TenantListView.as_view(), name='landlord-tenants'),

]