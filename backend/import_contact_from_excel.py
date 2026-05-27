from contacts.models import Contact, Tollplaza, Office, Parking, Titles
import pandas as pd

filepath="contacts_import.xlsx"
def get_obj_by_name(model, name):
    try:
        return model.objects.get(name=name)
    except model.DoesNotExist:
        return None


def preview_contacts_from_excel(filepath):
    df = pd.read_excel(filepath)

    for index, row in df.iterrows():
        try:
            firstname = row.get('firstname')
            lastname = row.get('lastname', '')
            email = row.get('Email')
            phone = row.get('Phone')
            contact_type = row.get('Contact_type')
            title_name = row.get('Title')

            # ===== TITLE =====
            title = get_obj_by_name(Titles, title_name) if pd.notna(title_name) else None

            # ===== PRINT BASIC INFO =====
            print("\n==============================")
            print(f"ROW {index + 2}")
            print(f"Name        : {firstname} {lastname}")
            print(f"Email       : {email}")
            print(f"Phone       : {phone}")
            print(f"Type        : {contact_type}")
            print(f"Title       : {title.name if title else None}")

            # ===== M2M PREVIEW =====
            if contact_type == 'tollplaza' and pd.notna(row.get('Tollplazas')):
                names = [x.strip() for x in str(row['Tollplazas']).split(',')]
                objs = list(Tollplaza.objects.filter(name__in=names))
                print("Tollplazas  :", [o.name for o in objs])

                missing = set(names) - set([o.name for o in objs])
                if missing:
                    print("⚠ Missing TP:", missing)

            elif contact_type == 'parking' and pd.notna(row.get('Parkings')):
                names = [x.strip() for x in str(row['Parkings']).split(',')]
                objs = list(Parking.objects.filter(name__in=names))
                print("Parkings    :", [o.name for o in objs])

                missing = set(names) - set([o.name for o in objs])
                if missing:
                    print("⚠ Missing Parking:", missing)

            elif contact_type == 'office' and pd.notna(row.get('Offices')):
                names = [x.strip() for x in str(row['Offices']).split(',')]
                objs = list(Office.objects.filter(name__in=names))
                print("Offices     :", [o.name for o in objs])

                missing = set(names) - set([o.name for o in objs])
                if missing:
                    print("⚠ Missing Office:", missing)

        except Exception as e:
            print(f"❌ ROW {index + 2} ERROR: {e}")


def import_contacts_from_excel(filepath):
    preview_contacts_from_excel(filepath)