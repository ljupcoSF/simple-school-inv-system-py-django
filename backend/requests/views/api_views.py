from rest_framework import viewsets, permissions, status
from rest_framework.response import Response
from requests.models import BorrowRequest
from requests.serializers import BorrowRequestSerializer
from equipment.models import Equipment


class IsAdminOrOwner(permissions.BasePermission):
    """Students manage their own requests; Admins manage all."""

    def has_permission(self, request, view):
        return request.user.is_authenticated

    def has_object_permission(self, request, view, obj):
        if request.user.role == 'admin':
            return True
        return obj.user == request.user


class BorrowRequestViewSet(viewsets.ModelViewSet):
    queryset = BorrowRequest.objects.all().select_related('user', 'equipment')
    serializer_class = BorrowRequestSerializer
    permission_classes = [IsAdminOrOwner]

    def get_queryset(self):
        user = self.request.user
        return BorrowRequest.objects.all() if user.role == 'admin' else BorrowRequest.objects.filter(user=user)

    def perform_create(self, serializer):
        equipment = serializer.validated_data['equipment']
        if equipment.status != 'available':
            raise ValueError("Equipment is not available for borrowing.")
        borrow_request = serializer.save(user=self.request.user)
        equipment.status = 'borrowed'
        equipment.save()
        return borrow_request

    def partial_update(self, request, *args, **kwargs):
        """Admins approve/decline/return requests."""
        instance = self.get_object()

        if request.user.role != 'admin':
            return Response({'error': 'Only admins can update borrow requests.'},
                            status=status.HTTP_403_FORBIDDEN)

        serializer = self.get_serializer(instance, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        new_status = serializer.validated_data.get('status')

        if new_status:
            instance.status = new_status
            if new_status == 'approved':
                instance.equipment.status = 'borrowed'
            elif new_status in ['declined', 'returned']:
                instance.equipment.status = 'available'
            instance.equipment.save()
            instance.save()

        return Response(self.get_serializer(instance).data, status=status.HTTP_200_OK)