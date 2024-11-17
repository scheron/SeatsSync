# Seats Sync

## Installation and Setup

### Requirements

- **Docker** and **Docker Compose**
- **Bun** (https://bun.sh)

### Project Installation

1. Clone the repository.
2. Create a `.env` file based on the example:

```bash
 cp .env.example .env
```

3. Ensure the `.env` file contains the following values:

   ```env
   POSTGRES_USER=
   POSTGRES_PASSWORD=
   POSTGRES_DB=
   POSTGRES_PORT=
   DATABASE_URL=
   ```

4. Run the project setup:
   ```bash
   make setup
   ```

## Running the Project

### 1. Start the Database

If the database is already set up, you can start it separately:

```bash
make start-db
```

### 2. Start the Backend Server

```bash
cd backend
bun start
```

### 3. Start the Frontend

```bash
cd frontend
bun start
```

## Useful Makefile Commands

- **Install dependencies**:

  ```bash
  make install
  ```

- **Start the database**:

  ```bash
  make start-db
  ```

- **Stop the database**:

  ```bash
  make stop-db
  ```

- **Restart the database**:

  ```bash
  make restart-db
  ```

- **Create the database (if not already created)**:

  ```bash
  make create-db
  ```

- **Initialize the database schema**:

  ```bash
  make init-db
  ```

- **Seed the database with initial data**:

  ```bash
  make seed-db
  ```

- **Full project setup**:
  ```bash
  make setup
  ```
