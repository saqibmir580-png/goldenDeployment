import sys, os, random
from faker import Faker
from datetime import datetime, date

sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from app.database import SessionLocal, engine, engine
from app import models

# Drop and recreate all tables
print("Initializing database...")
models.Base.metadata.drop_all(bind=engine)
models.Base.metadata.create_all(bind=engine)
print("Database initialized successfully.")

# Drop and recreate all tables
print("Initializing database...")
models.Base.metadata.drop_all(bind=engine)
models.Base.metadata.create_all(bind=engine)
print("Database initialized successfully.")

fake = Faker()
db = SessionLocal()

# Dummy file generator
def create_dummy_file(path, is_image=False):
    os.makedirs(os.path.dirname(path), exist_ok=True)
    with open(path, "wb") as f:
        if is_image:
            # Minimal JPEG header for fake image
            f.write(b"\xff\xd8\xff\xe0FakeJPEG")
        else:
            # Minimal PDF header
            f.write(b"%PDF-1.4\n%Fake PDF content\n%%EOF")

doc_types = [
    ("passport", "pdf"),
    ("emirates_id", "pdf"),
    ("marriage_certificate", "pdf"),
    ("property_document", "pdf"),
    ("photo", "jpg")
]

NUM_USERS = 10

for i in range(NUM_USERS):
    # 1. Create user
    user = models.User(
        name=fake.name(),
        email=fake.unique.email(),
        dob=fake.date_of_birth(minimum_age=18, maximum_age=65),
        address=fake.address(),
        contact_number=fake.phone_number(),
        image=fake.image_url(),
        is_verified=fake.boolean(),
        gender=random.choice(['male', 'female']),
        password="hashedpassword123",
        role="user",
        created_at=datetime.utcnow()
    )
    db.add(user)
    db.commit()
    db.refresh(user)

    # 2. Application
    application = models.Application(
        user_id=user.id,
        overall_status="pending",
        remarks="Auto-generated user",
        created_at=datetime.utcnow()
    )
    db.add(application)
    db.commit()

    # 3. Create dummy documents
    user_folder = f"uploads/user_{user.id}"
    for doc_type, ext in doc_types:
        file_path = f"{user_folder}/{doc_type}.{ext}"
        create_dummy_file(file_path, is_image=(ext == "jpg"))

        document = models.Document(
            user_id=user.id,
            document_type=doc_type,
            file_path=file_path,
            status="pending",
            validation_result=None
        )
        db.add(document)

    db.commit()
    print(f"✅ Created user {user.name} with documents")

db.close()
print("🎉 All fake users and documents created.")
