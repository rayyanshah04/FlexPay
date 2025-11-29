from flask import render_template
from . import admin_bp

@admin_bp.route('/')
@admin_bp.route('/dashboard')
def dashboard():
    return render_template('admin/dashboard.html')

@admin_bp.route('/login')
def login():
    return render_template('admin/login.html')
