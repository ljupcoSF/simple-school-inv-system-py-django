from rest_framework import views, permissions, status
from rest_framework.response import Response
from django.db.models import Count, Q, F
from requests.models import BorrowRequest
from reports.serializers import EquipmentUsageReportSerializer, UserActivityReportSerializer


class IsAdmin(permissions.BasePermission):
    """Allow only admin users."""

    def has_permission(self, request, view):
        return request.user.is_authenticated and getattr(request.user, "role", None) == "admin"


class EquipmentUsageReportView(views.APIView):
    permission_classes = [IsAdmin]

    def get(self, request):
        """Aggregate borrow data per equipment."""
        data = (
            BorrowRequest.objects
            .values(equipment_name=F("equipment__name"))
            .annotate(
                total_borrowed=Count("id", filter=Q(status="approved")),
                total_returned=Count("id", filter=Q(status="returned")),
                total_declined=Count("id", filter=Q(status="declined")),
                current_borrowed=Count("id", filter=Q(status="approved"))
                                 - Count("id", filter=Q(status="returned"))
            )
            .order_by("equipment_name")
        )

        serializer = EquipmentUsageReportSerializer(data, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)


class UserActivityReportView(views.APIView):
    permission_classes = [IsAdmin]

    def get(self, request):
        """Aggregate borrow data per user."""
        data = (
            BorrowRequest.objects
            .values(username=F("user__username"))  # ✅ alias avoids 'user' field conflict 
            .annotate(
                total_requests=Count("id"),
                approved=Count("id", filter=Q(status="approved")),
                declined=Count("id", filter=Q(status="declined")),
                returned=Count("id", filter=Q(status="returned"))
            )
            .order_by("username")
        )

        serializer = UserActivityReportSerializer(data, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)