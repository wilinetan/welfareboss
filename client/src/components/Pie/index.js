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

		this.props.firebase.db.ref("Computing/matric").once("value", (snapshot) => {
			var total = snapshot.numChildren();
			this.setState({
				totalppl: total,
			});
		});

		this.props.firebase.db
			.ref("Computing/collected")
			.on("value", (snapshot) => {
				var collected = snapshot.val();
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
		return (
			<div>
				{loading && <div>Loading ...</div>}

				<PieChart
					data={[
						{ title: "Collected", value: collected, color: "#E38627" },
						{
							title: "Not collected",
							value: totalppl - collected,
							color: "#C13C37",
						},
					]}
					radius={10}
					label={({ dataEntry }) => dataEntry.title + ", " + dataEntry.value}
					labelStyle={{ fontSize: 1.5 }}
					center={[15, 15]}
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
