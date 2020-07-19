const express = require("express");
const dotenv = require("dotenv");

const uploadRoutes = require("./routes/uploadRouter.js");
const exportRoutes = require("./routes/exportRouter.js");
dotenv.config(); //Load the environment variables

const app = express();

app.use(express.json());
// app.use(express.json()).use(express.urlencoded())
app.use(express.urlencoded());

//Link all the routes
app.use("/upload", uploadRoutes);
app.use("/export", exportRoutes);
app.get("/", (req, res) => {
  res.send(
    "Here's the list of routes:<br />POST  /upload <br />DELETE  /upload/terminate <br />POST  /export <br /> DELETE  /export/terminate"
  );
});

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`Server running. Listening at port: ${PORT}`);
});
