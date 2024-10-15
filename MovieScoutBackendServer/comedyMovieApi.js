const express = require('express');
const mysql = require('mysql');
const cors = require('cors');

// Initialize the app
const app = express();
app.use(express.json());

app.use(cors({
  origin: '*', 
  methods: ['GET', 'POST'], 
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// MySQL database connection
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'movieData'
});

db.connect(err => {
  if (err) {
    console.error('Error connecting to database:', err.message);//Error handling
    throw err;
  }
  console.log('Connected to the movie database');
});

// Fetch movies
app.get('/comedy_movies', (req, res) => {
  const sql = 'SELECT * FROM comedy_movies';

  db.query(sql, (err, result) => {
    if (err) {
      console.error('Database query error:', err.message);
      return res.status(500).json({ error: err.message }); // Error
    }
    
    console.log('Fetched movies:', result); //json response
    res.json(result); 
  });
});

// Start the server
const PORT = 3006;
app.listen(PORT, () => {
  console.log(`Movie API running on port ${PORT}`);
});
 
 
 
