from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
from models import db, User, Department, DailyReport
from evaluation_service import AIEvaluator

app = Flask(__name__)

# 1. Configuration & Middleware
CORS(app) # Allows your React frontend to communicate with Flask
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///randaframes.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['JWT_SECRET_KEY'] = 'cinematic-super-secret-key-2026' # Change this in production!

# 2. Initialization
db.init_app(app)
jwt = JWTManager(app) # The Security Bouncer
ai_engine = AIEvaluator()


# ==========================================
# AUTHENTICATION ROUTES
# ==========================================

@app.route('/api/v1/auth/login', methods=['POST'])
# --- NEW: FETCH DEPARTMENTS FOR SIGNUP ---
@app.route('/api/v1/departments', methods=['GET'])
def get_departments():
    departments = Department.query.all()
    result = [{"id": d.id, "name": d.name} for d in departments]
    return jsonify(result), 200

# --- NEW: STAFF REGISTRATION ROUTE ---
@app.route('/api/v1/auth/register', methods=['POST'])
def register():
    data = request.json
    username = data.get('username')
    password = data.get('password')
    department_id = data.get('department_id')

    # Check if the username is already taken
    if User.query.filter_by(username=username).first():
        return jsonify({"success": False, "error": "Username already exists. Please choose another."}), 400

    # Create the new user (Hardcoded to 'STAFF' so people can't register as CEO)
    new_user = User(
        username=username,
        role='STAFF',
        department_id=department_id
    )
    new_user.set_password(password) # Securely hash the password
    
    db.session.add(new_user)
    db.session.commit()

    return jsonify({"success": True, "message": "Account created successfully. You can now log in."}), 201
def login():
    data = request.json
    username = data.get('username')
    password = data.get('password')

    user = User.query.filter_by(username=username).first()

    # Verify user exists and password is correct
    if user and user.check_password(password):
        # Generate the secure token containing their ID and Role
        access_token = create_access_token(
            identity={"id": user.id, "role": user.role, "username": user.username}
        )
        return jsonify({
            "success": True,
            "message": "Login successful",
            "access_token": access_token,
            "user": {
                "id": user.id,
                "role": user.role,
                "username": user.username
            }
        }), 200

    return jsonify({"success": False, "error": "Invalid username or password"}), 401


# ==========================================
# PROTECTED KPI ROUTES
# ==========================================

@app.route('/api/v1/reports/submit', methods=['POST'])
@jwt_required()
def submit_report():
    current_user = get_jwt_identity()
    
    # Strictly enforce that only STAFF can submit reports
    if current_user['role'] != 'STAFF':
        return jsonify({"success": False, "error": "Unauthorized. Only staff can submit reports."}), 403

    data = request.json
    qna_responses = data.get('qna_responses', {})
    daily_description = data.get('daily_description', "")
    
    # 1. Run the Smart Logic
    calculated_score = ai_engine.evaluate_submission(qna_responses, daily_description)
    
    # 2. Save to Database using the ID from the secure token
    new_report = DailyReport(
        staff_id=current_user['id'],
        qna_responses=qna_responses,
        daily_description=daily_description,
        ai_score=calculated_score,
        status='PENDING_REVIEW'
    )
    
    db.session.add(new_report)
    db.session.commit()
    
    return jsonify({
        "success": True,
        "message": "Report submitted successfully",
        "ai_score": calculated_score
    }), 201


@app.route('/api/v1/reports', methods=['GET'])
@jwt_required()
def get_all_reports():
    current_user = get_jwt_identity()
    
    # Strictly enforce that only the CEO can view the global dashboard
    if current_user['role'] != 'CEO':
        return jsonify({"success": False, "error": "Unauthorized. CEO access required."}), 403

    reports = DailyReport.query.order_by(DailyReport.submitted_at.desc()).all()
    result = []
    
    for r in reports:
        staff = User.query.get(r.staff_id)
        
        dept_name = "Unassigned"
        if staff and staff.department_id:
            dept = Department.query.get(staff.department_id)
            dept_name = dept.name if dept else "Unassigned"
            
        result.append({
            "id": r.id,
            "name": staff.username if staff else "Unknown Staff",
            "dept": dept_name,
            "ai_score": r.ai_score,
            "description": r.daily_description
        })
        
    return jsonify(result), 200


# ==========================================
# SERVER STARTUP
# ==========================================

with app.app_context():
    db.create_all()

if __name__ == '__main__':
    app.run(debug=True, port=5000)