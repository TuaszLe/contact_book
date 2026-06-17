from rest_framework import serializers
from .models import (
    Parking,
    Contact,
    Tollplaza,
    Contractor,
    Project,
    Title,
    Office,
)

# =========================
# SIMPLE SERIALIZERS (DROPDOWN / NESTED)
# =========================

class TitleSerializer(serializers.ModelSerializer):
    class Meta:
        model = Title
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
class ParkingSimpleSerializer(serializers.ModelSerializer):
    class Meta:
        model = Parking
        fields = ["id", "name"]
class OfficeSimpleSerializer(serializers.ModelSerializer):
    class Meta:
        model = Office
        fields = ["id", "name"]
class ContractorSimpleSerializer(serializers.ModelSerializer):
    class Meta:
        model = Contractor
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

    title_name = serializers.CharField(
        source="title.name",
        read_only=True
    )

    tollplazas = TollplazaSimpleSerializer(
        many=True,
        read_only=True
    )

    parkings = ParkingSimpleSerializer(
        many=True,
        read_only=True
    )

    offices = OfficeSimpleSerializer(
        many=True,
        read_only=True
    )
    contractors = ContractorSimpleSerializer(
        many=True,
        read_only=True
    )

    contact_location_type = serializers.SerializerMethodField()
    contact_location_name = serializers.SerializerMethodField()
    fullname = serializers.SerializerMethodField()
    class Meta:
        model = Contact
        fields = [
            "id",
            "firstname",
            "lastname",
            "fullname",
            "phone",
            "email",
            "status",

            "title",
            "title_name",

            "contact_type",

            "contact_location_type",
            "contact_location_name",

            "tollplazas",
            "parkings",
            "offices",
            "contractors",
        ]

    def get_contact_location_type(self, obj):

        if obj.contact_type == "tollplaza":
            return "tollplaza"

        elif obj.contact_type == "parking":
            return "parking"

        elif obj.contact_type == "office":
            return "office"

        elif obj.contact_type == "contractor":
            return "contractor"

        return None

    def get_contact_location_name(self, obj):

        if obj.contact_type == "tollplaza":
            return "; ".join(
                obj.tollplazas.values_list("name", flat=True)
        )

        elif obj.contact_type == "parking":

            return "; ".join(
            obj.parkings.values_list("name", flat=True)
        )

        elif obj.contact_type == "office":
            return ", ".join(
            obj.offices.values_list("name", flat=True)
        )

        elif obj.contact_type == "contractor":
            return ", ".join(
                obj.contractors.values_list("name", flat=True)
            )

        return None

    def get_fullname(self, obj):
        return f"{obj.lastname} {obj.firstname}"

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
class OfficeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Office
        fields = [
            "id",
            "name",
            "status",
            "created_at",
            "updated_at",
        ]
class ContractorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Contractor
        fields = [
            "id",
            "name",
            "status",
            "created_at",
            "updated_at",
        ]