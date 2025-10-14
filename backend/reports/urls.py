from django.urls import path
from reports.views.api_views import EquipmentUsageReportView, UserActivityReportView

urlpatterns = [
    path("equipment-usage/", EquipmentUsageReportView.as_view(), name="equipment-usage-report"),
    path("user-activity/", UserActivityReportView.as_view(), name="user-activity-report"),
]
