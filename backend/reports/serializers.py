from rest_framework import serializers


class EquipmentUsageReportSerializer(serializers.Serializer):
    equipment_name = serializers.CharField()
    total_borrowed = serializers.IntegerField()
    total_returned = serializers.IntegerField()
    total_declined = serializers.IntegerField()
    current_borrowed = serializers.IntegerField()


class UserActivityReportSerializer(serializers.Serializer):
    username = serializers.CharField()  # ✅ renamed to avoid model field conflict
    total_requests = serializers.IntegerField()
    approved = serializers.IntegerField()
    declined = serializers.IntegerField()
    returned = serializers.IntegerField()
