Documentation
1. Setup
Install Dependencies: Run the following command to install necessary packages:
bash
Copy code
npm install express ejs bcryptjs express-session sqlite3 body-parser
File Structure:
app.js: Main server file.
views/: Directory containing .ejs templates for rendering HTML views.
public/: Directory for static assets like CSS, JS files.
2. Database
The app uses SQLite3 as the database.
Two tables are used:
users: Stores registered users' data (username, hashed password).
submissions: Stores data about households (household head, family members, distributed ITNs, and distribution date).
3. Routes
Home (GET /): Displays the home page.
Register (GET /register): Displays the user registration form.
Login (GET /login): Displays the login form.
Dashboard (GET /dashboard): Shows household submissions if the user is logged in.
Submit Household Data (POST /submit): Submits a new household record.
4. API Endpoints
POST /api/households: Adds a new household record to the database.
Expected JSON Body:
json
Copy code
{
    "householdHead": "John Doe",
    "familyMembers": 4,
    "itnsDistributed": 3,
    "distributionDate": "2024-09-21"
}
GET /api/households: Retrieves all household records from the database.
5. Authentication
Session-based authentication using express-session.
On successful login, a userId is stored in the session for user authentication on subsequent requests.
6. Logout (GET /logout)
Destroys the session and redirects to the home page.
This structure ensures secure user authentication, household data management, and API access for household record submission and retrieval.