# URL Shortening Service

> This project is an implementation of the [URL Shortening Service project](https://roadmap.sh/projects/url-shortening-service) from the [Backend Developer Roadmap](https://roadmap.sh/backend). It serves as a practical exercise for backend development skills.

This is a RESTful API for a URL shortening service built with Node.js, Express, and MySQL. It allows users to shorten long URLs and provides endpoints for managing these short URLs.

## Features

- Shorten a long URL to a unique short code.
- Redirect from a short URL to the original URL.
- Retrieve details of a short URL.
- Update the original URL for an existing short URL.
- Delete a short URL.
- Track the number of times a short URL has been accessed.
- Minimalist frontend to interact with the service.

## Tech Stack

- **Backend:** Node.js, Express.js
- **Database:** MySQL
- **Frontend:** HTML, CSS, JavaScript (minimal)

## Getting Started

Follow these instructions to get a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

- [Node.js](https://nodejs.org/) (v14 or later recommended)
- [MySQL](https://www.mysql.com/downloads/)

### Installation

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/aleng1/url-shortener.git
    cd url-shortener
    ```

2.  **Install backend dependencies:**
    ```bash
    npm install
    ```

3.  **Database Setup:**
    - Connect to your MySQL server and run the following commands to create the database and table:
      ```sql
      CREATE DATABASE url_shortener;
      USE url_shortener;
      CREATE TABLE urls (
        id INT AUTO_INCREMENT PRIMARY KEY,
        original_url VARCHAR(2048) NOT NULL,
        short_code VARCHAR(255) NOT NULL UNIQUE,
        access_count INT DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      );
      ```
    - Update the database credentials in `src/config/db.config.js` to match your local MySQL setup.
      ```javascript
      module.exports = {
          HOST: "localhost",
          USER: "your_username",
          PASSWORD: "your_password",
          DB: "url_shortener"
      };
      ```

4.  **Run the application:**
    - To start the development server with auto-restarting:
      ```bash
      npm run dev
      ```
    - The server will start on `http://localhost:3000`.

## Usage

- Open your web browser and navigate to `http://localhost:3000`.
- Enter a long URL in the input field and click the "Shorten" button.
- The shortened URL will be displayed. Clicking this link will redirect you to the original URL.

## API Endpoints

The API is structured around REST principles.

#### `POST /shorten`

- **Description:** Creates a new short URL.
- **Request Body:**
  ```json
  {
    "url": "https://www.example.com/a/very/long/url/to/shorten"
  }
  ```
- **Response (201 Created):**
  ```json
  {
    "id": 1,
    "url": "https://www.example.com/a/very/long/url/to/shorten",
    "shortCode": "Abc123X",
    "createdAt": "...",
    "updatedAt": "..."
  }
  ```

#### `GET /:shortCode`

- **Description:** Redirects to the original URL corresponding to the short code and increments the access count.
- **Example:** `GET http://localhost:3000/Abc123X`
- **Response:** `302 Found` (Redirect)

#### `GET /shorten/:shortCode`

- **Description:** Retrieves the details for a short URL.
- **Example:** `GET http://localhost:3000/shorten/Abc123X`
- **Response (200 OK):**
  ```json
  {
    "id": 1,
    "url": "https://www.example.com/a/very/long/url/to/shorten",
    "shortCode": "Abc123X",
    "createdAt": "...",
    "updatedAt": "..."
  }
  ```

#### `GET /shorten/:shortCode/stats`

- **Description:** Retrieves statistics for a short URL, including the access count.
- **Example:** `GET http://localhost:3000/shorten/Abc123X/stats`
- **Response (200 OK):**
  ```json
  {
    "id": 1,
    "url": "https://www.example.com/a/very/long/url/to/shorten",
    "shortCode": "Abc123X",
    "createdAt": "...",
    "updatedAt": "...",
    "accessCount": 5
  }
  ```

#### `PUT /shorten/:shortCode`

- **Description:** Updates the original URL for an existing short URL.
- **Request Body:**
  ```json
  {
    "url": "https://www.example.com/a/new/updated/url"
  }
  ```
- **Response (200 OK):**
  ```json
  {
    "id": 1,
    "url": "https://www.example.com/a/new/updated/url",
    "shortCode": "Abc123X",
    "createdAt": "...",
    "updatedAt": "..."
  }
  ```

#### `DELETE /shorten/:shortCode`

- **Description:** Deletes a short URL.
- **Response:** `204 No Content` 