from django.contrib.auth.models import Group
from django.contrib.auth.models import Permission
from django.contrib.contenttypes.models import ContentType
from django.core.management.base import BaseCommand

from auth_api.companies.models import Company


class Command(BaseCommand):
    help = "Create Supplier group with specific permissions for managing companies"

    def handle(self, *args, **kwargs):
        # Define the Supplier group
        supplier_group, _ = Group.objects.get_or_create(name="Supplier")

        # Get permissions for the Company model
        content_type_company = ContentType.objects.get_for_model(Company)
        permissions = Permission.objects.filter(
            content_type=content_type_company,
            codename__in=[
                "view_company",
                "add_company",
                "change_company",
                "delete_company",
            ],
        )

        # Assign permissions to the Supplier group
        supplier_group.permissions.set(permissions)

        self.stdout.write(
            self.style.SUCCESS(
                "Supplier group and CRUD permissions for Company created successfully",
            ),
        )
