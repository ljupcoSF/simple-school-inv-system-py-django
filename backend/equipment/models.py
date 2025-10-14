from django.db import models


class Equipment(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField(blank=True)
    status = models.CharField(max_length=20, default='available')

    def __str__(self):
        return self.name