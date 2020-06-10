import React, { Component } from "react";

import Form from "react-bootstrap/Form";
import FormCheck from "react-bootstrap/FormCheck";

class QueueItem extends Component {
  render() {
    const { teleid, name, matric, collected, queueNum } = this.props.student;
    return (
      <Form.Check
        type="checkbox"
        id={teleid}
        onClick={this.props.markCollect.bind(this, teleid)}
      />
      // <Form>
      //   <Form.Check>
      //     <FormCheck.Input
      //       custom
      //       type="checkbox"
      //       id={teleid}
      //       onClick={this.props.markCollect.bind(this, teleid)}
      //     />
      //     <FormCheck.Label
      //       style={{ textDecoration: collected ? "line-through" : "none" }}
      //     >{`${queueNum} ${name} ${matric} ${collected}`}</FormCheck.Label>
      //   </Form.Check>
      // </Form>
    );
  }
}

export default QueueItem;
