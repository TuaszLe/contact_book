from django.db import models

class Channel(models.Model):
    name = models.CharField(max_length=255)
    provider = models.CharField(max_length=255)
    description = models.TextField(null=True, blank=True)
    status = models.SmallIntegerField(default=1)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.name} ({self.provider})"

    class Meta:
        db_table = 'channels'