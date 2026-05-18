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
    list_display = ('firstname', 'lastname', 'email', 'phone', 'title', 'contact_type', 'status')
    list_filter = ('title', 'contact_type', 'status')
    search_fields = ('firstname', 'lastname', 'email', 'phone')
    autocomplete_fields = ['title']
    ordering = ( 'firstname','lastname',)
    @admin.display(description='Họ')
    def firstname(self, obj):
        return obj.firstname

    @admin.display(description='Tên')
    def lastname(self, obj):
        return obj.lastname

    @admin.display(description='Email')
    def email(self, obj):
        return obj.email

    @admin.display(description='Số điện thoại')
    def phone(self, obj):
        return obj.phone

    @admin.display(description='Chức vụ')
    def title(self, obj):
        return obj.title

    @admin.display(description='Loại liên hệ')
    def contact_type(self, obj):
        return obj.get_contact_type_display()

    @admin.display(description='Trạng thái')
    def status(self, obj):
        return 'Hoạt động' if obj.status == 1 else 'Ngừng hoạt động'

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


# ====================
# BUSINESS ENTITIES
# ====================

class TollplazaAdmin(admin.ModelAdmin):
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

# Junction tables - chỉ giữ Tollplaza_channel (có thêm field code)
admin.site.register(Tollplaza_channel, TollplazaChannelAdmin)

