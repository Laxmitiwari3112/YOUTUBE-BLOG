const express = require("express");
const path = require("path");
const mongoose = require("mongoose");

const userRoute = require("./routes/user");
const { connect } = require("http2");
const app = express();
const PORT = 8000;
// port can be avail in other browsers or not , so we can decide port
//  we can resolve thi problem using env variables

mongoose
  .connect("mongodb://127.0.0.1:27017/Blogify")
  .then((e) => console.log("MongoDB Connected!"));

app.set("view engine", "ejs");
app.set("views", path.resolve("./views"));

app.use(express.urlencoded({ extended: false })); //Parse form Data

app.get("/", (req, res) => {
  return res.render("home");
});

// signup route
app.use("/user", userRoute);
app.listen(PORT, () => console.log(`Server Started at PORT: ${PORT}`));
