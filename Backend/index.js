const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const studentRouter = require('./Routers/studentRouter'); // ✅ Your router
const projectRouter = require('./Routers/projectRouter');
const http = require('http');

dotenv.config();

const app = express();

// ✅ CORS middleware
app.use(cors());
app.use(express.json());
app.use((req, res, next) => {
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  next();
});

// ✅ Create HTTP server
const server = http.createServer(app);



// ✅ Setup routes
app.use('/student', studentRouter); // e.g., /student/add-notification
app.use('/project', projectRouter);

// ✅ Start server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});


