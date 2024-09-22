# ITN distribution campaign

A Node.js web application that allows users to register, log in, submit household data, and retrieve this data using an API. The app uses Express.js, SQLite, and EJS for templating, along with session-based user authentication.

## Features

- **User Registration and Authentication**: Users can register, log in, and log out.
- **Data Submission**: Users can submit household data, including household head, number of family members, ITNs distributed, and the distribution date.
- **Dashboard**: Authenticated users can view all their submitted household data.
- **API Integration**: Provides a REST API to add and retrieve household data.
- **Session Management**: User sessions are handled using `express-session`.

---

## Prerequisites

- **Node.js** (v12 or higher)
- **SQLite3** (for the database)
- **npm** (Node package manager)

---

## Getting Started

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/household-data-management-system.git
   ```

2. Navigate to the project directory:
   ```bash
   cd household-data-management-system
   ```

3. Install dependencies:
   ```bash
   npm install
   ```

4. Run the application:
   ```bash
   node app.js
   ```

5. Open your browser and navigate to:
   ```
   http://localhost:3000
   ```
---

## Usage

### 1. Register a New User
- Go to `/register` to create a new user account.
- Enter your **username** and **password**, and submit the form.

### 2. Log in
- After registering, navigate to `/login` to log in using your credentials.

### 3. Submit Household Data
- Once logged in, you will be redirected to `/dashboard`.
- You can submit the following data:
  - Household Head
  - Family Members
  - ITNs Distributed
  - Distribution Date
- Submitted data will be displayed in your dashboard.

### 4. API Endpoints
The application exposes API endpoints to interact with household data.

#### POST: `/api/households`
Submit new household data.

**Request Body**:
```json
{
  "householdHead": "John Doe",
  "familyMembers": 4,
  "itnsDistributed": 3,
  "distributionDate": "2024-09-20"
}
```

**Response**:
```json
{
  "message": "Household data added successfully",
  "id": 1
}
```

#### GET: `/api/households`
Retrieve all household data.

**Response**:
```json
{
  "households": [
    {
      "id": 1,
      "householdHead": "John Doe",
      "familyMembers": 4,
      "itnsDistributed": 3,
      "distributionDate": "2024-09-20"
    }
  ]
}
```
---

## Dependencies

- [Express.js](https://expressjs.com/) - Web framework for Node.js
- [EJS](https://ejs.co/) - Templating engine for generating HTML
- [bcryptjs](https://www.npmjs.com/package/bcryptjs) - Password hashing
- [express-session](https://www.npmjs.com/package/express-session) - Session management
- [SQLite3](https://www.sqlite.org/index.html) - Lightweight database engine
- [body-parser](https://www.npmjs.com/package/body-parser) - Parsing middleware for form data

---

## Security

- Passwords are hashed using `bcryptjs` before being stored in the database.
- User sessions are securely managed using `express-session`.

---

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
