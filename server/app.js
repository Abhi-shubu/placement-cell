const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const morgan = require("morgan");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require('path');
require("dotenv/config");

app.use(cors());
app.options("*", cors());
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

//middleware
app.use(express.json());
app.use(morgan("tiny"));


const BatchRoutes = require("./routes/batchs");
const employeeRpoute = require("./routes/employees")
const studentRoute = require("./routes/students")
const interviewRoute = require("./routes/interview")

const api = process.env.API_URL;
app.use(`${api}/batches`, BatchRoutes);
app.use(`${api}/employees`, employeeRpoute);
app.use(`${api}/student`, studentRoute);
app.use(`${api}/interview`, interviewRoute);
mongoose.connect(process.env.CONNECTION_STRING,{
    useNewUrlParser:true,
    useUnifiedTopology: true,
    dbName:'placementcell'
    
    }).then(() => {
      console.log("Database Connection is ready...");
    })
    .catch((err) => {
      console.log(err);
    });
csonst _dirname = path.dirname("");
const buildPath = path.join(__dirname, "../client/build");
app.use(express.static(buildPath));
app.get("/*", (_, res) => {
  res.sendFile(path.join(buildPath, "index.html")),
    function (err) {
      if (err) {
        res.status(500).send(err);
      }
    };
});
app.listen(4000, () => {
    console.log("server is running http://localhost:3000");
  });
