# -- config.py --
import os

# DB
POSTGRES_USER = os.environ.get("POSTGRES_USER", '')
POSTGRES_PASSWORD = os.environ.get("POSTGRES_PASSWORD", '')
POSTGRES_SERVER = os.environ.get("POSTGRES_SERVER", '')
POSTGRES_DB = os.environ.get("POSTGRES_DB", '')
DATABASE_URI = os.environ.get("DATABASE_URI",  # required for docker
                              f"postgresql://{POSTGRES_USER}:{POSTGRES_PASSWORD}@{POSTGRES_SERVER}/{POSTGRES_DB}")
