from django.contrib import admin
from requests.models import BorrowRequest


@admin.register(BorrowRequest)
class BorrowRequestAdmin(admin.ModelAdmin):
    list_display = ('id', 'user', 'equipment', 'status', 'request_date', 'return_date')
    list_filter = ('status',)
    search_fields = ('user__username', 'equipment__name')
    actions = ['approve_requests', 'decline_requests', 'mark_as_returned']

    def approve_requests(self, request, queryset):
        for req in queryset:
            req.status = 'approved'
            req.equipment.status = 'borrowed'
            req.equipment.save()
            req.save()
        self.message_user(request, f"{queryset.count()} request(s) approved.")

    approve_requests.short_description = "Approve selected requests"

    def decline_requests(self, request, queryset):
        for req in queryset:
            req.status = 'declined'
            req.equipment.status = 'available'
            req.equipment.save()
            req.save()
        self.message_user(request, f"{queryset.count()} request(s) declined.")

    decline_requests.short_description = "Decline selected requests"

    def mark_as_returned(self, request, queryset):
        for req in queryset:
            req.status = 'returned'
            req.equipment.status = 'available'
            req.equipment.save()
            req.save()
        self.message_user(request, f"{queryset.count()} request(s) marked as returned.")

    mark_as_returned.short_description = "Mark selected as returned"