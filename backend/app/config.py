import os
from dotenv import load_dotenv

load_dotenv()

# Get the absolute path of the project root
BASE_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
DATABASE_URI = f"sqlite:///{os.path.join(BASE_DIR, 'instance/database.db')}"
JWT_SECRET = os.environ.get('JWT_SECRET')
FCM_API_KEY = os.environ.get('FCM_API_KEY')
