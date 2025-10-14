from django.db import models
from django.conf import settings
from equipment.models import Equipment


class BorrowRequest(models.Model):
    student = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    equipment = models.ForeignKey(Equipment, on_delete=models.CASCADE)
    date_borrowed = models.DateTimeField(auto_now_add=True)
    date_returned = models.DateTimeField(null=True, blank=True)
    status = models.CharField(max_length=20, default='pending')

    def __str__(self):
        return f"{self.student.username} - {self.equipment.name}"