from django.db import models
from django.core.exceptions import ValidationError


# ========================
# BASE MODEL (DÙNG CHUNG)
# ========================

class BaseModel(models.Model):
    STATUS_CHOICES = (
        ('active', 'Active'),
        ('inactive', 'Inactive'),
    )

    status = models.CharField(
        max_length=10,
        choices=STATUS_CHOICES,
        default='active'
    )

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def soft_delete(self):
        self.status = 'inactive'
        self.save()

    class Meta:
        abstract = True


# ========================
# CUSTOM MANAGER
# ========================

class ActiveManager(models.Manager):
    def get_queryset(self):
        return super().get_queryset().filter(status='active')


# ========================
# MASTER DATA
# ========================

class Channel(BaseModel):
    name = models.CharField(max_length=255)
    provider = models.CharField(max_length=255, blank=True, null=True)
    description = models.TextField(blank=True, null=True)

    objects = models.Manager()
    active_objects = ActiveManager()

    def __str__(self):
        return self.name


class Contractor(BaseModel):
    name = models.CharField(max_length=255)
    description = models.TextField(blank=True, null=True)

    objects = models.Manager()
    active_objects = ActiveManager()

    def __str__(self):
        return self.name


class Project(BaseModel):
    name = models.CharField(max_length=255)
    description = models.TextField(blank=True, null=True)

    objects = models.Manager()
    active_objects = ActiveManager()

    def __str__(self):
        return self.name


class Type(BaseModel):
    name = models.CharField(max_length=255)
    description = models.TextField(blank=True, null=True)

    objects = models.Manager()
    active_objects = ActiveManager()

    def __str__(self):
        return self.name


class Title(BaseModel):
    name = models.CharField(max_length=255)
    description = models.TextField(blank=True, null=True)

    objects = models.Manager()
    active_objects = ActiveManager()

    def __str__(self):
        return self.name


# ========================
# CORE: TOLLPLAZA
# ========================

class TollPlaza(BaseModel):
    name = models.CharField(max_length=255)
    address = models.TextField()

    project = models.ForeignKey(Project, on_delete=models.SET_NULL, null=True)
    type = models.ForeignKey(Type, on_delete=models.SET_NULL, null=True)

    contractors = models.ManyToManyField(Contractor, blank=True)

    objects = models.Manager()
    active_objects = ActiveManager()

    def __str__(self):
        return self.name


class TollPlazaChannel(BaseModel):
    tollplaza = models.ForeignKey(TollPlaza, on_delete=models.CASCADE)
    channel = models.ForeignKey(Channel, on_delete=models.CASCADE)
    code = models.CharField(max_length=100)

    objects = models.Manager()
    active_objects = ActiveManager()

    class Meta:
        unique_together = ('tollplaza', 'code')

    def __str__(self):
        return f"{self.tollplaza} - {self.channel} ({self.code})"


# ========================
# PARKING
# ========================

class Parking(BaseModel):
    name = models.CharField(max_length=255)
    address = models.TextField()

    type = models.ForeignKey(Type, on_delete=models.SET_NULL, null=True)
    contractors = models.ManyToManyField(Contractor, blank=True)

    objects = models.Manager()
    active_objects = ActiveManager()

    def __str__(self):
        return self.name


# ========================
# CONTACT
# ========================

class Contact(BaseModel):

    CONTACT_TYPE_CHOICES = (
        ('tollplaza', 'TollPlaza'),
        ('parking', 'Parking'),
        ('office', 'Office'),
    )

    firstname = models.CharField(max_length=255)
    lastname = models.CharField(max_length=255)
    email = models.EmailField(blank=True, null=True)
    phonenumber = models.CharField(max_length=50, blank=True, null=True)

    title = models.ForeignKey(Title, on_delete=models.SET_NULL, null=True, blank=True)

    contact_type = models.CharField(max_length=20, choices=CONTACT_TYPE_CHOICES)

    tollplazas = models.ManyToManyField(TollPlaza, blank=True)
    parkings = models.ManyToManyField(Parking, blank=True)

    objects = models.Manager()
    active_objects = ActiveManager()

    def clean(self):
        """
        Validate logic:
        - tollplaza → chỉ có tollplaza
        - parking → chỉ có parking
        - office → chỉ có title
        """

        if self.contact_type == 'tollplaza':
            if self.parkings.exists() or self.title:
                raise ValidationError("TollPlaza contact không được có Parking hoặc Office")

        elif self.contact_type == 'parking':
            if self.tollplazas.exists() or self.title:
                raise ValidationError("Parking contact không được có TollPlaza hoặc Office")

        elif self.contact_type == 'office':
            if self.tollplazas.exists() or self.parkings.exists():
                raise ValidationError("Office contact không được có TollPlaza hoặc Parking")

    def __str__(self):
        return f"{self.firstname} {self.lastname}"