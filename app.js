require('dotenv').config({ path: './config.env' });
const express = require('express');
const mysql = require('mysql');

const app = express();

const port = process.env.PORT || 3000;

app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

//* MySQL
const pool = mysql.createPool({
  connectionLimit: 10,
  host: 'localhost',
  user: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: 'nodejs_beers',
});

// Get all beers
app.get('/', (req, res) => {
  pool.getConnection((err, connection) => {
    if (err) throw err;
    console.log(`connected as id ${connection.threadId}`);

    // query(sqlString, callback)
    connection.query('SELECT * FROM beers', (err, rows) => {
      connection.release(); // return the connection to pool

      if (!err) {
        res.status(200).json({
          status: 'success',
          results: rows.length,
          data: {
            beers: rows,
          },
        });
      }
    });
  });
});

// GET ONE
app.get('/:id', (req, res) => {
  pool.getConnection((err, connection) => {
    if (err) throw err;
    console.log(`connected as id ${connection.threadId}`);

    // query(sqlString, callback)
    connection.query('SELECT * FROM beers WHERE id = ?', [req.params.id], (err, rows) => {
      connection.release(); // return the connection to pool

      if (!err) {
        res.status(200).json({
          status: 'success',
          data: {
            beer: rows,
          },
        });
      }
    });
  });
});

// CREATE ONE
app.post('/', (req, res) => {
  pool.getConnection((err, connection) => {
    if (err) throw err;
    console.log(`connected as id ${connection.threadId}`);

    // query(sqlString, callback)
    connection.query('INSERT INTO beers SET ?', req.body, (err, rows) => {
      connection.release(); // return the connection to pool

      if (!err) {
        res.status(201).json({
          status: 'success',
          data: {
            beer: req.body,
          },
        });
      }
    });
  });
});

// UPDATE ONE
app.patch('/:id', (req, res) => {
  pool.getConnection((err, connection) => {
    if (err) throw err;
    console.log(`connected as id ${connection.threadId}`);

    const { name, tagline, description, image } = req.body;

    // query(sqlString, callback)
    connection.query(
      'UPDATE beers SET name = ?, tagline = ?, description = ?, image = ? WHERE id = ?',
      [name, tagline, description, image, req.params.id],
      (err, rows) => {
        connection.release(); // return the connection to pool

        console.log(name, req.params.id);

        if (!err) {
          res.status(200).json({
            status: 'success',
            data: {
              beer: req.body,
            },
          });
        }
      }
    );
  });
});

// DELETE
app.delete('/:id', (req, res) => {
  pool.getConnection((err, connection) => {
    if (err) throw err;
    console.log(`connected as id ${connection.threadId}`);

    // query(sqlString, callback)
    connection.query('DELETE FROM beers WHERE id = ?', [req.params.id], (err, rows) => {
      connection.release(); // return the connection to pool

      if (!err) {
        res.status(204).json({
          status: 'success',
        });
      }
    });
  });
});

//* Server
app.listen(port, () => {
  console.log('Server is running on port 3000');
});
