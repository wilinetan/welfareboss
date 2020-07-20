import React, { Component, createRef } from "react";
import {
	// eslint-disable-next-line
	AuthUserContext,
	withAuthorization,
	withEmailVerification,
} from "../Session";
import {
	MDBCard,
	MDBCardBody,
	MDBCardTitle,
	MDBCardText,
	MDBCardGroup,
	MDBContainer,
} from "mdbreact";
import { compose } from "recompose";
import { withFirebase } from "../Firebase";

import QueueList from "../QueueList";
import TableDetails from "../Table";
import ColDetails from "../Pie";

const HomePage = () => {
	return (
		<div className="queueinfo">
			<QueueInfo />
			<QueueList />;
			<TableDetails />
			<ColDetails />
		</div>
	);
};

class QueueDetails extends Component {
	constructor(props) {
		super(props);

		this.state = {
			loading: false,
			currServing: 0,
			currQueueNum: 0,
			left: 0,
		};
	}

	componentDidMount() {
		this.setState({ loading: true });

		this.props.firebase.queueDetails().on("value", (snapshot) => {
			var details = snapshot.val();

			this.setState({
				loading: false,
				currServing: details.currServing,
				currQueueNum: details.currQueueNum,
				left: details.currQueueNum - details.currServing,
			});
		});
	}

	render() {
		const { loading, currServing, currQueueNum, left } = this.state;
		return (
			<div className="dashboard" data-test="dashboard">
				{loading && <div>Loading ...</div>}

				<Dashboard
					loading={loading}
					currServing={currServing}
					currQueueNum={currQueueNum}
					left={left}
				/>
			</div>
		);
	}
}

const Dashboard = ({ loading, currServing, currQueueNum, left }) => (
	<div className="text-center">
		<MDBContainer>
			<MDBCardGroup>
				<MDBCard>
					<MDBCardBody>
						<MDBCardTitle tag="h5">Current Serving Queue Number</MDBCardTitle>
						<MDBCardText tag="h2">{currServing}</MDBCardText>
					</MDBCardBody>
				</MDBCard>
				<MDBCard>
					<MDBCardBody data-test="currQueueNum-card">
						<MDBCardTitle tag="h5" data-test="currQueueNum-cardtitle">
							Last Issued Queue Number
						</MDBCardTitle>
						<MDBCardText tag="h2" data-test="dashboard-currQueueNum">
							{currQueueNum}
						</MDBCardText>
					</MDBCardBody>
				</MDBCard>
				<MDBCard>
					<MDBCardBody>
						<MDBCardTitle tag="h5">Number of people in Queue</MDBCardTitle>
						<MDBCardText tag="h2">{left}</MDBCardText>
					</MDBCardBody>
				</MDBCard>
			</MDBCardGroup>
		</MDBContainer>
	</div>
);

const QueueInfo = withFirebase(QueueDetails);

const condition = (authUser) => !!authUser;

export default compose(
	withEmailVerification,
	withAuthorization(condition)
)(HomePage);
