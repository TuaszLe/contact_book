from django.contrib import admin
from django.shortcuts import get_object_or_404
from .models import (
    Title,
    Project,
    #Department,
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

# class DepartmentAdmin(admin.ModelAdmin):
#     list_display = ('name', 'description', 'status')
#     list_filter = ('status',)
#     search_fields = ('name', 'description')
#     ordering = ('name',)


class TitleAdmin(admin.ModelAdmin):
    list_display = ('name', 'description', 'status')
    list_filter = ('status',)
    search_fields = ('name', 'description')
    ordering = ('name',)


class ContactAdmin(admin.ModelAdmin):
    # list_display = ('firstname', 'lastname', 'email', 'phone', 'department', 'title', 'status')
    # list_filter = ('department', 'title', 'status')
    # raw_id_fields = ('department', 'title')
    list_display = ('firstname', 'lastname', 'email', 'phone', 'title', 'status')
    list_filter = ('title', 'status')
    search_fields = ('firstname', 'email', 'phone')
    raw_id_fields = ['title']
    ordering = ( 'firstname','lastname',)


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
    raw_id_fields = ('project', 'type')
    ordering = ('name',)


class ParkingAdmin(admin.ModelAdmin):
    list_display = ('name', 'address', 'contractor', 'type', 'lanes', 'status')
    list_filter = ('contractor', 'type', 'status')
    search_fields = ('name', 'address', 'description')
    raw_id_fields = ('contractor', 'type')
    ordering = ('name',)


# ====================
# JUNCTION TABLES
# ====================

class TollplazaChannelAdmin(admin.ModelAdmin):
    list_display = ('tollplaza', 'channel', 'code', 'status')
    list_filter = ('status',)
    raw_id_fields = ('tollplaza', 'channel')

class ChannelAdmin(admin.ModelAdmin):
    list_display = ('name', 'provider', 'description', 'status')
    list_filter = ('provider', 'status')
    search_fields = ('name', 'provider', 'description')
    ordering = ('name',)
# ====================
# REGISTRATION
# ====================

#admin.site.register(Department, DepartmentAdmin)
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

