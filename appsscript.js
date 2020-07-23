const fs = require("fs");
const readline = require("readline");
const { google } = require("googleapis");

const dotenv = require("dotenv");
dotenv.config();

class AppsScript {
  constructor(fileurl) {
    this.scopes = [
      "https://www.googleapis.com/auth/firebase.database",
      "https://www.googleapis.com/auth/drive",
      "https://www.googleapis.com/auth/script.external_request",
      "https://www.googleapis.com/auth/spreadsheets",
    ];
    this.TOKEN_PATH = "token.json";
    this.fileurl = fileurl;
  }

  async runAppsScript() {
    const fileurl = this.fileurl;

    const client_secret = process.env.CLIENT_SECRET;
    const client_id = process.env.CLIENT_ID;
    const redirect_uri = process.env.REDIRECT_URI;

    const auth = new google.auth.OAuth2(client_id, client_secret, redirect_uri);

    auth.setCredentials({
      access_token: process.env.ACCESS_TOKEN,
      refresh_token: process.env.REFRESH_TOKEN,
      scope: process.env.SCOPE,
      token_type: process.env.TOKEN_TYPE,
      expiry_date: process.env.EXPIRY_DATE,
    });

    return await this.callAppsScript(auth, fileurl);
  }

  // fs.readFile("credentials.json", (err, content) => {
  //   if (err) return console.log("Error loading client secret file:", err);
  //   // Authorize a client with credentials, then call the Google Apps Script API.
  //   this.authorize(JSON.parse(content), callAppsScript);
  // });
  async callAppsScript(auth, fileurl) {
    const scriptId = process.env.APPS_SCRIPT_ID;
    const script = google.script("v1");

    try {
      const res = await script.scripts.run({
        auth: auth,
        resource: {
          function: "updateFirebase",
          parameters: [fileurl],
        },
        scriptId: scriptId,
      });
      return res.data.response.result;
    } catch (err) {
      return err;
    }

    // console.log("res", res.data.response);
    // return res.data.response;

    // Make the API request. The request object is included here as 'resource'.
    // script.scripts.run(
    //   {
    //     auth: auth,
    //     resource: {
    //       function: "updateFirebase",
    //       parameters: [fileurl],
    //     },
    //     scriptId: scriptId,
    //   },
    //   function (err, resp) {
    //     if (err) {
    //       // The API encountered a problem before the script started executing.
    //       console.log("The API returned an error: " + err);
    //       return err;
    //     }
    //     if (resp.error) {
    //       // The API executed, but the script returned an error.

    //       // Extract the first (and only) set of error details. The values of this
    //       // object are the script's 'errorMessage' and 'errorType', and an array
    //       // of stack trace elements.
    //       const error = resp.error.details[0];
    //       console.log("Script error message: " + error.errorMessage);
    //       console.log("Script error stacktrace:");

    //       if (error.scriptStackTraceElements) {
    //         // There may not be a stacktrace if the script didn't start executing.
    //         for (let i = 0; i < error.scriptStackTraceElements.length; i++) {
    //           const trace = error.scriptStackTraceElements[i];
    //           console.log("\t%s: %s", trace.function, trace.lineNumber);
    //         }
    //       }
    //       return resp.error.details[0];
    //     } else {
    //       if (resp.data.error) {
    //         console.log(
    //           "error details",
    //           JSON.stringify(resp.data.error.details)
    //         );
    //         return err;
    //       } else {
    //         console.log("response", resp.data);
    //         const excelId = resp.data.response.result;
    //         console.log("excelid in appscript", excelId);
    //         // return excelId;
    //       }
    //     }
    //   }
    // );
  }

  /**
   * Create an OAuth2 client with the given credentials, and then execute the
   * given callback function.
   * @param {Object} credentials The authorization client credentials.
   * @param {function} callback The callback to call with the authorized client.
   */
  authorize(credentials, callback) {
    const { client_secret, client_id, redirect_uris } = credentials.installed;
    const oAuth2Client = new google.auth.OAuth2(
      client_id,
      client_secret,
      redirect_uris[0]
    );

    // Check if we have previously stored a token.
    fs.readFile(this.TOKEN_PATH, (err, token) => {
      if (err) return this.getAccessToken(oAuth2Client, callback);
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
  getAccessToken(oAuth2Client, callback) {
    console.log("getaccesstoken");
    const authUrl = oAuth2Client.generateAuthUrl({
      access_type: "offline",
      scope: this.scopes,
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
        fs.writeFile(this.TOKEN_PATH, JSON.stringify(token), (err) => {
          if (err) return console.error(err);
          console.log("Token stored to", this.TOKEN_PATH);
        });
        callback(oAuth2Client);
      });
    });
  }
}

module.exports = AppsScript;
