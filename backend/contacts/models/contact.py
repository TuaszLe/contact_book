from django.db import models
from django.core.exceptions import ValidationError
from .title import Titles
from .tollplaza import Tollplaza
from .parking import Parking


class Contact(models.Model):

    CONTACT_TYPE_CHOICES = (
        ('tollplaza', 'TollPlaza'),
        ('parking', 'Parking'),
        ('office', 'Office'),
    )

    firstname = models.CharField(max_length=255, null = True, blank=True)
    lastname = models.CharField(max_length=255)
    email = models.EmailField(null=True, blank=True)
    phone = models.CharField(max_length=50, null=True, blank=True)
    contact_type = models.CharField(max_length=20, choices=CONTACT_TYPE_CHOICES, default="tollplaza")
    title = models.ForeignKey(Titles, on_delete=models.SET_NULL, null=True, blank=True)

    tollplazas = models.ManyToManyField(Tollplaza, blank=True)
    parkings = models.ManyToManyField(Parking, blank=True)

    status = models.SmallIntegerField(default=1)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def clean(self):
        if self.contact_type == 'tollplaza' and self.title:
            raise ValidationError("TollPlaza contact không được có Office")

        if self.contact_type == 'parking' and self.title:
            raise ValidationError("Parking contact không được có Office")

    def __str__(self):
        return f"{self.firstname} {self.lastname}"

    class Meta:
        db_table = 'contacts'