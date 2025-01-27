# bookstore test

To run the proyect you should do the following:

1. Clone repo
2. Place a .env file in the root of the proyect with the follwing contents:

# DATABASE
POSTGRES_USER="postgres"
POSTGRES_PASSWORD="your_desired_pass"
POSTGRES_SERVER="database"
POSTGRES_DB="bookstore_dev"
POSTGRES_PORT="5433"
DATABASE_URI="postgresql://${POSTGRES_USER}:${POSTGRES_PASSWORD}@${POSTGRES_SERVER}:${POSTGRES_PORT}/${POSTGRES_DB}"

# AUTHENTICATION
AUTH_SECRET_KEY="IXkfCiycPwDpHRswaSD4Ldo51AA2zLiuBLXUw6SC"
AUTH_ALGORITHM="HS256"
API_URL="http://localhost:3000"

3. Run docker compose up in the root of the project.
4. Go to http://localhost:3000 to access the fron-end
5. Go to http://localhost:8000/docs to access the back-end