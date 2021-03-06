import React, { Component } from "react";
import { withFirebase } from "../Firebase";

import { PieChart } from "react-minimal-pie-chart";

class ColDetails extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: false,
      collected: 0,
      totalppl: 0,
    };
  }

  componentDidMount() {
    this.setState({ loading: true });

    this.props.firebase.matDetails().once("value", (snapshot) => {
      var total = snapshot.numChildren();
      this.setState({
        totalppl: total,
      });
    });

    this.props.firebase.colDetails().on("value", (snapshot) => {
      var collected = snapshot.val().total;

      this.setState({
        loading: false,
        collected: collected,
      });
    });
  }

  componentWillUnmount() {
    this.props.firebase.colDetails().off();
    this.props.firebase.matDetails().off();
  }

  render() {
    const { loading, collected, totalppl } = this.state;
    const data = [
      { title: "Collected", value: collected, color: "#E38627" },
      {
        title: "Not collected",
        value: totalppl - collected,
        color: "#C13C37",
      },
    ];

    return (
      <div className="piechart">
        {loading && <div>Loading ...</div>}

        <PieChart
          data={data}
          radius={18}
          labelPosition={112}
          label={({ dataEntry }) => dataEntry.title + ", " + dataEntry.value}
          labelStyle={(index) => ({
            fill: data[index].color,
            fontSize: "4px",
            fontFamily: "sans-serif",
          })}
        />
      </div>
    );
  }
}

export default withFirebase(ColDetails);
