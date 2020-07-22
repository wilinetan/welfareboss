import React, { Component } from "react";
import { withFirebase } from "../Firebase";

import { PieChart } from "react-minimal-pie-chart";

// MUST MAKE COLLECTED +1 WHEN SOMEONE COLLECTS
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
      console.log("collected in mount", collected);

      this.setState({
        loading: false,
        collected: collected,
      });
    });

    // this.props.firebase.colDetails().on("value", (snapshot) => {
    // 	var collect = snapshot.val();

    // 	this.props.firebase.matDetails().on("value", (snapshot) => {
    // 		var total = snapshot.numChildren();

    // 		this.setState({
    // 			loading: false,
    // 			collected: collect,
    // 			totalppl: total,
    // 		});
    // 	});
    // });
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
          radius={25}
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
/* <Pie loading={loading} collected={collected} totalppl={totalppl} /> */
// const Pie = ({ loading, collected, totalppl }) => (
// 	<div className="text-center">
// 		<PieChart
// 			data={[
// 				{ title: "Collected", value: collected, color: "#E38627" },
// 				{
// 					title: "Not collected",
// 					value: totalppl - collected,
// 					color: "#C13C37",
// 				},
// 			]}
// 			radius={10}
// 			label={({ dataEntry }) => dataEntry.title + ", " + dataEntry.value}
// 			labelStyle={{ fontSize: 1.5 }}
// 			center={[15, 15]}
// 		/>
// 	</div>
// );

export default withFirebase(ColDetails);
