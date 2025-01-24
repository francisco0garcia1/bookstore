import pytest
from fastapi.testclient import TestClient
from fastapi import status
from sqlalchemy import create_engine, StaticPool
from sqlalchemy.orm import sessionmaker
from api.models import Base as DataBase, Author, Book
from ..main import app
from ..deps import get_db


DATABASE_URL = "sqlite:///:memory:"

engine = create_engine(
    DATABASE_URL,
    connect_args={
        "check_same_thread": False,
    },
    poolclass=StaticPool,
)

TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


def override_get_db():
    db = TestingSessionLocal()
    try:
        yield db
    finally:
        db.close()


app.dependency_overrides[get_db] = override_get_db
client = TestClient(app)


@pytest.fixture(autouse=True)
def setup_and_teardown():
    DataBase.metadata.create_all(bind=engine)
    # create test entries
    test_book1 = Book(
            title="New Book",
            year=1990,
            author=Author(
                name="Tester Testing"
            )
    )
    test_book2 = Book(
            title="Super Duper Book",
            year=1980,
            author=Author(
                name="Tester Testing Jr."
            )
        )
    test_session = TestingSessionLocal()
    test_session.add(test_book1)
    test_session.add(test_book2)
    test_session.commit()
    test_session.close()
    yield
    DataBase.metadata.drop_all(bind=engine)


def test_health_check():
    response = client.get("/")
    assert response.status_code == status.HTTP_200_OK
    assert response.json() == 'Health check complete!'


def test_get_books():
    response = client.get("/books")
    assert response.status_code == status.HTTP_200_OK
    data = response.json()
    assert len(data) == 2


def test_put_nonexistent_book():
    response = client.put(
        "/books/10",
        json={
        }
    )
    assert response.status_code == status.HTTP_400_BAD_REQUEST
    data = response.json()
    assert data["detail"] == "Could not find specified book"


def test_put_existing_book():
    response = client.put(
        "/books/1",
        json={
            "title": "New Title",
            "year": 2010,
        }
    )
    assert response.status_code == status.HTTP_200_OK
    data = response.json()
    assert data["id"] == 1
    assert data["title"] == "New Title"
    assert data["year"] == 2010
    assert data["author"]["id"] == 1


def test_put_existing_book_new_author():
    response = client.put(
        "/books/2",
        json={
            "author_name": "Newest Author in Town"
        }
    )
    assert response.status_code == status.HTTP_200_OK
    data = response.json()
    assert data["id"] == 2
    assert data["author"]["id"] == 3
    assert data["author"]["name"] == "Newest Author in Town"


def test_put_existing_book_existing_author():
    response = client.put(
        "/books/2",
        json={
            "author_id": 1
        }
    )
    assert response.status_code == status.HTTP_200_OK
    data = response.json()
    assert data["id"] == 2
    assert data["title"] == "Super Duper Book"
    assert data["author"]["id"] == 1
    assert data["author"]["name"] == "Tester Testing"


def test_put_existing_book_nonexistent_author():
    response = client.put(
        "/books/1",
        json={
            "author_id": 10
        }
    )
    assert response.status_code == status.HTTP_400_BAD_REQUEST
    data = response.json()
    assert data["detail"] == "Could not find specified author"


def test_post_book_with_new_author():
    response = client.post(
        "/books",
        json={
            "title": "Mega Book",
            "year": 2000,
            "author": {
                 "name": "Stephen K."
            }
        }
    )
    assert response.status_code == status.HTTP_201_CREATED
    data = response.json()
    assert data["title"] == "Mega Book"
    assert data["year"] == 2000
    assert data["author"]["id"] == 3
    assert data["author"]["name"] == "Stephen K."


def test_post_book_with_existing_author():
    response = client.post(
        "/books",
        json={
            "title": "Hyper Book",
            "year": 1879,
            "author": {
                 "id": 1
            }
        }
    )
    assert response.status_code == status.HTTP_201_CREATED
    data = response.json()
    assert data["title"] == "Hyper Book"
    assert data["year"] == 1879
    assert data["author"]["id"] == 1
    assert data["author"]["name"] == "Tester Testing"


def test_post_book_with_nonexistent_author():
    response = client.post(
        "/books",
        json={
            "title": "Hyper Book",
            "year": 1879,
            "author": {
                 "id": 10
            }
        }
    )
    assert response.status_code == status.HTTP_400_BAD_REQUEST
    data = response.json()
    assert data["detail"] == "Could not find specified author"
