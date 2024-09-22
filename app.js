const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const session = require('express-session');
const bcrypt = require('bcryptjs');
const { error } = require('console');
const sqlite3 = require('sqlite3').verbose();


const app = express();
const PORT = 3000;

// Set EJS as templating engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Serve static files from 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// Parse incoming request bodies
app.use(express.json()); // For parsing application/json
app.use(bodyParser.urlencoded({ extended: false }));

// Session middleware for authentication
app.use(session({
    secret: 'your-secret-key',
    resave: false,
    saveUninitialized: true
}));

// Initialize SQLite database
const db = new sqlite3.Database('./database.db');

// Create a user table (if it doesn't exist)
db.run(`
    CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE,
        password TEXT
    )
`);

// Create data submission table
db.run(`
    CREATE TABLE IF NOT EXISTS submissions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        householdHead TEXT,
        familyMembers INTEGER,
        itnsDistributed INTEGER,
        distributionDate TEXT
    )
`);

// Home route
app.get('/', (req, res) => {
    res.render('index');
});

// Render the registration page
app.get('/register', (req, res) => {
    res.render('register');
});

// Handle registration form submission
app.post('/register', (req, res) => {
    const { username, password } = req.body;
    // Hash the password
    const hashedPassword = bcrypt.hashSync(password, 10);

    // Insert new user into the database
    db.run(`INSERT INTO users (username, password) VALUES (?, ?)`, [username, hashedPassword], (err) => {
        if (err) {
            console.log('user exist');
            
            return res.render('register', { error: 'Username already exists' });
            //return res.render('register', {error: 'errer'});
        }
        res.redirect('/login');
    });
});

// Render the login page
app.get('/login', (req, res) => {
    res.render('login');
});

// Handle login form submission
app.post('/login', (req, res) => {
    const { username, password } = req.body;

    db.get(`SELECT * FROM users WHERE username = ?`, [username], (err, user) => {
        if (err || !user || !bcrypt.compareSync(password, user.password)) {
            return res.render('login', { error: 'Invalid credentials' });
        }

        // Create session for the user
        req.session.userId = user.id;
        res.redirect('/dashboard');
    });
});

// Handle data submission
app.post('/submit', (req, res) => {
    //const data = req.body.data;
    const householdHead = req.body.householdHead;
    const familyMembers = req.body.familyMembers;
    const itnsDistributed = req.body.itnsDistributed;
    const distributionDate = req.body.distributionDate;
    const userId = req.session.userId;

    if (!userId) {
        return res.redirect('/login');
    }

    db.run(`INSERT INTO submissions (householdHead, familyMembers, itnsDistributed, distributionDate) VALUES (?, ?, ?, ?)`, [householdHead, familyMembers, itnsDistributed, distributionDate], (err) => {
        if (err) {
            return res.render('dashboard', { error: 'Error submitting data' });
        }
        res.redirect('/dashboard');
    });
});

//Handles viewing 0f submitted data
app.get('/dashboard', (req, res) => {
    if (!req.session.userId) {
        return res.redirect('/login');
    }

    db.all(`SELECT * FROM submissions`, (err, submissions) => {
        if (err) {
            return res.render('dashboard', { error: 'Error retrieving submissions' });
        }
        res.render('dashboard', { submissions });
    });
});


//BEGIN
// POST endpoint to add a new household record
app.post('/api/households', (req, res) => {
    const { householdHead, familyMembers, itnsDistributed, distributionDate } = req.body;

    // Validate required fields
    if (!householdHead || !familyMembers || !itnsDistributed || !distributionDate) {
        return res.status(400).json({ error: 'All fields are required' });
    }

    // Insert the new record into the database
    const sql = `INSERT INTO submissions (householdHead, familyMembers, itnsDistributed, distributionDate)
        VALUES (?, ?, ?, ?)`;
    
    db.run(sql, [householdHead, familyMembers, itnsDistributed, distributionDate], function (err) {
        if (err) {
            return res.status(500).json({ error: 'Failed to insert data into the database' });
        }

        // Return success response with the inserted record ID
        res.status(201).json({ message: 'Household data added successfully', id: this.lastID });
    });
});
//END

//BEGIN
// GET endpoint to retrieve all household records
app.get('/api/households', (req, res) => {
        
    const sql = `SELECT * FROM submissions`;
    
    db.all(sql, [], (err, rows) => {
        if (err) {
            return res.status(500).json({ error: 'Failed to retrieve data from the database' });
        }

        // Return the list of households
        res.status(200).json({ households: rows });
    });
});
//END


//LOGOUT 
app.get('/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/');
});


// Start server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
