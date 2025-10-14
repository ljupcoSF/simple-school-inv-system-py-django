from rest_framework import viewsets, permissions
from rest_framework.response import Response
from equipment.models import Equipment
from equipment.serializers import EquipmentSerializer


class IsAdminOrReadOnly(permissions.BasePermission):
    """
    Allow read-only access to students, full access to admins.
    """

    def has_permission(self, request, view):
        # SAFE_METHODS are GET, HEAD, OPTIONS
        if request.method in permissions.SAFE_METHODS:
            return True
            # Admins can create/update/delete
        return request.user.is_authenticated and request.user.role == 'admin'


class EquipmentViewSet(viewsets.ModelViewSet):
    queryset = Equipment.objects.all()
    serializer_class = EquipmentSerializer
    permission_classes = [IsAdminOrReadOnly]
