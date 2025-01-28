# -- config.py --
import os
from dotenv import load_dotenv

load_dotenv()  # take environment variables from .env.

# DB
POSTGRES_USER = os.environ.get('POSTGRES_USER')
POSTGRES_PASSWORD = os.environ.get('POSTGRES_PASSWORD')
POSTGRES_SERVER = os.environ.get('POSTGRES_SERVER')
POSTGRES_DB = os.environ.get('POSTGRES_DB')
DATABASE_URI = os.environ.get('DATABASE_URI')
