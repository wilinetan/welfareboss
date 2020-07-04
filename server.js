const express = require("express");
const bodyParser = require("body-parser");

const app = express();

const fs = require("fs");
const readline = require("readline");
const { google } = require("googleapis");

const dotenv = require("dotenv");
dotenv.config();

const port = process.env.PORT || 5000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// console.log that your server is up and running
app.listen(port, () => console.log(`Listening on port ${port}`));

const scopes = [
  "https://www.googleapis.com/auth/firebase.database",
  "https://www.googleapis.com/auth/drive",
  "https://www.googleapis.com/auth/script.external_request",
  "https://www.googleapis.com/auth/spreadsheets",
];

const TOKEN_PATH = "token.json";

// Post request to upload excel file to google drive and sync data to firebase
app.post("/signup/:id", (req, res) => {
  // Authorization
  fs.readFile("credentials.json", (err, content) => {
    if (err) return console.log("Error loading client secret file:", err);
    // Authorize a client with credentials, then call the Google Apps Script API.
    authorize(JSON.parse(content), callAppsScript);
  });

  function callAppsScript(auth) {
    const scriptId = process.env.APPS_SCRIPT_ID;
    const script = google.script("v1");
    const fileurl = req.body.file;

    // Make the API request. The request object is included here as 'resource'.
    script.scripts.run(
      {
        auth: auth,
        resource: {
          function: "excelToSheets",
          parameters: [fileurl],
        },
        scriptId: scriptId,
      },
      function (err, resp) {
        if (err) {
          // The API encountered a problem before the script started executing.
          console.log("The API returned an error: " + err);
          return res.status(404).send();
        }
        if (resp.error) {
          // The API executed, but the script returned an error.

          // Extract the first (and only) set of error details. The values of this
          // object are the script's 'errorMessage' and 'errorType', and an array
          // of stack trace elements.
          const error = resp.error.details[0];
          console.log("Script error message: " + error.errorMessage);
          console.log("Script error stacktrace:");

          if (error.scriptStackTraceElements) {
            // There may not be a stacktrace if the script didn't start executing.
            for (let i = 0; i < error.scriptStackTraceElements.length; i++) {
              const trace = error.scriptStackTraceElements[i];
              console.log("\t%s: %s", trace.function, trace.lineNumber);
            }
          }
          return res.status(404).send();
        } else {
          if (resp.data.error) {
            console.log(
              "error details",
              JSON.stringify(resp.data.error.details)
            );
            res.status(404).send();
          } else {
            const excelId = resp.data.response.result;
            res.status(200).send(excelId);
          }
        }
      }
    );
  }
});

// Post request to update firebase with new excel file
app.post("/edit-account/:id", (req, res) => {
  // Authorization
  fs.readFile("credentials.json", (err, content) => {
    if (err) return console.log("Error loading client secret file:", err);
    // Authorize a client with credentials, then call the Google Apps Script API.
    authorize(JSON.parse(content), callAppsScript);
  });

  function callAppsScript(auth) {
    const scriptId = process.env.APPS_SCRIPT_ID;
    const script = google.script("v1");
    const fileurl = req.body.file;

    // Make the API request. The request object is included here as 'resource'.
    script.scripts.run(
      {
        auth: auth,
        resource: {
          function: "updateFirebase",
          parameters: [fileurl],
        },
        scriptId: scriptId,
      },
      function (err, resp) {
        if (err) {
          // The API encountered a problem before the script started executing.
          console.log("The API returned an error: " + err);
          return res.status(404).send();
        }
        if (resp.error) {
          // The API executed, but the script returned an error.

          // Extract the first (and only) set of error details. The values of this
          // object are the script's 'errorMessage' and 'errorType', and an array
          // of stack trace elements.
          const error = resp.error.details[0];
          console.log("Script error message: " + error.errorMessage);
          console.log("Script error stacktrace:");

          if (error.scriptStackTraceElements) {
            // There may not be a stacktrace if the script didn't start executing.
            for (let i = 0; i < error.scriptStackTraceElements.length; i++) {
              const trace = error.scriptStackTraceElements[i];
              console.log("\t%s: %s", trace.function, trace.lineNumber);
            }
          }
          return res.status(404).send();
        } else {
          if (resp.data.error) {
            console.log(
              "error details",
              JSON.stringify(resp.data.error.details)
            );
            res.status(404).send();
          } else {
            const excelId = resp.data.response.result;
            res.status(200).send(excelId);
          }
        }
      }
    );
  }
});

/**
 * Create an OAuth2 client with the given credentials, and then execute the
 * given callback function.
 * @param {Object} credentials The authorization client credentials.
 * @param {function} callback The callback to call with the authorized client.
 */
function authorize(credentials, callback) {
  const { client_secret, client_id, redirect_uris } = credentials.installed;
  const oAuth2Client = new google.auth.OAuth2(
    client_id,
    client_secret,
    redirect_uris[0]
  );

  // Check if we have previously stored a token.
  fs.readFile(TOKEN_PATH, (err, token) => {
    if (err) return getAccessToken(oAuth2Client, callback);
    oAuth2Client.setCredentials(JSON.parse(token));
    callback(oAuth2Client);
  });
}

/**
 * Get and store new token after prompting for user authorization, and then
 * execute the given callback with the authorized OAuth2 client.
 * @param {google.auth.OAuth2} oAuth2Client The OAuth2 client to get token for.
 * @param {getEventsCallback} callback The callback for the authorized client.
 */
function getAccessToken(oAuth2Client, callback) {
  console.log("getaccesstoken");
  const authUrl = oAuth2Client.generateAuthUrl({
    access_type: "offline",
    scope: scopes,
  });
  console.log("Authorize this app by visiting this url:", authUrl);
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  rl.question("Enter the code from that page here: ", (code) => {
    console.log("here");
    rl.close();
    oAuth2Client.getToken(code, (err, token) => {
      if (err) return console.error("Error retrieving access token", err);
      console.log("setting credentials");
      oAuth2Client.setCredentials(token);
      // Store the token to disk for later program executions
      fs.writeFile(TOKEN_PATH, JSON.stringify(token), (err) => {
        if (err) return console.error(err);
        console.log("Token stored to", TOKEN_PATH);
      });
      callback(oAuth2Client);
    });
  });
}
