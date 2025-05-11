from django.urls import include
from django.urls import path

urlpatterns = [
    path("", include("auth_api.users.api.urls")),
    # Your stuff: custom urls includes go here
]
