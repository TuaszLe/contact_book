from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.db.models import Q
from django.shortcuts import get_object_or_404
import traceback

from .models import Contact, Tollplaza, Department, Contractor, Project, Parking
from .serializers import (
    ContactSerializer,
    TollplazaSerializer,
    DepartmentSerializer,
    ContractorSerializer,
    ProjectSerializer,
    ParkingSerializer
)


# ========================
# CONTACT LIST
# ========================

@api_view(["GET"])
def contact_list_api(request):

    queryset = Contact.objects.select_related(
        # "department",
        "title"
    ).all()

    # search = request.GET.get("search")
    # department = request.GET.get("department")
    title = request.GET.get("title")

    # if search:
    #     queryset = queryset.filter(
    #         Q(name__icontains=search) |
    #         Q(email__icontains=search) |
    #         Q(phone__icontains=search)
    #     )


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

    # search = request.GET.get("search")
    project = request.GET.get("project")
    type_ = request.GET.get("type")
    channel = request.GET.get("channel")
    channel_code = request.GET.get("channel_code")

    # if search:
    #     queryset = queryset.filter(
    #         Q(name__icontains=search) |
    #         Q(project__name__icontains=search)
    #     )

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
# DEPARTMENT LIST
# ========================

@api_view(["GET"])
def department_list_api(request):

    queryset = Department.objects.all().order_by("name")

    serializer = DepartmentSerializer(queryset, many=True)

    return Response(serializer.data)


# ========================
# CONTRACTOR LIST
# ========================

@api_view(["GET"])
def contractor_list_api(request):

    queryset = Contractor.objects.all().order_by("name")

    serializer = ContractorSerializer(queryset, many=True)

    return Response(serializer.data)


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

    contacts = Contact.objects.filter(tollplaza_contact__tollplaza=tollplaza)

    return Response({
        "tollplaza": TollplazaSerializer(tollplaza).data,
        "contacts": ContactSerializer(contacts, many=True).data
    })

@api_view(["GET"])
def parking_list_api(request):

    queryset = Parking.objects.select_related("contractor", "type").all()

    # search = request.GET.get("search")
    contractor = request.GET.get("contractor")
    type_filter = request.GET.get("type")

    # if search:
    #     queryset = queryset.filter(
    #         Q(name__icontains=search) |
    #         Q(description__icontains=search) |
    #         Q(address__icontains=search)
    #     )

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

    contacts = Contact.objects.filter(parking_contact__parking=parking)

    return Response({
        "parking": ParkingSerializer(parking).data,
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

        # =========================
        # CONTACT
        # =========================
        contacts = Contact.objects.filter(
            Q(firstname__icontains=keyword) |
            Q(phone__icontains=keyword)
        ).distinct()[:5]

        # =========================
        # TOLLPLAZA
        # =========================
        tollplazas = Tollplaza.objects.filter(
            Q(name__icontains=keyword) |
            Q(project__name__icontains=keyword) |
            Q(address__icontains=keyword) |
            Q(tollplaza_channel__code__icontains=keyword)
        ).select_related("project", "type").distinct()[:5]

        # =========================
        # PROJECT
        # =========================
        projects = Project.objects.filter(
            Q(name__icontains=keyword)
        )[:5]

        # =========================
        # CONTRACTOR
        # =========================
        contractors = Contractor.objects.filter(
            Q(name__icontains=keyword)
        )[:5]

        # =========================
        # PARKING
        # =========================
        parkings = Parking.objects.filter(
            Q(name__icontains=keyword) |
            Q(address__icontains=keyword) |
            Q(contractor__name__icontains=keyword)
        ).select_related("contractor", "type")[:5]

        return Response({
            "contacts": ContactSerializer(contacts, many=True).data,
            "tollplazas": TollplazaSerializer(tollplazas, many=True).data,
            "projects": ProjectSerializer(projects, many=True).data,
            "contractors": ContractorSerializer(contractors, many=True).data,
            "parkings": ParkingSerializer(parkings, many=True).data,
        })
    except Exception as e:
        print("ERROR:", e)
        traceback.print_exc()
        return Response({"error": str(e)}, status=500)
