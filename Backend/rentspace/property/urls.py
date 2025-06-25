from django.urls import path
from .views import (
    ListingListCreateAPIView, ListingDetailAPIView,
    ListingImageListCreateAPIView, ListingImageDetailAPIView,
    InquiryListCreateAPIView, InquiryDetailAPIView,
    PaymentListCreateAPIView, PaymentDetailAPIView,
    ReviewListCreateAPIView, ReviewDetailAPIView,
)

urlpatterns = [
    # Listings
    path('listings/', ListingListCreateAPIView.as_view(), name='listings'),
    path('listings/<int:pk>/', ListingDetailAPIView.as_view(), name='listing-detail'),

    # Images
    path('images/', ListingImageListCreateAPIView.as_view(), name='images'),
    path('images/<int:pk>/', ListingImageDetailAPIView.as_view(), name='image-detail'),

    # Inquiries
    path('inquiries/', InquiryListCreateAPIView.as_view(), name='inquiries'),
    path('inquiries/<int:pk>/', InquiryDetailAPIView.as_view(), name='inquiry-detail'),

    # Payments
    path('payments/', PaymentListCreateAPIView.as_view(), name='payments'),
    path('payments/<int:pk>/', PaymentDetailAPIView.as_view(), name='payment-detail'),

    # Reviews
    path('reviews/', ReviewListCreateAPIView.as_view(), name='reviews'),
    path('reviews/<int:pk>/', ReviewDetailAPIView.as_view(), name='review-detail'),
]
