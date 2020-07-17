const express = require("express");
const bodyParser = require("body-parser");

const app = express();

const dotenv = require("dotenv");
dotenv.config();

const AppsScript = require("./appsscript.js");

const port = process.env.PORT || 5000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// console.log that your server is up and running
app.listen(port, () => console.log(`Listening on port ${port}`));

// Post request to upload excel file to google drive and sync data to firebase
app.post("/signup/:id", (req, res) => {
  const fileurl = req.body.file;
  try {
    const excelId = new AppsScript(fileurl).runAppsScript();
    res.send(excelId);
  } catch (err) {
    res.status(400).send("Error");
  }
});

// Post request to update firebase with new excel file
app.post("/edit-account/:id", (req, res) => {
  const fileurl = req.body.file;
  console.log("reqfile", fileurl);
  try {
    const excelId = new AppsScript(fileurl).runAppsScript();
    res.send(excelId);
  } catch (err) {
    res.status(404).send("Error");
  }
});
