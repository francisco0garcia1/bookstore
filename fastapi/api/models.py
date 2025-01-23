from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.dialects.postgresql import ENUM
from .database import Base


class Author(Base):
    __tablename__ = 'authors'
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)


class Book(Base):
    __tablename__ = 'books'
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    year = Column(Integer, nullable=False)
    status = Column(ENUM("PUBLISHED", "DRAFT", name="book_status"))
    author_id = Column(ForeignKey("authors.id"))


class User(Base):
    __tablename__ = 'users'
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True)
    hashed_password = Column(String)
