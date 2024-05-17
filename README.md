Sure, here is the complete `README.md` file content:

````markdown
# Project Setup and Usage Guide

## Prerequisites

Make sure you have Docker and Docker Compose installed on your system.

## Running the Project

1. Clone the repository to your local machine.
2. Navigate to the project directory.

### Start the Services

Run the following command to start all the services:

```sh
docker-compose up --build
```
````

This command will build and start the following services:

- MongoDB
- Backend API (NestJS)
- Frontend (React)
- Admin Panel (React)

### Verify the Services

Once the services are running, you can verify them by accessing the following URLs in your browser:

- Frontend: [http://localhost:3000](http://localhost:3000)
- Admin Panel: [http://localhost:3001](http://localhost:3001)
- Backend API: [http://localhost:3003](http://localhost:3003)

### Create a User

After all services are running, you need to create a user. Run the following `curl` command to create a user, replacing `username` and `password` with your desired credentials:

```sh
curl --location 'http://localhost:3003/user/create' \
--header 'Content-Type: application/json' \
--data '{
    "username": "your-username",
    "password": "your-password"
}'
```

Replace `"your-username"` and `"your-password"` with the username and password you want to use.

### Example:

```sh
curl --location 'http://localhost:3003/user/create' \
--header 'Content-Type: application/json' \
--data '{
    "username": "pedro",
    "password": "admin"
}'
```

## Additional Information

- The MongoDB service is configured with the following credentials:
  - Username: `root`
  - Password: `password`
- The backend API is accessible at [http://localhost:3003](http://localhost:3003).

Feel free to explore the application and make any necessary modifications.

```

You can save this content directly in a `README.md` file in your project's root directory for GitHub.
```
