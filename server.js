const express = require("express");
const bodyParser = require("body-parser");

const app = express();

const dotenv = require("dotenv");
dotenv.config();

const path = require("path");
const port = process.env.PORT || 5000;

const AppsScript = require("./appsscript.js");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//Static file declaration
app.use(express.static(path.join(__dirname, "client/build")));

//production mode
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "client/build")));
  app.get("*", (req, res) => {
    res.sendfile(path.join((__dirname = "client/build/index.html")));
  });
}

//build mode
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname + "/client/public/index.html"));
});

// Post request to upload excel file to google drive and sync data to firebase
app.post("/signup/:id", (req, res) => {
  const fileurl = req.body.file;
  try {
    var appsscript = new AppsScript(fileurl);

    var callAppsScript = async () => {
      var excelId = await appsscript.runAppsScript();
      return excelId;
    };

    callAppsScript()
      .then((excelId) => {
        res.send(excelId);
      })
      .catch((err) => res.status(404).send("Error"));
  } catch (err) {
    res.status(400).send("Error");
  }
});

// Post request to update firebase with new excel file
app.post("/edit-account/:id", (req, res) => {
  const fileurl = req.body.file;
  try {
    var appsscript = new AppsScript(fileurl);

    var callAppsScript = async () => {
      var excelId = await appsscript.runAppsScript();
      return excelId;
    };

    callAppsScript()
      .then((excelId) => {
        res.send(excelId);
      })
      .catch((err) => res.status(404).send("Error"));
  } catch (err) {
    res.status(404).send("Error");
  }
});

//start server
app.listen(port, (req, res) => {
  console.log(`server listening on port: ${port}`);
});
