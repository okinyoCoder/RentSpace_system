from django.urls import re_path
from . import consumers

websocket_urlpatterns = [
    re_path(r'ws/messages/(?P<listing_id>\d+)/$', consumers.ChatConsumer.as_asgi()),
]