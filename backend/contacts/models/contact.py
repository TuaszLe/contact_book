from django.db import models
from django.core.exceptions import ValidationError
from django.db.models import Q

from .title import Titles
from .tollplaza import Tollplaza
from .office import Office
from .parking import Parking


class Contact(models.Model):

    CONTACT_TYPE_CHOICES = (
        ('tollplaza', 'TollPlaza'),
        ('parking', 'Parking'),
        ('office', 'Office'),
    )

    firstname = models.CharField(
        max_length=255,
        verbose_name="Tên"
    )

    lastname = models.CharField(
        max_length=255,
        null=True,
        blank=True,
        verbose_name="Họ"
    )

    email = models.EmailField(
        null=True,
        blank=True,
        verbose_name="Email"
    )

    phone = models.CharField(
        max_length=50,
        null=True,
        blank=True,
        unique=True,
        verbose_name="Số điện thoại"
    )
    class Meta:
        constraints = [
            models.UniqueConstraint(
                fields=['phone'],
                name='unique_phone',
                condition=Q(phone__isnull=False)
            )
        ]

    contact_type = models.CharField(
        max_length=20,
        choices=CONTACT_TYPE_CHOICES,
        null=True,
        blank=True,
        default=None,
        verbose_name="Loại liên hệ"
    )

    title = models.ForeignKey(
        Titles,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        verbose_name="Chức vụ"
    )

    tollplazas = models.ManyToManyField(
        Tollplaza,
        blank=True,
        related_name='contacts'
    )

    parkings = models.ManyToManyField(
        Parking,
        blank=True,
        related_name='contacts'
    )

    offices = models.ManyToManyField(
        Office,
        blank=True,
        related_name='contacts'
    )

    status = models.SmallIntegerField(
        default=1,
        verbose_name="Trạng thái"
    )

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def clean(self):

        # Không check M2M khi object chưa save
        if not self.pk:
            return

        errors = {}

        # Ensure contact is linked to at most one type
        has_toll = self.tollplazas.exists()
        has_parking = self.parkings.exists()
        has_office = self.offices.exists()

        if sum([has_toll, has_parking, has_office]) > 1:
            errors['__all__'] = (
                "Contact chỉ được liên kết với một trong: TollPlaza, Parking, Office."
            )

        if errors:
            raise ValidationError(errors)

    def __str__(self):

        fullname = f"{self.firstname} {self.lastname or ''}".strip()

        return fullname or f"Contact #{self.id}"
    @property
    def fullname(self):

        return f"{self.firstname} {self.lastname or ''}".strip()

    def save(self, *args, **kwargs):
        super().save(*args, **kwargs)
        if self.contact_type == 'tollplaza':
            self.parkings.clear()
            self.offices.clear()
        elif self.contact_type == 'parking':
            self.tollplazas.clear()
            self.offices.clear()
        elif self.contact_type == 'office':
            self.tollplazas.clear()
            self.parkings.clear()

    class Meta:
        db_table = 'contacts'
        verbose_name = "Contact"
        verbose_name_plural = "Contacts"
        ordering = ['firstname', 'lastname']


# Signals to keep associations exclusive and update contact_type automatically
from django.db.models.signals import m2m_changed


def _set_exclusive_type(instance, set_name):
    """Clear the other M2M relations and set the contact_type."""
    if set_name == 'tollplazas':
        # clear other relations
        if instance.parkings.exists():
            instance.parkings.clear()
        if instance.offices.exists():
            instance.offices.clear()
        new_type = 'tollplaza'

    elif set_name == 'parkings':
        if instance.tollplazas.exists():
            instance.tollplazas.clear()
        if instance.offices.exists():
            instance.offices.clear()
        new_type = 'parking'

    else:  # offices
        if instance.tollplazas.exists():
            instance.tollplazas.clear()
        if instance.parkings.exists():
            instance.parkings.clear()
        new_type = 'office'

    # update contact_type if needed
    if instance.contact_type != new_type:
        instance.contact_type = new_type
        instance.save(update_fields=['contact_type'])


def _on_m2m_changed(sender, instance, action, reverse, model, pk_set, **kwargs):
    # We only act after additions or removals
    if action == 'post_add':
        # determine which relation triggered the signal by comparing sender to through models
        if sender == Contact.tollplazas.through:
            _set_exclusive_type(instance, 'tollplazas')
        elif sender == Contact.parkings.through:
            _set_exclusive_type(instance, 'parkings')
        elif sender == Contact.offices.through:
            _set_exclusive_type(instance, 'offices')

    elif action == 'post_remove':
        # if after removal there are no relations, clear contact_type
        if not (instance.tollplazas.exists() or instance.parkings.exists() or instance.offices.exists()):
            if instance.contact_type is not None:
                instance.contact_type = None
                instance.save(update_fields=['contact_type'])


# connect signals
m2m_changed.connect(_on_m2m_changed, sender=Contact.tollplazas.through)
m2m_changed.connect(_on_m2m_changed, sender=Contact.parkings.through)
m2m_changed.connect(_on_m2m_changed, sender=Contact.offices.through)