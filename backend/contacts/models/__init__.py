# models/__init__.py
from .user import User, Role
from .project import Project
from .contractor import Contractor
from .type import Type
from .channel import Channel
from .title import Titles
from .contact import Contact
from .office import Office
from .tollplaza import Tollplaza
from .parking import Parking
from .contractor import Contractor
from .junction import (
    Tollplaza_channel,
    Parking_channel,
    # Tollplaza_contractor,
    # Tollplaza_contact,
    # Parking_contact,
)

# Alias for convenience
Title = Titles