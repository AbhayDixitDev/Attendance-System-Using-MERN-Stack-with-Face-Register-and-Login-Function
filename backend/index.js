const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');


const StudentRoute = require("./routes/student.js")
const TeacherRoute = require("./routes/teacher.js")
const AdminRoute = require("./routes/admin.js")
const app = express();
app.use(cors());

app.use(express.json());

mongoose.connect('mongodb://localhost:27017/mern-face-auth', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log('MongoDB connected'));


app.use("/api/student",StudentRoute)
app.use("/api/teacher",TeacherRoute)
app.use("/api/admin",AdminRoute)

app.listen(8000, () => console.log('Server running on port 8000'));