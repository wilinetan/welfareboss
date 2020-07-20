import React, { Component } from "react";
import { withFirebase } from "../Firebase";

import PivotTableUI from "react-pivottable/PivotTableUI";
import "react-pivottable/pivottable.css";

class TableDetails extends Component {
	constructor(props) {
		super(props);

		this.state = {
			loading: false,
			data: [],
			pivotState: props,
		};
	}

	componentDidMount() {
		this.setState({ loading: true });

		this.props.firebase.adminDetails().on("value", (snapshot) => {
			var details = snapshot.val();
			var sdate = details.startdate;
			var edate = details.enddate;
			var stime = details.starttime;
			var etime = details.endtime;

			var data = [["date", "hour", "number"]];

			for (
				var i = parseInt(sdate.slice(0, 2));
				i <= parseInt(edate.slice(0, 2));
				i++
			) {
				var date = String(i) + sdate.slice(2);
				for (
					var j = parseInt(stime.slice(0, 2));
					j <= parseInt(etime.slice(0, 2));
					j++
				) {
					var arr = [];
					var time = String(j) + "00";
					arr.push(date);
					arr.push(time);
					arr.push(0);
					data.push(arr);
				}
			}
			console.log("data", data);

			this.setState({
				loading: false,
				data: data,
			});
		});
	}

	componentWillUnmount = () => {
		this.props.firebase.adminDetails().off();
	};

	render() {
		const { loading, data } = this.state;
		return (
			<div>
				{loading && <div>Loading ...</div>}
				<PivotTableUI
					data={data}
					{...this.state.pivotState}
					onChange={(s) => this.setState({ pivotState: s })}
				/>
			</div>
		);
	}
}

export default withFirebase(TableDetails);
