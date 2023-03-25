import express, { Request, Response } from "express";
import bodyParser from "body-parser";
import mysql, { OkPacket } from "mysql2/promise";
import { z } from "zod";

const app = express();

// Parse request body as JSON
app.use(bodyParser.json());

// MySQL connection pool
const pool = mysql.createPool({
  host: "localhost",
  user: "root",
  database: "projects",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// Schema for validating request body
const schema = z.object({
  keyname: z.string(),
});

// Add a new section to the "section" table
app.post("/addsection", async (req: Request, res: Response) => {
  try {
    // Validate request body using the schema
    const { keyname } = schema.parse(req.body);

    // Insert data into MySQL database with current timestamp
    const [result] = await pool.query(
      "INSERT INTO section (keyname, created_on, updated_on) VALUES (?, NOW(), NOW())",
      [keyname]
    );
    res.status(201).json({id: (result as OkPacket).insertId, message: "Section created successfully"});
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Something went wrong" });
  }
});


// Read all section
//-----------------------------------------------------------------------------------------
app.get('/getsection', async (req: Request, res: Response) => {
    try {
      // Fetch data from MySQL database
      const [rows] = await pool.query('SELECT * FROM section');
  
      res.status(200).json(rows);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Something went wrong' });
    }
});

//single section
//-----------------------------------------------------------------------------------------
app.get('/getsection/:id', async (req, res) => {
    const id = req.params.id;
    try {
      const [rows] = await pool.execute('SELECT * FROM section WHERE id = ?', [id]);
      if (Array.isArray(rows) && rows.length > 0) {
        res.json(rows[0]);
      } else {
        res.status(404).send('section not found');
      }
    } catch (error) {
      console.error('Error:', error);
      res.status(500).send('Error retrieving section ');
    }
});

// // Update a section
// //-----------------------------------------------------------------------------------------
// app.put('/updatesection/:id', async (req: Request, res: Response) => {
//     try {
//       const id = req.params.id;
//       const { keyname } = schema.parse(req.body);
  
//       // Update  updated_on columns
//       const [result] = await pool.query(
//         'UPDATE section SET keyname = ?,updated_on = NOW() WHERE id = ?',
//         [keyname ,id]
//       );
  
//       if ((result as any).affectedRows === 0) {
//         // If no rows were affected, return a 404 status code
//         res.status(404).json({ error: 'section not found' });
//       } else {
//         // Otherwise, return a success message
//         res.status(200).json({ message: 'section updated successfully' });
//       }
//     } catch (err) {
//       console.error(err);
//       res.status(500).json({ error: 'Something went wrong' });
//     }
// });

// // Delete a section
// //-----------------------------------------------------------------------------------------
// app.delete('/deletesection/:id', async (req: Request, res: Response) => {
//     try {
//       const id = req.params.id;
  
//       // Query the database to delete the section with the specified ID
//       const [result] = await pool.query('DELETE FROM section WHERE id = ?', [id]);
  
//       if ((result as any).affectedRows === 0) {
//         // If no section was deleted with the specified ID, return a 404 status code
//         res.status(404).json({ error: 'section not found' });
//       } else {
//         // Otherwise, return a success message
//         res.status(200).json({ message: 'section deleted successfully' });
//       }
//     } catch (err) {
//       console.error(err);
//       res.status(500).json({ error: 'Something went wrong' });
//     }
//   });

// Start the server
//-----------------------------------------------------------------------------------------
app.listen(5000, () => {
  console.log("Server started on port 5000");
});
