from django.db import models
from .tollplaza import Tollplaza
from .channel import Channel
from .contractor import Contractor
from .contact import Contact
from .parking import Parking

class Tollplaza_channel(models.Model):
    tollplaza = models.ForeignKey(Tollplaza, on_delete=models.CASCADE)
    channel = models.ForeignKey(Channel, on_delete=models.CASCADE)
    code = models.CharField(max_length=50)
    status = models.SmallIntegerField(default=1)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'tollplaza_channel'

# class Tollplaza_contractor(models.Model):
#     tollplaza = models.ForeignKey(Tollplaza, on_delete=models.CASCADE)
#     contractor = models.ForeignKey(Contractor, on_delete=models.CASCADE)

#     class Meta:
#         db_table = 'tollplaza_contracter'

# class Tollplaza_contact(models.Model):
#     tollplaza = models.ForeignKey(Tollplaza, on_delete=models.CASCADE)
#     contact = models.ForeignKey(Contact, on_delete=models.CASCADE)

#     class Meta:
#         db_table = 'tollplaza_contact'

# class Parking_contact(models.Model):
#     parking = models.ForeignKey(Parking, on_delete=models.CASCADE)
#     contact = models.ForeignKey(Contact, on_delete=models.CASCADE)

#     class Meta:
#         db_table = 'parking_contact'