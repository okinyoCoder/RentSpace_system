from django.shortcuts import render
from django.shortcuts import get_object_or_404
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, permissions
from django.contrib.auth import get_user_model
from rest_framework.permissions import IsAuthenticated
from account.serializers import UserSerializer
from rest_framework import generics, permissions
from .serializers import MessageSerializer
from django.db.models import Prefetch

from .models import (
    Listing, ListingImage, Payment, Review,
    Location, Unit, Message
)

from .serializers import (
    ListingSerializer, ListingDetailSerializer,
    ListingImageSerializer,
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

        # Filtering
        county = request.query_params.get('county')
        property_type = request.query_params.get('property')
        min_price = request.query_params.get('minPrice')
        max_price = request.query_params.get('maxPrice')

        if county:
            listings = listings.filter(location__county__iexact=county)
        if property_type:
            listings = listings.filter(property_type__iexact=property_type)
        if min_price:
            listings = listings.filter(units__rent__gte=min_price)
        if max_price:
            listings = listings.filter(units__rent__lte=max_price)

        listings = listings.distinct()
        serializer = ListingDetailSerializer(listings, many=True, context={'request': request})
        return Response(serializer.data)

    def post(self, request):
        serializer = ListingSerializer(data=request.data, context={'request': request})
        if serializer.is_valid():
            serializer.save(landlord=request.user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        print("Validation Errors:", serializer.errors)
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

        serializer = ListingSerializer(listing, data=request.data, context={'request': request}, partial=True)
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

##### Begining of Messages
class MessageListCreateAPIView(generics.ListCreateAPIView):
    serializer_class = MessageSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        listing_id = self.request.query_params.get('listing')
        return Message.objects.filter(
            listing_id=listing_id,
            recipient=self.request.user
        ) | Message.objects.filter(
            listing_id=listing_id,
            sender=self.request.user
        )

    def perform_create(self, serializer):
        serializer.save(sender=self.request.user)

class MessagesGroupedByTenantView(generics.ListAPIView):
    serializer_class = MessageSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        landlord = self.request.user
        return Message.objects.filter(sender=landlord) | Message.objects.filter(recipient=landlord)


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

class BookingRequestAPIView(APIView):
    permission_classes = [permissions.IsAuthenticated]
    def post(self, request, listing_pk):
        listing = get_object_or_404(Listing, pk=listing_pk)
        # Check if the user already booked a unit in this listing
        existing = Unit.objects.filter(
            listing=listing,
            tenant=request.user
        ).first()
        if existing:
            return Response({"detail": "You already requested a booking in this listing."},
                            status=status.HTTP_400_BAD_REQUEST)
        # Find an unoccupied unit
        unit = listing.units.filter(is_occupied=False, tenant__isnull=True).first()
        if not unit:
            return Response({"detail": "No available units."},
                            status=status.HTTP_400_BAD_REQUEST)
        # Assign the tenant (pending approval), but don't mark as occupied yet
        unit.tenant = request.user
        unit.save()
        return Response({
            "detail": "Booking request submitted. Awaiting landlord approval.",
            "unit_id": unit.id,
            "unit_number": unit.unit_number,
            "listing_title": listing.title
        }, status=status.HTTP_200_OK)

class LandlordTenantsAPIView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        units = Unit.objects.filter(
            listing__landlord=request.user,
            tenant__isnull=False
        ).select_related('tenant', 'listing')
        data = [{
            "unit_id": u.id,
            "listing_id": str(u.listing.id),
            "listing_title": u.listing.title,
            "tenant_id": str(u.tenant.id),
            "tenant_name": f"{u.tenant.first_name} {u.tenant.last_name}",
            "tenant_email": u.tenant.email,
            "is_occupied": u.is_occupied,
        } for u in units]
        return Response(data)

class UnitApprovalAPIView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, unit_id):
        unit = get_object_or_404(Unit, pk=unit_id, listing__landlord=request.user)
        action = request.data.get('action')
        if action == 'approve':
            unit.is_occupied = True
            unit.save()
            return Response({"detail": "Approved"})
        elif action == 'decline':
            unit.tenant = None
            unit.save()
            return Response({"detail": "Declined"})
        else:
            return Response({"detail": "Invalid"}, status=400)

class TenantListView(APIView):
    permission_classes = [IsAuthenticated]
    def get(self, request):
        if not request.user.is_landlord:
            return Response({"detail": "Not authorized."}, status=403)

        tenants = User.objects.filter(user_type=User.TENANT)
        serializer = UserSerializer(tenants, many=True)
        return Response(serializer.data)



class LandlordDashboardSummaryView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        if not request.user.is_landlord:
            return Response({"detail": "Not authorized."}, status=403)

        listings = Listing.objects.filter(landlord=request.user)
        total_properties = listings.count()
        total_tenants = Unit.objects.filter(listing__in=listings, tenant__isnull=False).count()
        pending_approval = Unit.objects.filter(listing__in=listings, tenant__isnull=False, is_occupied=False).count()

        return Response({
            "totalProperties": total_properties,
            "totalTenants": total_tenants,
            "pendingApproval": pending_approval
        })
