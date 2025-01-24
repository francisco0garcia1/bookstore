from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
from .config import DATABASE_URI

SQL_ALCHEMY_DATABASE_URL = DATABASE_URI

_engine = create_engine(SQL_ALCHEMY_DATABASE_URL)
_session = sessionmaker(autocommit=False, autoflush=False, bind=_engine)

Base = declarative_base()
