from typing import ClassVar

from django.contrib.auth.models import AbstractUser
from django.core.mail import send_mail
from django.db import models
from django.utils.translation import gettext_lazy as _

from .managers import UserManager


class User(AbstractUser):
    """
    Default custom user model for Django Auth API.
    If adding fields that need to be filled at user signup,
    check forms.SignupForm and forms.SocialSignupForms accordingly.
    """

    # First and last name do not cover name patterns around the globe
    # e.g. Chinese, Indian, and Arabic names so use 'name' instead
    # Setting first_name and last_name to None
    # name = models.CharField(_("Name of User"), blank=True, max_length=255) # noqa: ERA001, E501
    # first_name = None  # type: ignore[assignment] # noqa: ERA001
    # last_name = None  # type: ignore[assignment] # noqa: ERA001
    email = models.EmailField(_("email address"), unique=True)
    username = None  # type: ignore[assignment]

    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = []

    objects: ClassVar[UserManager] = UserManager()

    class Meta:
        verbose_name = _("user")
        verbose_name_plural = _("users")
        ordering = ("-date_joined",)

    def clean(self):
        super().clean()
        self.email = self.__class__.objects.normalize_email(self.email)

    def email_user(self, subject, message, from_email=None, **kwargs):
        """Send an email to this user."""
        send_mail(subject, message, from_email, [self.email], **kwargs)

    def __str__(self):
        return self.email

    @property
    def name(self):
        """
        Dynamic 'name' property to provide compatibility with code expecting
        a 'name' attribute(Eg. SocialAccountAdapter).
        It uses the get_full_name() method.
        """
        return self.get_full_name()


class UserProfile(models.Model):
    user = models.OneToOneField(
        User,
        related_name="profile",
        on_delete=models.CASCADE,
    )
    bio = models.TextField(max_length=500, blank=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ("-user__date_joined",)

    def __str__(self):
        return self.user.email

    def activeness(self):
        if self.user.is_active:
            return "Active"
        return "Inactive"
