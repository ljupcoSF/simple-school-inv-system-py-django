from django.contrib import admin
from equipment.models import Equipment


@admin.register(Equipment)
class EquipmentAdmin(admin.ModelAdmin):
    list_display = ('id', 'name', 'status')
    search_fields = ('name', 'description')
    list_filter = ('status',)