import React, { Component } from "react";
import { withFirebase } from "../Firebase";
import Table from "react-bootstrap/Table";

class TableDetails extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: false,
      dates: [],
      hours: [],
    };
  }

  componentDidMount() {
    this.setState({ loading: true });

    this.props.firebase.colByDateTime().on("value", (snapshot) => {
      const dateObject = snapshot.val();

      const dateList = Object.keys(dateObject).map((key) => ({
        ...dateObject[key],
        date: key,
      }));

      const hours = Object.keys(dateList[0]);
      hours.pop();

      this.setState({
        loading: false,
        dates: dateList,
        hours: hours,
      });
    });
  }

  componentWillUnmount = () => {
    this.props.firebase.colByDateTime().off();
  };

  render() {
    const { loading, dates, hours } = this.state;

    return (
      <div className="tablestats">
        {loading && <div>Loading ...</div>}
        <TableContent dates={dates} hours={hours} />
      </div>
    );
  }
}

const TableContent = ({ dates, hours }) => (
  <Table
    bordered
    hover
    size="sm"
    style={{ width: "1200px", marginLeft: "auto", marginRight: "auto" }}
  >
    <thead>
      <tr>
        <th>Day/Hour</th>
        {hours.map((hour) => (
          <th key={hour}>{hour}</th>
        ))}
      </tr>
    </thead>
    <tbody>
      {dates.map((d) => (
        <tr key={"day-" + d.date}>
          <td>Day {d.date}</td>
          {hours.map((hour) => (
            <td key={d.date + "-" + hour}>{d[hour]}</td>
          ))}
        </tr>
      ))}
    </tbody>
  </Table>
);

export default withFirebase(TableDetails);
