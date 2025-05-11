from dj_rest_auth.registration.views import ConfirmEmailView
from dj_rest_auth.registration.views import VerifyEmailView
from django.urls import include
from django.urls import path

from auth_api.users.api.views import GoogleLogin
from auth_api.users.api.views import UserProfileAPIView
from auth_api.users.api.views import UserRedirectView

# Non-viewset URLs for users
urlpatterns = [
    # Registration and email confirmation
    path(
        "registration/account-confirm-email/<str:key>/",
        ConfirmEmailView.as_view(),
    ),  # Needs to be defined before the registration path
    path("auth/", include("dj_rest_auth.urls")),
    path("registration/", include("dj_rest_auth.registration.urls")),
    # Email verification
    path(
        "registration/account-confirm-email/",
        VerifyEmailView.as_view(),
        name="account_email_verification_sent",
    ),
    # User Profile
    path("profile/", UserProfileAPIView.as_view(), name="user_profile"),
    # Social login
    path("auth/social/google/", GoogleLogin.as_view(), name="google_login"),
    path("~redirect/", view=UserRedirectView.as_view(), name="redirect"),
]
