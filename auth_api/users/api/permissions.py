from rest_framework import permissions
from rest_framework.permissions import BasePermission


class IsUserProfileOwner(BasePermission):
    """
    Check if authenticated user is owner of the profile
    """

    def has_object_permission(self, request, view, obj):
        return obj.user == request.user or request.is_staff


class IsAdminOrOwner(BasePermission):
    """Custom permission to allow admins
    to access all, while users see only their own."""

    def has_permission(self, request, view):
        return request.user.is_authenticated  # Only authenticated users can access

    def has_object_permission(self, request, view, obj):
        return request.user.is_staff or obj.user == request.user


class IsAdminOrReadOnly(BasePermission):
    """
    Allows read-only access to all users (including anonymous),
    but requires admin privileges for write operations.
    """

    def has_permission(self, request, view):
        # Allow all GET, HEAD, OPTIONS requests
        if request.method in permissions.SAFE_METHODS:
            return True
        # Only allow write operations for admin users
        return request.user and request.user.is_staff


class IsOwnerOrReadOnly(BasePermission):
    def has_object_permission(self, request, view, obj):
        if request.method in permissions.SAFE_METHODS:
            return True

        return obj.user == request.user


class IsStaff(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user and request.user.is_staff


class IsAdminOrCreateOnly(BasePermission):
    """
    Allows all users to create, but only staff can read/update/delete.
    """

    def has_permission(self, request, view):
        if request.method == "POST":
            return True
        return request.user and request.user.is_staff

    def has_object_permission(self, request, view, obj):
        return request.user and request.user.is_staff
