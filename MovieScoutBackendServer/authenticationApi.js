const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cors = require('cors');

const app = express();
app.use(cors({
  origin:'*', // IP address of desktop
  methods:['GET', 'POST'],
  allowedHeaders:['Content-Type', 'Authorization'],
}));

app.use(bodyParser.json());

// MySQL database connection
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'android_auth'
});

db.connect(err => {
  if (err) throw err;
  console.log('Connected to MySQL Database');
});

// Sample route to test the server
app.get('/', (req, res) => {
  res.send('Hello from Node.js server');
});

// User Registration
app.post('/register', (req, res) => {
    const { username, password } = req.body;

  
    // Check if user already exists
    db.query('SELECT * FROM users WHERE username = ?', [username], (err, result) => {
      if (err) throw err;
      if (result.length > 0) {
        return res.status(400).send({ message: 'User already exists' });
      }
  
      // Hash password
      bcrypt.hash(password, 10, (err, hash) => {
        if (err) throw err;
  
        // Insert new user
        db.query('INSERT INTO users (username, password) VALUES (?, ?)', [username, hash], (err, result) => {
          if (err) throw err;
          res.send({ message: 'User registered successfully' });
        });
      });    });
  });

// User Login
app.post('/login', (req, res) => {
    const { username, password } = req.body;
  
    // Find user by username
    db.query('SELECT * FROM users WHERE username = ?', [username], (err, result) => {
      if (err) throw err;
      if (result.length === 0) {
        return res.status(400).send({ message: 'User not found' });
      }
  
      // Compare password
      const user = result[0];
      bcrypt.compare(password, user.password, (err, isMatch) => {
        if (err) throw err;
        if (!isMatch) {
          return res.status(400).send({ message: 'Incorrect password' });
        }
  
        // Create token
        const token = jwt.sign({ id: user.id, username: user.username }, 'secretkey', { expiresIn: '1h' });
        res.send({ message: 'Login successful', token });
      });
    });
  });
  
// Start the server
app.listen(3001, () => {
  console.log('Server is running on port 3001');
});
