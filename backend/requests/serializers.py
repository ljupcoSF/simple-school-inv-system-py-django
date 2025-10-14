from rest_framework import serializers
from requests.models import BorrowRequest


class BorrowRequestSerializer(serializers.ModelSerializer):
    user = serializers.ReadOnlyField(source='user.username')
    equipment_name = serializers.ReadOnlyField(source='equipment.name')

    class Meta:
        model = BorrowRequest
        fields = [
            'id', 'user', 'equipment', 'equipment_name',
            'status', 'request_date', 'return_date'
        ]
        read_only_fields = ['id', 'user', 'request_date']