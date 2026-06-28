from datetime import datetime
from flask_sqlalchemy import SQLAlchemy
from werkzeug.security import generate_password_hash, check_password_hash

db = SQLAlchemy()

class Department(db.Model):
    __tablename__ = 'departments'
    
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), unique=True, nullable=False) # e.g., Technical, Call Center
    
    # Relationship: One department has many staff members
    staff = db.relationship('User', backref='department', lazy=True)

    def __repr__(self):
        return f"<Department {self.name}>"

class User(db.Model):
    __tablename__ = 'users'
    
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    password_hash = db.Column(db.String(200), nullable=False) # The security lock
    role = db.Column(db.String(20), nullable=False) # 'CEO', 'MANAGER', 'STAFF'
    department_id = db.Column(db.Integer, db.ForeignKey('departments.id'), nullable=True) # CEO might not have a department
    
    # Relationship: One staff member has many daily reports
    reports = db.relationship('DailyReport', backref='staff', lazy=True)

    def set_password(self, password):
        self.password_hash = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password_hash, password)

    def __repr__(self):
        return f"<User {self.username} - {self.role}>"

class DailyReport(db.Model):
    __tablename__ = 'daily_reports'
    
    id = db.Column(db.Integer, primary_key=True)
    staff_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    
    # Raw Data from the Staff
    qna_responses = db.Column(db.JSON, nullable=False) # Stores the short Q&A answers
    daily_description = db.Column(db.Text, nullable=False) # The written summary of work
    
    # The AI Evaluator Output
    ai_score = db.Column(db.Float, nullable=True) # Score out of 10
    
    # Metadata
    submitted_at = db.Column(db.DateTime, default=datetime.utcnow)
    status = db.Column(db.String(20), default='PENDING_REVIEW') # 'PENDING_REVIEW', 'REVIEWED_BY_CEO'

    def __repr__(self):
        return f"<DailyReport {self.id} | Score: {self.ai_score}/10>"