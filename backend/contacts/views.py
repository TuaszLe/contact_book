from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.db.models import Q
from django.shortcuts import get_object_or_404
import traceback
import unicodedata

from .models import Contact, Tollplaza, Contractor, Project, Parking, Office
from .serializers import (
    ContactSerializer,
    TollplazaSerializer,
    ContractorSerializer,
    ProjectSerializer,
    ParkingSerializer,
    OfficeSerializer,
)


def remove_accents(text):
    if not text:
        return ""
    text = unicodedata.normalize('NFD', str(text))
    text = ''.join(c for c in text if unicodedata.category(c) != 'Mn')
    return text.lower()


def m(value, keyword_lower, keyword_no_accent):
    if not value:
        return False
    return (
        keyword_lower in str(value).lower() or
        keyword_no_accent in remove_accents(value)
    )


# ========================
# CONTACT LIST
# ========================

@api_view(["GET"])
def contact_list_api(request):

    queryset = Contact.objects.select_related(
        "title"
    ).all()

    title = request.GET.get("title")

    if title:
        queryset = queryset.filter(title_id=title)

    queryset = queryset.order_by("firstname")

    serializer = ContactSerializer(queryset, many=True)

    return Response(serializer.data)


# ========================
# TOLLPLAZA LIST
# ========================

@api_view(["GET"])
def tollplaza_list_api(request):

    queryset = Tollplaza.objects.select_related(
        "project", "type"
    ).prefetch_related(
        "tollplaza_channel_set__channel"
    ).all()

    project = request.GET.get("project")
    type_ = request.GET.get("type")
    channel = request.GET.get("channel")
    channel_code = request.GET.get("channel_code")

    if project:
        queryset = queryset.filter(project_id=project)

    if type_:
        queryset = queryset.filter(type=type_)
    if channel:
        queryset = queryset.filter(tollplaza_channel__channel_id=channel)
    if channel_code:
        queryset = queryset.filter(tollplaza_channel__code__icontains=channel_code)

    serializer = TollplazaSerializer(queryset, many=True)

    return Response(serializer.data)


# ========================
# CONTRACTOR LIST
# ========================

@api_view(["GET"])
def contractor_list_api(request):

    queryset = Contractor.objects.all().order_by("name")

    serializer = ContractorSerializer(queryset, many=True)

    return Response(serializer.data)


@api_view(["GET"])
def contractor_detail_api(request, pk):

    contractor = get_object_or_404(Contractor.objects.all(), pk=pk)
    contacts = contractor.contacts.all()

    return Response({
        "contractor": ContractorSerializer(contractor).data,
        "contacts": ContactSerializer(contacts, many=True).data
    })
# ========================
# PROJECT LIST
# ========================

@api_view(["GET"])
def project_list_api(request):

    queryset = Project.objects.all().order_by("name")

    serializer = ProjectSerializer(queryset, many=True)

    return Response(serializer.data)


@api_view(["GET"])
def tollplaza_detail_api(request, pk):

    tollplaza = get_object_or_404(
        Tollplaza.objects.select_related(
            "project", "type"
        ).prefetch_related(
            "tollplaza_channel_set__channel"
        ),
        pk=pk
    )

    contacts = tollplaza.contacts.all()

    return Response({
        "tollplaza": TollplazaSerializer(tollplaza).data,
        "contacts": ContactSerializer(contacts, many=True).data
    })


@api_view(["GET"])
def parking_list_api(request):

    queryset = Parking.objects.select_related("contractor", "type").all()

    contractor = request.GET.get("contractor")
    type_filter = request.GET.get("type")

    if contractor:
        queryset = queryset.filter(contractor_id=contractor)

    if type_filter:
        queryset = queryset.filter(type_id=type_filter)

    serializer = ParkingSerializer(queryset, many=True)

    return Response(serializer.data)


@api_view(["GET"])
def parking_detail_api(request, pk):

    parking = get_object_or_404(
        Parking.objects.select_related("contractor", "type"),
        pk=pk
    )

    contacts = parking.contacts.all()

    return Response({
        "parking": ParkingSerializer(parking).data,
        "contacts": ContactSerializer(contacts, many=True).data
    })


@api_view(["GET"])
def office_list_api(request):

    queryset = Office.objects.all().order_by("name")

    serializer = OfficeSerializer(queryset, many=True)

    return Response(serializer.data)

@api_view(["GET"])
def office_detail_api(request, pk):

    office = get_object_or_404(Office.objects.all(), pk=pk)
    contacts = office.contacts.all()

    return Response({
        "office": OfficeSerializer(office).data,
        "contacts": ContactSerializer(contacts, many=True).data
    })

@api_view(["GET"])
def global_search(request):
    try:
        keyword = request.GET.get("q", "").strip()
        if not keyword:
            return Response({
                "contacts": [],
                "tollplazas": [],
                "projects": [],
                "contractors": [],
                "parkings": []
            })

        keyword_lower = keyword.lower()
        keyword_no_accent = remove_accents(keyword)

        # =========================
        # CONTACT
        # =========================
        all_contacts = Contact.objects.select_related("title").all()
        contacts = [
            c for c in all_contacts
            if m(c.fullname, keyword_lower, keyword_no_accent)
            or m(c.phone, keyword_lower, keyword_no_accent)
        ]

        # =========================
        # TOLLPLAZA
        # =========================
        all_tollplazas = Tollplaza.objects.select_related("project", "type").all()
        tollplazas = [
            t for t in all_tollplazas
            if m(t.name, keyword_lower, keyword_no_accent)
            # or m(t.address, keyword_lower, keyword_no_accent)
            or m(t.project.name if t.project else None, keyword_lower, keyword_no_accent)
        ]

        # =========================
        # PROJECT
        # =========================
        projects = [
            p for p in Project.objects.all()
            if m(p.name, keyword_lower, keyword_no_accent)
        ]

        # =========================
        # CONTRACTOR
        # =========================
        contractors = [
            c for c in Contractor.objects.all()
            if m(c.name, keyword_lower, keyword_no_accent)
        ]

        # =========================
        # PARKING
        # =========================
        all_parkings = Parking.objects.select_related("contractor", "type").all()
        parkings = [
            p for p in all_parkings
            if m(p.name, keyword_lower, keyword_no_accent)
            # or m(p.address, keyword_lower, keyword_no_accent)
            or m(p.contractor.name if p.contractor else None, keyword_lower, keyword_no_accent)
        ]

        return Response({
            "contacts": ContactSerializer(contacts, many=True).data,
            "tollplazas": TollplazaSerializer(tollplazas, many=True).data,
            "projects": ProjectSerializer(projects, many=True).data,
            "contractors": ContractorSerializer(contractors, many=True).data,
            "parkings": ParkingSerializer(parkings, many=True).data,
        })

    except Exception as e:
        traceback.print_exc()
        return Response({"error": str(e)}, status=500)
