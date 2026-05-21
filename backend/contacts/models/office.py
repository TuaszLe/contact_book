from django.db import models
from .type import Type

class Office(models.Model):
    name = models.CharField(max_length=255)
    description = models.TextField(null=True, blank=True)
    type = models.ForeignKey(Type, on_delete=models.SET_NULL, null=True)
    status = models.SmallIntegerField(default=1)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name

    class Meta:
        db_table = 'office'