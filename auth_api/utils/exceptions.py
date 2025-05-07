import logging
from uuid import uuid4

from django.conf import settings
from django.core.exceptions import ValidationError as DjangoValidationError
from rest_framework.exceptions import APIException
from rest_framework.views import exception_handler

logger = logging.getLogger(__name__)


def custom_exception_handler(exc, context):
    """
    Production-ready error handler with security best practices.

    This handler supports two error response formats:
    1. **Default DRF Format** (when USE_CUSTOM_ERROR_FORMAT is False or unset):
       Returns standard DRF error responses (e.g., {"non_field_errors": ["message"]}).
    2. **Custom Format** (when USE_CUSTOM_ERROR_FORMAT=True in settings.py):
       Returns a structured response with success status, error code, type, and details
       (e.g.,
            {"success": false, "error": {"code": 400, "type": "ValidationError", ...}}
       ).

    To enable the custom format, add the following to your settings.py:
    ```
    USE_CUSTOM_ERROR_FORMAT = True
    ```

    Args:
        exc: The exception raised during request processing.
        context: Context dictionary provided by DRF, including the request.

    Returns:
        Response: A DRF Response object with either the default or custom error format.
    """

    if not getattr(settings, "USE_CUSTOM_ERROR_FORMAT", False):
        return exception_handler(exc, context)

    response = exception_handler(exc, context)
    if response is None:
        return None

    # Convert Django validation errors
    if isinstance(exc, DjangoValidationError):
        exc = APIException(detail=exc.message_dict)

    # Handle 500 errors securely
    internal_server_error = 500
    if response.status_code >= internal_server_error:
        error_id = uuid4().hex
        request = context.get("request", None)

        logging.critical(
            "Error %s | User: %s | Path: %s | Method: %s",
            error_id,
            getattr(request.user, "pk", "unauthenticated") if request else "no-request",
            request.path if request else "no-path",
            request.method if request else "no-method",
            exc_info=exc,
        )

        response.data = {
            "success": False,
            "error": {
                "code": 500,
                "type": "InternalError",
                "message": "We've encountered an unexpected error",
                "details": {
                    "reference": error_id,
                    "support": getattr(
                        settings,
                        "SUPPORT_EMAIL",
                        "help@savannaaccountancy.co.uk",
                    ),
                    "message": "Please contact support with the reference above",
                },
            },
        }
        response.headers["Cache-Control"] = "no-store, max-age=0"
        return response

    # Standard 4xx errors
    response.data = {
        "success": False,
        "error": {
            "code": response.status_code,
            "type": exc.__class__.__name__,
            "message": _get_user_friendly_message(exc),
            "details": _normalize_error_details(getattr(exc, "detail", str(exc))),
        },
    }
    return response


def _get_user_friendly_message(exc):
    """Safe error message extraction"""
    if isinstance(exc, APIException):
        return (
            str(exc.detail)
            if not isinstance(exc.detail, (dict, list))
            else "Validation error"
        )
    return "An error occurred"


def _normalize_error_details(data):
    """Standardize error details structure"""
    if isinstance(data, dict):
        return {
            k: v[0] if isinstance(v, list) and len(v) == 1 else v
            for k, v in data.items()
        }
    if isinstance(data, list):
        return {"non_field_errors": data}
    return {"detail": str(data)}
