const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();
const cors = require('cors');


const StudentRoute = require("./routes/student.js")
const TeacherRoute = require("./routes/teacher.js")
const AdminRoute = require("./routes/admin.js")
const PublicRoute = require("./routes/public.js")
const app = express();
app.use(cors());


app.use(express.json());

mongoose.connect(process.env.DB_CON, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log('MongoDB connected'));

const PORT = process.env.PORT || 8000;

app.use("/api/student",StudentRoute)
app.use("/api/teacher",TeacherRoute)
app.use("/api/admin",AdminRoute)
app.use('/api/public', PublicRoute); // Add this line

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));