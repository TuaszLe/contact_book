from django import forms
from django.contrib import admin
from django.shortcuts import get_object_or_404

from .models import (
    Title,
    Project,
    Contractor,
    Tollplaza,
    Contact,
    Parking,
    Type,
    Channel,
    Tollplaza_channel,
    Office
)


# ====================
# CORE ENTITIES
# ====================


class TitleAdmin(admin.ModelAdmin):
    list_display = ('name', 'description', 'status')
    list_filter = ('status',)
    search_fields = ('name', 'description')
    ordering = ('name',)


class ContactAdmin(admin.ModelAdmin):
    class ContactAdminForm(forms.ModelForm):
        class Meta:
            model = Contact
            fields = '__all__'

        def clean(self):
            cleaned_data = super().clean()
            contact_type = cleaned_data.get('contact_type')

            if contact_type == 'tollplaza':
                cleaned_data['parkings'] = []
                cleaned_data['offices'] = []
            elif contact_type == 'parking':
                cleaned_data['tollplazas'] = []
                cleaned_data['offices'] = []
            elif contact_type == 'office':
                cleaned_data['tollplazas'] = []
                cleaned_data['parkings'] = []

            return cleaned_data
        def clean_phone(self):
            phone = self.cleaned_data.get("phone")

            if phone and Contact.objects.filter(phone=phone).exclude(pk=self.instance.pk).exists():
                raise forms.ValidationError("Số điện thoại đã tồn tại")

            return phone

    form = ContactAdminForm
    list_display = ('firstname', 'lastname', 'email', 'phone', 'title', 'contact_type', 'status')
    list_filter = ('title', 'contact_type', 'status')
    search_fields = ('firstname', 'lastname', 'email', 'phone')
    autocomplete_fields = ['title', 'tollplazas', 'parkings', 'offices']
    ordering = ( 'firstname','lastname',)
    search_fields = ('name',)
    class Media:
        js = ('admin/js/contact_dynamic.js',)

class ContractorAdmin(admin.ModelAdmin):
    list_display = ('name', 'description', 'status')
    list_filter = ('status',)
    search_fields = ('name', 'description')
    ordering = ('name',)


class TypeAdmin(admin.ModelAdmin):
    list_display = ('name', 'description', 'status')
    list_filter = ('status',)
    search_fields = ('name', 'description')
    ordering = ('name',)


class ProjectAdmin(admin.ModelAdmin):
    list_display = ('name', 'description', 'status')
    list_filter = ('status',)
    search_fields = ('name', 'description')
    ordering = ('name',)
class OfficeAdmin(admin.ModelAdmin):
    list_display = ('name', 'status')
    list_filter = ('status',)
    search_fields = ('name',)
    ordering = ('name',)

# ====================
# BUSINESS ENTITIES
# ====================

class TollplazaAdmin(admin.ModelAdmin):
    class TollplazaAdminForm(forms.ModelForm):

        class Meta:
            model = Tollplaza
            fields = "__all__"

        def clean_name(self):
            name = self.cleaned_data.get("name")

            if name and Tollplaza.objects.filter(name=name).exclude(pk=self.instance.pk).exists():
                raise forms.ValidationError("TollPlaza đã tồn tại")

            return name
    form = TollplazaAdminForm
    list_display = ('name', 'address', 'project', 'type', 'lanes', 'status')
    list_filter = ('project', 'type', 'status')
    search_fields = ('name', 'address', 'description')
    autocomplete_fields = ('project', 'type', 'contractor')
    ordering = ('name',)

class ParkingAdmin(admin.ModelAdmin):
    list_display = ('name', 'address', 'contractor', 'type', 'lanes', 'status')
    list_filter = ('contractor', 'type', 'status')
    search_fields = ('name', 'address', 'description')
    autocomplete_fields = ('contractor', 'type')
    ordering = ('name',)


# ====================
# JUNCTION TABLES
# ====================

class TollplazaChannelAdmin(admin.ModelAdmin):
    list_display = ('tollplaza', 'channel', 'code', 'status')
    list_filter = ('status',)
    autocomplete_fields = ('tollplaza', 'channel')

class ChannelAdmin(admin.ModelAdmin):
    list_display = ('name', 'provider', 'description', 'status')
    list_filter = ('provider', 'status')
    search_fields = ('name', 'provider', 'description')
    ordering = ('name',)
# ====================
# REGISTRATION
# ====================

admin.site.register(Title, TitleAdmin)
admin.site.register(Contact, ContactAdmin)
admin.site.register(Contractor, ContractorAdmin)
admin.site.register(Type, TypeAdmin)
admin.site.register(Project, ProjectAdmin)
admin.site.register(Tollplaza, TollplazaAdmin)
admin.site.register(Parking, ParkingAdmin)
admin.site.register(Channel, ChannelAdmin)
admin.site.register(Office, OfficeAdmin)

# Junction tables - chỉ giữ Tollplaza_channel (có thêm field code)
admin.site.register(Tollplaza_channel, TollplazaChannelAdmin)

