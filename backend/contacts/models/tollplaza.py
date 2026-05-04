from django.db import models
from .project import Project
from .type import Type
from .contractor import Contractor

class Tollplaza(models.Model):
    name = models.CharField(max_length=255)
    description = models.TextField(null=True, blank=True)
    address = models.CharField(max_length=255)
    lat = models.FloatField(null=True, blank=True)
    lng = models.FloatField(null=True, blank=True)
    contractor = models.ManyToManyField(Contractor, blank=True)
    project = models.ForeignKey(Project, on_delete=models.SET_NULL, null=True)
    type = models.ForeignKey(Type, on_delete=models.SET_NULL, null=True)
    lanes = models.IntegerField(default=0)
    status = models.SmallIntegerField(default=1)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name

    class Meta:
        db_table = 'tollplaza'