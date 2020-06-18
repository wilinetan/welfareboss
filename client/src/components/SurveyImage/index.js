import React, { Component } from "react";

import Button from "react-bootstrap/Button";

class SurveyImage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      showImage: false,
    };
  }

  onClick = () => {
    this.setState((prevState) => ({
      showImage: !prevState.showImage,
    }));
  };

  render() {
    const { showImage } = this.state;

    return (
      <div className="surveyimage">
        <div className="toggleshowimage">
          <Button
            variant="outline-dark"
            size="sm"
            onClick={this.onClick}
            style={{ width: "70px", padding: "1px", fontSize: "10px" }}
          >
            {showImage ? "Hide Image" : "Show Image"}
          </Button>
        </div>
        {showImage && (
          <img
            alt=""
            src={this.props.imageUrl}
            style={{ paddingTop: "5px" }}
          ></img>
        )}
      </div>
    );
  }
}

export default SurveyImage;
