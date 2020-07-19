const router = require("express").Router();
const formidable = require("formidable-serverless");
const fs = require("fs");
const path = require("path");
const { v4: uuidv4 } = require("uuid");

//Initialize an empty dictionary of Jobs that store running processes
var UploadJobQueue = {};

//creating a dummy unique user id
const user = uuidv4();

router.post("/", function (req, res) {
  try {
    console.log(`uploading file`);

    //state variable Represents the status of uploading
    let state = "";

    let filename;
    let filepath;
    const options = {
      maxFileSize: Infinity,
      keepExtensions: true,
    };
    const form = new formidable.IncomingForm(options);
    form.parse(req);

    form.on("fileBegin", (name, file) => {
      filename = file.name;
      state = `uploading  ${filename}`;
      console.log(state);

      const temp = path.join(__dirname, "../");
      file.path = temp + "Uploads/" + file.name;
      filepath = file.path;
      UploadJobQueue[user] = form;
    });

    form.on("file", (name, file) => {
      console.log("HAHAHA");
      state = `${filename} is uploaded.`;
      console.log(state);
      res.status(200).end(state);

      //Transfer file from Temp directory to Required directory, as file completely uploaded
      fs.rename(file.path, "Uploads/" + filename, (err) => {
        if (err) throw err;
        console.log(`${filename} stored to Uploads`);
      });

      delete UploadJobQueue[user];
    });

    form.on("abort", (name, file) => {
      state = `${filename} upload aborted`;
      console.log(state);

      res
        .status(200)
        .end("File upload aborted because you triggered abort event.");
      res.destroy();

      delete UploadJobQueue[user];
    });

    form.on("error", (err) => {
      state = `Stopped uploading ${filepath} due to:`;
      console.log(state);

      res
        .status(400)
        .end("Error while uploading. Please upload the file again.");
      res.status(400).json({
        error: err,
      });

      throw err;
    });
  } catch (err) {
    console.log(err);
    res.status(400).end("Couldn't upload file due to errors. Try again.");
  }
});

router.delete("/terminate", (req, res) => {
  try {
    const form = new formidable.IncomingForm();

    form.parse(req, (err, fields, files) => {
      if (user in UploadJobQueue) {
        console.log(`Stopping upload process.`);

        UploadJobQueue[user].emit("abort");
        res
          .status(200)
          .end("Process terminated. You may proceed to re-upload.");
      } else {
        res.status(404).end(`No running Uploads.`);
      }
    });
  } catch (err) {
    res.status(400).end("Error occured while terminating. Try again.");
  }
});

module.exports = router;
