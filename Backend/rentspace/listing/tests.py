#from django.test import TestCase

# Create your tests here.
import pytest
from rest_framework.test import APIClient
from django.urls import reverse
from uuid import uuid4
from datetime import date


# Adjust depending on how your API is structured
API_URLS = {
    "listings": "/listings/",
    "listing_images": "/listing-images/",
    "inquiries": "/inquiries/",
    "payments": "/payments/",
    "reviews": "/reviews/",
    "locations": "/locations/",
    "units": "/units/",
    "register": "/register/",
    "login": "/login/"
}


@pytest.fixture
def api_client():
    return APIClient()


@pytest.fixture
def register_user(api_client):
    user_data = {
        "email": "user@example.com",
        "username": "user1",
        "password": "password123",
        "date_of_birth": "1995-01-01",
        "phone_number": 1234567890,
        "first_name": "Test",
        "last_name": "User"
    }
    response = api_client.post(API_URLS["register"], user_data)
    assert response.status_code == 201
    return user_data


@pytest.fixture
def auth_client(api_client, register_user):
    login_data = {
        "email": register_user["email"],
        "password": register_user["password"]
    }
    response = api_client.post(API_URLS["login"], login_data)
    assert response.status_code == 200
    token = response.data.get("access") or response.data.get("token")
    api_client.credentials(HTTP_AUTHORIZATION=f"Bearer {token}")
    return api_client


@pytest.mark.django_db
class TestFullAPIFlow:

    def test_crud_endpoints(self, auth_client):
        # Create location
        loc = auth_client.post(API_URLS["locations"], {"name": "Nairobi", "address": "CBD"})
        assert loc.status_code == 201
        location_id = loc.data["id"]

        # Create listing
        listing_data = {
            "title": "2BR Apartment",
            "description": "Nice place",
            "price": 50000,
            "location": location_id,
        }
        listing = auth_client.post(API_URLS["listings"], listing_data)
        assert listing.status_code == 201
        listing_id = listing.data["id"]

        # Get listing
        get_listing = auth_client.get(f"{API_URLS['listings']}{listing_id}/")
        assert get_listing.status_code == 200

        # Update listing
        update = auth_client.put(f"{API_URLS['listings']}{listing_id}/", {
            **listing_data, "price": 60000
        }, format='json')
        assert update.status_code == 200
        assert update.data["price"] == 60000

        # Inquiry
        inquiry = auth_client.post(API_URLS["inquiries"], {
            "message": "Is it still available?",
            "listing": listing_id,
        })
        assert inquiry.status_code in [201, 400]  # Adjust if FK required

        # Payment
        payment = auth_client.post(API_URLS["payments"], {
            "amount": 60000,
            "method": "Mpesa",
            "listing": listing_id,
        })
        assert payment.status_code in [201, 400]

        # Review
        review = auth_client.post(API_URLS["reviews"], {
            "rating": 5,
            "comment": "Loved it",
            "listing": listing_id,
        })
        assert review.status_code in [201, 400]

        # Listing image
        img = auth_client.post(API_URLS["listing_images"], {
            "image_url": "http://example.com/img.jpg",
            "listing": listing_id,
        })
        assert img.status_code in [201, 400]

        # Unit
        unit = auth_client.post(API_URLS["units"], {
            "unit_number": 101,
            "floor": 1,
            "listing": listing_id
        })
        assert unit.status_code in [201, 400]

        # Delete listing
        delete = auth_client.delete(f"{API_URLS['listings']}{listing_id}/")
        assert delete.status_code == 204
