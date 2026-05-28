import pandas as pd
from contacts.models.tollplaza import Tollplaza
from contacts.models.contractor import Contractor
from contacts.models.project import Project
from contacts.models.type import Type


def run():
    file_path = "tollplaza.xlsx"
    df = pd.read_excel(file_path)

    created = 0
    skipped = 0

    for _, row in df.iterrows():

        name = str(row.get("name")).strip()

        # 🔥 CHECK EXISTS THEO NAME
        if Tollplaza.objects.filter(name=name).exists():
            print(f"SKIP (exists): {name}")
            skipped += 1
            continue

        contractor = Contractor.objects.filter(id=row.get("contractor_id")).first()
        project = Project.objects.filter(id=row.get("project_id")).first()
        type_obj = Type.objects.filter(id=row.get("type_id")).first()

        Tollplaza.objects.create(
            name=name,
            description=row.get("description", ""),
            address=row.get("address"),
            lat=row.get("lat"),
            lng=row.get("lng"),
            lanes=row.get("lanes") or 0,
            Contractor=contractor,
            project=project,
            type=type_obj,
        )

        created += 1

    print(f"Done. Created={created}, Skipped={skipped}")