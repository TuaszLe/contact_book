from rest_framework import serializers
from .models import (
    Parking,
    Contact,
    Tollplaza,
    Department,
    Contractor,
    Project,
    Title,
)

# =========================
# SIMPLE SERIALIZERS (DROPDOWN / NESTED)
# =========================

class TitleSerializer(serializers.ModelSerializer):
    class Meta:
        model = Title
        fields = ["id", "name"]


class DepartmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Department
        fields = ["id", "name"]


class ContractorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Contractor
        fields = ["id", "name"]


class ProjectSerializer(serializers.ModelSerializer):
    class Meta:
        model = Project
        fields = ["id", "name"]


class TollplazaSimpleSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tollplaza
        fields = ["id", "name"]


# =========================
# MAIN SERIALIZERS
# =========================

class TollplazaSerializer(serializers.ModelSerializer):
    project_name = serializers.CharField(source="project.name", read_only=True)
    type_name = serializers.CharField(source="type.name", read_only=True)
    channel_codes = serializers.SerializerMethodField()
    channel_names = serializers.SerializerMethodField()

    class Meta:
        model = Tollplaza
        fields = [
            "id",
            "name",
            "description",
            "address",
            "lat",
            "lng",
            "project",
            "project_name",
            "channel_codes",
            "channel_names",
            "type_name",
            "lanes",
            "status",
            "created_at",
            "updated_at",
        ]

    def get_channel_codes(self, obj):
        return [tc.code for tc in obj.tollplaza_channel_set.all()]

    def get_channel_names(self, obj):
        return [tc.channel.name for tc in obj.tollplaza_channel_set.all()]


class ContactSerializer(serializers.ModelSerializer):
    # display name cho FK
    title_name = serializers.CharField(source="title.name", read_only=True)
    department_name = serializers.CharField(source="department.name", read_only=True)

    # many-to-many
    tollplazas = TollplazaSimpleSerializer(many=True, read_only=True)

    class Meta:
        model = Contact
        fields = [
            "id",
            "firstname",
            "lastname",
            "phone",
            "email",
            "status",
            "title",
            "title_name",
            "department",
            "department_name",
            "tollplazas",
        ]

class ParkingSerializer(serializers.ModelSerializer):
    contractor_name = serializers.CharField(source='contractor.name', read_only=True)
    type_name = serializers.CharField(source='type.name', read_only=True)

    class Meta:
        model = Parking
        fields = [
            "id",
            "name",
            "description",
            "address",
            "contractor",
            "contractor_name",
            "type",
            "type_name",
            "lanes",
            "status",
            "created_at",
            "updated_at",
        ]