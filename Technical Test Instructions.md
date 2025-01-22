# **Instructions**

## Setup:

- Create a GitHub repository for your project. (public repository)

## Database Design:

**Create two tables in PostgreSQL:**
```
Authors Table:
id (Primary Key, Integer)
name (String)

Books Table:
id (Primary Key, Integer)
title (String)
year (Integer)
status (Enum) - [PUBLISHED, DRAFT]
author_id (Foreign Key referencing Authors Table)
Include SQL scripts or migrations to create these tables.

```

## Backend (FastAPI):

Create a FastAPI application with the following endpoints:
```
- GET /books: Retrieve a list of all books along with their authors.
- POST /books: Add a new book (title, year, author_id, name of author) along with the Author (this will create the author in foreign table)
- PUT /books/{id}: Update details of a specific book (title, year, author_id), and its author details (this will create or update the author in foreign table)
- Use pytest for tests 
- Pydantic validations where necessary
```

## Frontend (NextJS):

Create a React application that interacts with the FastAPI backend.
```
Implement the following features:
- A form to add/edit new books with fields for title, year, and author selection (dropdown populated from the authors list) - We should be able to create and edit authors from same form
- If Author name not in list a new field author name should appear.
- A list view displaying all books with options to edit or delete each entry
- A functionality to filter the list of books by author
- Use Jest tests
- Add validations as necessary
```

## Docker:
```
- Write Dockerfiles for both the FastAPI backend and React frontend.
- Create a docker-compose.yml file that sets up both services along with the PostgreSQL database service.
```

## Submission:

```
1. Email back with the Github repo link (public repository)
```

## Documentation:
- Provide clear documentation on how to set up and run your application locally, including any dependencies needed.