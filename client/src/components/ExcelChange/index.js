import React, { Component } from "react";
import { compose } from "recompose";

import { withFirebase } from "../Firebase";
import { withRouter } from "react-router-dom";

import * as ROUTES from "../../constants/routes";

import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Alert from "react-bootstrap/Alert";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

class ExcelChange extends Component {
  constructor(props) {
    super(props);

    this.state = {
      newFile: null,
      error: null,
    };
  }

  onSubmit = (event) => {
    const { uid } = this.props.authUser;
    const { newFile } = this.state;

    // Upload file to Firebase storage
    var uploadFile = this.props.firebase
      .userStorage(uid)
      .child(newFile.name)
      .put(newFile);

    // Update user data in Firebase realtime database
    uploadFile
      .then((snapshot) => {
        snapshot.ref.getDownloadURL().then((url) => {
          // Sync excel data to Firebase realtime database
          this.syncToFirebase(uid, url).then((spreadsheetid) => {
            this.props.firebase.user(uid).update({
              file: url,
              spreadsheetid,
            });

            // Update Computing collection with admin details
            this.props.firebase.adminDetails().update({
              excelfile: url,
              spreadsheetid,
            });
          });
        });
      })
      .then(() => {
        this.setState({ newFile: null, error: null });
        this.props.history.push(ROUTES.ACCOUNT);
      })
      .catch((error) => {
        this.setState({ error });
      });

    event.preventDefault();
  };

  syncToFirebase = async (id, url) => {
    const response = await fetch(`/edit-account/${id}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ file: url }),
    });
    const body = await response.text();
    return body;
  };

  onFileChange = (event) => {
    this.setState({ newFile: event.target.files[0] });
  };

  render() {
    const { newFile, error } = this.state;

    return (
      <Form
        onSubmit={this.onSubmit}
        style={{
          overflow: "hidden",
        }}
      >
        <Row>
          <Col sm={3}>
            <p>Current Excel File</p>
          </Col>
          <Col sm={9} style={{ paddingLeft: "0px" }}>
            <a
              target="_blank"
              rel="noopener noreferrer"
              href={this.props.excelFile}
            >
              Download excel file
            </a>
          </Col>
        </Row>

        <Form.Group
          as={Row}
          controlId="changeExcelForm"
          onChange={this.onFileChange}
        >
          <Col sm={3}>
            <Form.Label style={{ lineHeight: "2" }}>
              Upload New Excel File
            </Form.Label>
          </Col>
          <Col sm={9} style={{ paddingLeft: "0px" }}>
            <Form.File id="changeExcelFile" />
          </Col>
        </Form.Group>

        <Button
          variant="dark"
          type="submit"
          disabled={newFile === null}
          style={{ marginBottom: "10px", float: "right" }}
        >
          Change Excel File
        </Button>

        {error && (
          <Alert variant="danger" style={{ marginTop: "10px" }}>
            {error.message}
          </Alert>
        )}
      </Form>
    );
  }
}

export default compose(withFirebase, withRouter)(ExcelChange);
