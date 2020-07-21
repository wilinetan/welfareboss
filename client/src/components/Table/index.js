import React, { Component } from "react";
import { withFirebase } from "../Firebase";
import Table from "react-bootstrap/Table";

class TableDetails extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: false,
      dates: [],
      day: [],
      colheader: {},
    };
  }

  componentDidMount() {
    this.setState({ loading: true });

    this.props.firebase.colByDateTime().on("value", (snapshot) => {
      const dateObject = snapshot.val();
      const day = Object.keys(dateObject);

      const dateList = Object.keys(dateObject).map((key) => ({
        ...dateObject[key],
        date: key,
      }));

      this.setState({
        loading: false,
        dates: dateList,
        colheader: dateList[0],
        day: day,
      });

      // var details = snapshot.val();
      // var sdate = details.startdate;
      // var edate = details.enddate;
      // var stime = details.starttime;
      // var etime = details.endtime;

      // var data = [["date", "hour", "number"]];

      // for (
      // 	var i = parseInt(sdate.slice(0, 2));
      // 	i <= parseInt(edate.slice(0, 2));
      // 	i++
      // ) {
      // 	var date = String(i) + sdate.slice(2);
      // 	for (
      // 		var j = parseInt(stime.slice(0, 2));
      // 		j <= parseInt(etime.slice(0, 2));
      // 		j++
      // 	) {
      // 		var arr = [];
      // 		var time = String(j) + "00";
      // 		arr.push(date);
      // 		arr.push(time);
      // 		arr.push(0);
      // 		data.push(arr);
      // 	}
      // }
      // console.log("data", data);

      // this.setState({
      // 	loading: false,
      // 	data: data,
      // });
    });
  }

  componentWillUnmount = () => {
    this.props.firebase.colByDateTime().off();
  };

  render() {
    const { loading, dates, day, colheader } = this.state;
    return (
      <div>
        {loading && <div>Loading ...</div>}
        <Table
          bordered
          hover
          size="sm"
          style={{ width: "1200px", marginLeft: "auto", marginRight: "auto" }}
        >
          <thead>
            <tr>
              <th>Day/Hour</th>
              {Object.keys(colheader)
                .slice(0, -1)
                .map((header) => (
                  <th key={header}>{header}</th>
                ))}
            </tr>
          </thead>
          <tbody>
            {dates.map((d) => (
              <tr key={d.date}>
                <td>Day {d.date}</td>
                {delete d.date}
                {Object.values(d)
                  // .slice(0, -2)
                  .map((value) => (
                    <td key={d.date + value}>{value}</td>
                  ))}
              </tr>
            ))}
          </tbody>
        </Table>
      </div>
    );
  }
}

export default withFirebase(TableDetails);
