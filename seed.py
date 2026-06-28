from app import app
from models import db, User, Department

def seed_database():
    with app.app_context():
        print("Dropping existing tables...")
        db.drop_all()
        
        print("Creating fresh tables...")
        db.create_all()

        print("Creating Departments...")
        tech_dept = Department(name="Technical")
        call_center = Department(name="Call Center")
        db.session.add_all([tech_dept, call_center])
        db.session.commit()

        print("Creating the CEO (Admin) Account...")
        ceo = User(username="admin_ceo", role="CEO")
        ceo.set_password("ceo123") # Super secure password for testing
        
        print("Creating a Test Staff Account...")
        staff = User(username="tech_staff1", role="STAFF", department_id=tech_dept.id)
        staff.set_password("staff123")
        
        db.session.add_all([ceo, staff])
        db.session.commit()

        print("Database successfully seeded!")
        print("-> CEO Login: admin_ceo / ceo123")
        print("-> Staff Login: tech_staff1 / staff123")

if __name__ == '__main__':
    seed_database()