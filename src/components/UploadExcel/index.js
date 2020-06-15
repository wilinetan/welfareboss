class UploadExcel {
  constructor(userid, faculty, fileurl, firebase) {
    this.userid = userid;
    this.faculty = faculty;
    this.fileurl = fileurl;
    this.firebase = firebase;
  }

  //   componentDidMount() {
  //     // 1. Load the JavaScript client library.
  //     console.log("here!");
  //     window.gapi.load("client:auth2", this.initClient);
  //   }

  loadClient = () => {
    console.log("userid", this.userid);
    console.log("faculty", this.faculty);
    console.log("fileurl", this.fileurl);
    console.log("firebase", this.firebase);
    window.gapi.load("client:auth2", this.initClient);
  };

  initClient = () => {
    const SCOPES =
      "https://www.googleapis.com/auth/spreadsheets " +
      "https://www.googleapis.com/auth/drive " +
      "https://www.googleapis.com/auth/script.external_request " +
      "https://www.googleapis.com/auth/script.scriptapp " +
      "https://www.googleapis.com/auth/firebase.database";

    const API_KEY = "AIzaSyCH3wKbLcJP82w7AB3Fb16HxdkyMx278cw";
    const CLIENT_ID =
      "553150065706-q3vnc160nbqtqfmana9ua68jiagba6sv.apps.googleusercontent.com";
    const DISCOVERY_DOCS = [
      "https://script.googleapis.com/$discovery/rest?version=v1",
    ];

    window.gapi.client
      .init({
        apiKey: API_KEY,
        clientId: CLIENT_ID,
        discoveryDocs: DISCOVERY_DOCS,
        scope: SCOPES,
      })
      .then(() => {
        this.callAppsScript();
      });
  };

  callAppsScript() {
    var scriptId = "1xI0yteA1ylONJQc_BieqwWvvFw-UJCHo6gj5koYqmeWD3Q5l-oI2tmZk";
    console.log("run scripts!");
    // Call the Apps Script API run method
    //   'scriptId' is the URL parameter that states what script to run
    //   'resource' describes the run request body (with the function name
    //              to execute)
    console.log("userid2", this.userid);
    console.log("faculty2", this.faculty);
    console.log("fileurl2", this.fileurl);
    console.log("firebase2", this.firebase);

    const userid = this.userid;
    const firebase = this.firebase;

    window.gapi.client.script.scripts
      .run({
        scriptId: scriptId,
        resource: {
          function: "excelToSheets",
          parameters: [this.fileurl, this.faculty],
        },
      })
      .then(function (resp) {
        var result = resp.result;
        if (result.error && result.error.status) {
          // The API encountered a problem before the script started executing.
          console.log("error1", result.error);
        } else if (result.error) {
          // The API executed, but the script returned an error.
          var error = result.error.details[0];

          console.log("error2", error.errorMessage);
        } else {
          console.log("resp", resp);
          console.log("result", resp.result);
          console.log("resp.result.response", resp.result.response);
          console.log(
            "resp.result.response.result",
            resp.result.response.result
          );
          var fileid = resp.result.response.result;

          firebase.user(userid).update({
            spreadsheetfile: fileid,
          });
        }
      })
      .catch((err) => {
        console.log("ERROR", err);
      });
  }
}

export default UploadExcel;
