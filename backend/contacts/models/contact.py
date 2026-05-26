from django.db import models
from django.core.exceptions import ValidationError


class Contact(models.Model):
    CONTACT_TYPE_CHOICES = (
        ('tollplaza', 'TollPlaza'),
        ('parking', 'Parking'),
        ('office', 'Office'),
    )

    firstname = models.CharField(max_length=255, verbose_name="Tên")
    lastname = models.CharField(max_length=255, null=True, blank=True, verbose_name="Họ")
    
    email = models.EmailField(null=True, blank=True, verbose_name="Email")
    phone = models.CharField(max_length=50, null=True, blank=True, verbose_name="Số điện thoại")
    
    contact_type = models.CharField(
        max_length=20, 
        choices=CONTACT_TYPE_CHOICES, 
        default='tollplaza',
        verbose_name="Loại liên hệ"
    )

    title = models.ForeignKey('contacts.Titles', on_delete=models.SET_NULL, null=True, blank=True, verbose_name="Chức vụ")

    # ManyToMany relationships with explicit through tables
    tollplazas = models.ManyToManyField(
        'contacts.Tollplaza',
        blank=True,
        related_name='contacts',
        through='contacts.Tollplaza_contact',
    )
    parkings = models.ManyToManyField(
        'contacts.Parking',
        blank=True,
        related_name='contacts',
        through='contacts.Parking_contact',
    )
    offices = models.ManyToManyField('contacts.Office', blank=True, related_name='contacts')

    status = models.SmallIntegerField(default=1, verbose_name="Trạng thái")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def _m2m_has_values(self, field_name):
        if hasattr(self, '_prefetched_objects_cache') and field_name in self._prefetched_objects_cache:
            return bool(self._prefetched_objects_cache[field_name])
        return getattr(self, field_name).exists()

    def clean(self):
        """Kiểm tra logic khi lưu"""
        errors = {}

        if self.contact_type == 'tollplaza':
            if self._m2m_has_values('parkings') or self._m2m_has_values('offices'):
                errors['contact_type'] = "Contact TollPlaza không được liên kết với Parking hoặc Office."

        elif self.contact_type == 'parking':
            if self._m2m_has_values('tollplazas') or self._m2m_has_values('offices'):
                errors['contact_type'] = "Contact Parking không được liên kết với TollPlaza hoặc Office."

        elif self.contact_type == 'office':
            if self._m2m_has_values('tollplazas') or self._m2m_has_values('parkings'):
                errors['contact_type'] = "Contact Office không được liên kết với TollPlaza hoặc Parking."

        if errors:
            raise ValidationError(errors)

    def save(self, *args, **kwargs):
        """Tự động xóa liên kết không phù hợp khi thay đổi contact_type"""
        if self.pk:  # Chỉ áp dụng khi update (đã tồn tại)
            if self.contact_type == 'tollplaza':
                self.parkings.clear()
                self.offices.clear()
            elif self.contact_type == 'parking':
                self.tollplazas.clear()
                self.offices.clear()
            elif self.contact_type == 'office':
                self.tollplazas.clear()
                self.parkings.clear()

        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.firstname} {self.lastname or ''}".strip() or f"Contact #{self.id}"

    class Meta:
        db_table = 'contacts'
        verbose_name = "Contact"
        verbose_name_plural = "Contacts"
        ordering = ['firstname', 'lastname']