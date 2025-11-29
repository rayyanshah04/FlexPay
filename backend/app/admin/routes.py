from flask import render_template, request, redirect, url_for, flash, session
from werkzeug.security import check_password_hash
from functools import wraps
from app.database import db
from . import admin_bp

def login_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        if 'admin_id' not in session:
            return redirect(url_for('admin.login'))
        return f(*args, **kwargs)
    return decorated_function

@admin_bp.route('/')
def index():
    return render_template('admin/dashboard.html')

@admin_bp.route('/dashboard')
@login_required
def dashboard():
    return render_template('admin/dashboard.html')

@admin_bp.route('/settings')
@login_required
def settings():
    return render_template('admin/settings.html')

@admin_bp.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        username = request.form.get('username')
        password = request.form.get('password')
        
        user = db.execute("SELECT * FROM admins WHERE username = ?", username)
        
        if user and check_password_hash(user[0]['password_hash'], password):
            session['admin_id'] = user[0]['id']
            session['admin_username'] = user[0]['username']
            return redirect(url_for('admin.dashboard'))
        else:
            flash('Invalid username or password')
            
    return render_template('admin/login.html')

@admin_bp.route('/logout', methods=['GET'])
def logout():
    session.clear()
    return redirect(url_for('admin.login'))
