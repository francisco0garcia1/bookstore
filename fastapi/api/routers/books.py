from pydantic import BaseModel
from typing import Optional
from fastapi import APIRouter, HTTPException, status
from sqlalchemy import select
from api.models import Book, Author
from api.deps import db_dependency, user_dependency


router = APIRouter(
    prefix='/books',
    tags=['books']
)


class AuthorBase(BaseModel):
    id: int | None = None
    name: str | None = None


class BookBase(BaseModel):
    title: str
    year: int
    status: str | None = None
    author: AuthorBase


class BookUpdateBase(BaseModel):
    title: str | None = None
    year: int | None = None
    author_id: int | None = None
    author_name: str | None = None
    status: str | None = None


@router.get('/', status_code=status.HTTP_200_OK)
def get_books(db: db_dependency):
    return db.query(Book).all()


@router.post("/", status_code=status.HTTP_201_CREATED)
def create_book(db: db_dependency, book: BookBase):
    book_author = Author(**book.author.model_dump())

    if book_author.id is None:
        # create author
        db.add(book_author)
        db.commit()
        db.refresh(book_author)
    else:
        # check that author exists
        author = db.query(Author).filter(Author.id == book_author.id).first()
        if author:
            book_author = author
        else:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Could not find specified author")
    # check if valid status
    if book.status not in ["DRAFT", "PUBLISHED", "NA", None]:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Unsupported status")
    # create book
    db_book = Book(
        title=book.title,
        year=book.year,
        author=book_author,
        status=book.status,
    )
    db.add(db_book)
    db.commit()
    db.refresh(db_book)
    return db_book


@router.put("/{book_id}", status_code=status.HTTP_200_OK)
def modify_book(db: db_dependency, book_id, book_update: BookUpdateBase):
    # check that book exists
    book = db.query(Book).filter(Book.id == book_id).first()
    if book:
        # update accordingly
        book.title = book_update.title if book_update.title else book.title
        book.year = book_update.year if book_update.year else book.year
        book.status = book_update.status if book_update.status else book.status
        # check if valid status
        if book.status not in ["DRAFT", "PUBLISHED", "NA", None]:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Unsupported status")
        # check if update author
        if book_update.author_id is not None:
            # check that author exists
            author = db.query(Author).filter(Author.id == book_update.author_id).first()
            if author:
                # update author's name if necessary
                if book_update.author_name is not None:
                    author.name = book_update.author_name
                book.author = author
            else:
                raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Could not find specified author")
        elif book_update.author_name is not None:
            book.author = Author(name=book_update.author_name)
        # save changes
        db.commit()
        db.refresh(book)
        return book
    else:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Could not find specified book")
