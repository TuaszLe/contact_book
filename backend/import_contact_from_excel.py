import os
import sys
import django
import pandas as pd

# =====================================================
# DJANGO SETUP
# =====================================================

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
if BASE_DIR not in sys.path:
    sys.path.append(BASE_DIR)

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "backend.settings")
django.setup()

# =====================================================
# IMPORT MODELS
# =====================================================

from contacts.models.contact import Contact
from contacts.models.tollplaza import Tollplaza
from contacts.models.office import Office
from contacts.models.parking import Parking
from contacts.models.title import Titles

filepath = "contact.xlsx"


def get_obj_by_name(model, name):
    try:
        return model.objects.get(name=name)
    except model.DoesNotExist:
        return None


def parse_names(value):
    if pd.isna(value):
        return []
    return [item.strip() for item in str(value).split(",") if item.strip()]


def normalize_value(value):
    if pd.isna(value):
        return None
    if isinstance(value, str):
        value = value.strip()
        return value if value else None
    return value


def get_related_objects(contact_type, row):
    if contact_type == "tollplaza":
        return Tollplaza.objects.filter(name__in=parse_names(row.get("Tollplazas") or row.get("tollplazas")))
    if contact_type == "parking":
        return Parking.objects.filter(name__in=parse_names(row.get("Parkings") or row.get("parkings")))
    if contact_type == "office":
        return Office.objects.filter(name__in=parse_names(row.get("Offices") or row.get("offices")))
    return []


def import_contacts_from_excel(filepath):
    df = pd.read_excel(filepath)

    print("========== EXCEL COLUMNS ==========")
    print(df.columns.tolist())

    for index, row in df.iterrows():
        try:
            firstname = normalize_value(row.get("first_name") or row.get("firstname") or row.get("first name"))
            lastname = normalize_value(row.get("last_name") or row.get("lastname") or row.get("last name")) or ""
            email = normalize_value(row.get("email"))
            phone = normalize_value(row.get("phone_number") or row.get("phone") or row.get("phone number"))
            contact_type = normalize_value(row.get("contact_type") or row.get("type"))
            contact_type = str(contact_type).strip().lower() if contact_type else ""
            title_name = normalize_value(row.get("title_name") or row.get("title"))

            if not firstname:
                raise ValueError("Missing required field first_name")

            title = None
            if pd.notna(title_name) and title_name:
                title = get_obj_by_name(Titles, title_name)

            related_objs = get_related_objects(contact_type, row)
            related_names = [obj.name for obj in related_objs]
            raw_values = parse_names(row.get("Tollplazas") or row.get("Parkings") or row.get("Offices") or row.get("tollplazas") or row.get("parkings") or row.get("offices"))
            missing_names = set(raw_values) - set(related_names)

            contact_data = {
                "firstname": firstname,
                "lastname": lastname,
                "email": email,
                "contact_type": contact_type if contact_type in ["tollplaza", "parking", "office"] else None,
                "title": title,
            }

            if phone:
                contact, created = Contact.objects.update_or_create(phone=phone, defaults=contact_data)
            else:
                contact = Contact.objects.create(**contact_data)
                created = True

            if contact_type == "tollplaza":
                contact.tollplazas.set(related_objs)
            elif contact_type == "parking":
                contact.parkings.set(related_objs)
            elif contact_type == "office":
                contact.offices.set(related_objs)

            contact.save()

            print("\n==============================")
            print(f"ROW           : {index + 2}")
            print(f"Created       : {created}")
            print(f"Contact       : {contact}")
            print(f"Email         : {email}")
            print(f"Phone         : {phone}")
            print(f"Type          : {contact_type}")
            print(f"Title         : {title or 'N/A'}")
            print(f"Related names : {related_names}")
            if missing_names:
                print(f"⚠ Missing names in DB: {sorted(missing_names)}")

        except Exception as e:
            print(f"❌ ROW {index + 2} ERROR: {e}")


if __name__ == "__main__":
    import_contacts_from_excel(filepath)
