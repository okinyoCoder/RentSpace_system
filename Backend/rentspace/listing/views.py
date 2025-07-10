from django.shortcuts import render
from django.shortcuts import get_object_or_404
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, permissions
from django.contrib.auth import get_user_model

from .models import (
    Listing, ListingImage, Inquiry, Payment, Review,
    Location, Unit
)

from .serializers import (
    ListingSerializer, ListingDetailSerializer,
    ListingImageSerializer, InquirySerializer,
    PaymentSerializer, ReviewSerializer,
    LocationSerializer, UnitSerializer
)



User = get_user_model()

####Begin proprty Listing###
class ListingListCreateAPIView(APIView):
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]   
    def get(self, request):
        listings = Listing.objects.select_related('location', 'landlord') \
                                  .prefetch_related('images', 'reviews', 'units') \
                                  .all()

        # Filtering parameters from query string
        county = request.query_params.get('county')
        property_type = request.query_params.get('property')
        min_price = request.query_params.get('minPrice')
        max_price = request.query_params.get('maxPrice')

        # Apply county filter (via related Location model)
        if county:
            listings = listings.filter(location__county__iexact=county)

        # Apply property type filter
        if property_type:
            listings = listings.filter(property_type__iexact=property_type)

        # Apply price filtering using related Unit model
        if min_price:
            listings = listings.filter(units__rent__gte=min_price)

        if max_price:
            listings = listings.filter(units__rent__lte=max_price)

        # Remove duplicates due to join on units
        listings = listings.distinct()

        serializer = ListingDetailSerializer(listings, many=True, context={'request': request})
        return Response(serializer.data)

    def post(self, request):
        serializer = ListingSerializer(data=request.data, context={'request': request})
        if serializer.is_valid():
            serializer.save(landlord=request.user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class ListingDetailAPIView(APIView):
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def get_object(self, pk):
        return get_object_or_404(Listing, pk=pk)

    def get(self, request, pk):
        listing = self.get_object(pk)
        serializer = ListingDetailSerializer(listing, context={'request': request})
        return Response(serializer.data)

    def put(self, request, pk):
        listing = self.get_object(pk)
        if listing.landlord != request.user:
            return Response({'detail': 'Not authorized.'}, status=status.HTTP_403_FORBIDDEN)
        serializer = ListingSerializer(listing, data=request.data, context={'request': request})
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        listing = self.get_object(pk)
        if listing.landlord != request.user:
            return Response({'detail': 'Not authorized.'}, status=status.HTTP_403_FORBIDDEN)
        listing.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
    
####Begin Image Listing####
class ListingImageListCreateAPIView(APIView):
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def get(self, request):
        images = ListingImage.objects.all()
        serializer = ListingImageSerializer(images, many=True)
        return Response(serializer.data)

    def post(self, request):
        serializer = ListingImageSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class ListingImageDetailAPIView(APIView):
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def get_object(self, pk):
        return get_object_or_404(ListingImage, pk=pk)

    def get(self, request, pk):
        image = self.get_object(pk)
        serializer = ListingImageSerializer(image)
        return Response(serializer.data)

    def put(self, request, pk):
        image = self.get_object(pk)
        serializer = ListingImageSerializer(image, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        image = self.get_object(pk)
        image.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

##### Begining of Inquiry
class InquiryListCreateAPIView(APIView):
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def get(self, request):
        inquiries = Inquiry.objects.all()
        serializer = InquirySerializer(inquiries, many=True)
        return Response(serializer.data)

    def post(self, request):
        serializer = InquirySerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(tenant=request.user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class InquiryDetailAPIView(APIView):
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def get_object(self, pk):
        return get_object_or_404(Inquiry, pk=pk)

    def get(self, request, pk):
        inquiry = self.get_object(pk)
        serializer = InquirySerializer(inquiry)
        return Response(serializer.data)

    def put(self, request, pk):
        inquiry = self.get_object(pk)
        serializer = InquirySerializer(inquiry, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        inquiry = self.get_object(pk)
        inquiry.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

###### Begin payment views
class PaymentListCreateAPIView(APIView):
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def get(self, request):
        payments = Payment.objects.all()
        serializer = PaymentSerializer(payments, many=True)
        return Response(serializer.data)

    def post(self, request):
        serializer = PaymentSerializer(data=request.data)
        if serializer.is_valid():
            validated = serializer.validated_data
            listing = validated.get('listing')
            
            if not listing:
                return Response(
                    {'listing': 'This field is required.'}, 
                    status=status.HTTP_400_BAD_REQUEST
                    )

            serializer.save(
                tenant=request.user,
                landlord=listing.landlord  
            )
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class PaymentDetailAPIView(APIView):
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def get_object(self, pk):
        return get_object_or_404(Payment, pk=pk)

    def get(self, request, pk):
        payment = self.get_object(pk)
        serializer = PaymentSerializer(payment)
        return Response(serializer.data)

    def put(self, request, pk):
        payment = self.get_object(pk)
        serializer = PaymentSerializer(payment, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        payment = self.get_object(pk)
        payment.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

##### Begin review ###
class ReviewListCreateAPIView(APIView):
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def get(self, request):
        reviews = Review.objects.all()
        serializer = ReviewSerializer(reviews, many=True)
        return Response(serializer.data)

    def post(self, request):
        serializer = ReviewSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(tenant=request.user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class ReviewDetailAPIView(APIView):
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def get_object(self, pk):
        return get_object_or_404(Review, pk=pk)

    def get(self, request, pk):
        review = self.get_object(pk)
        serializer = ReviewSerializer(review)
        return Response(serializer.data)

    def put(self, request, pk):
        review = self.get_object(pk)
        serializer = ReviewSerializer(review, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        review = self.get_object(pk)
        review.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

###### Begin Location views
class LocationListCreateAPIView(APIView):
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def get(self, request):
        locations = Location.objects.all()
        serializer = LocationSerializer(locations, many=True)
        return Response(serializer.data)

    def post(self, request):
        serializer = LocationSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class LocationDetailAPIView(APIView):
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def get_object(self, pk):
        return get_object_or_404(Location, pk=pk)

    def get(self, request, pk):
        location = self.get_object(pk)
        serializer = LocationSerializer(location)
        return Response(serializer.data)

    def put(self, request, pk):
        location = self.get_object(pk)
        serializer = LocationSerializer(location, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        location = self.get_object(pk)
        location.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


###### Begin unit views
class UnitListCreateAPIView(APIView):
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def get(self, request):
        units = Unit.objects.all()
        serializer = UnitSerializer(units, many=True)
        return Response(serializer.data)

    def post(self, request):
        serializer = UnitSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class UnitDetailAPIView(APIView):
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def get_object(self, pk):
        return get_object_or_404(Unit, pk=pk)

    def get(self, request, pk):
        unit = self.get_object(pk)
        serializer = UnitSerializer(unit)
        return Response(serializer.data)

    def put(self, request, pk):
        unit = self.get_object(pk)
        serializer = UnitSerializer(unit, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        unit = self.get_object(pk)
        unit.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
