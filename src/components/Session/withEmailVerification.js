import React from "react";

import AuthUserContext from "./context";
import { withFirebase } from "../Firebase";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";

const needsEmailVerification = (authUser) =>
  authUser && !authUser.emailVerified;

const withEmailVerification = (Component) => {
  class WithEmailVerification extends React.Component {
    constructor(props) {
      super(props);

      this.state = { isSent: false };
    }

    onSendEmailVerification = () => {
      this.props.firebase
        .doSendEmailVerification()
        .then(() => this.setState({ isSent: true }));
    };

    render() {
      return (
        <AuthUserContext.Consumer>
          {(authUser) =>
            needsEmailVerification(authUser) ? (
              <div>
                <Card
                  border="dark"
                  style={{
                    padding: "10px",
                    display: "block",
                    textAlign: "center",
                    width: "fit-content",
                    marginLeft: "240px",
                    marginTop: "50px",
                  }}
                >
                  <Card.Body>
                    {this.state.isSent
                      ? "E-Mail confirmation sent: Check you E-Mails (Spam folder " +
                        "included) for a confirmation E-Mail. Refresh this page once " +
                        "you confirmed your E-Mail."
                      : "Verify your E-Mail: Check you E-Mails (Spam folder included) " +
                        "for a confirmation E-Mail or send another confirmation E-Mail."}
                  </Card.Body>
                  <Button
                    variant="primary"
                    onClick={this.onSendEmailVerification}
                    disabled={this.state.isSent}
                  >
                    Send confirmation E-Mail
                  </Button>
                </Card>
              </div>
            ) : (
              <Component {...this.props} />
            )
          }
        </AuthUserContext.Consumer>
      );
    }
  }

  return withFirebase(WithEmailVerification);
};

export default withEmailVerification;
