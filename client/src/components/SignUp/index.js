import React, { Component } from "react";
import { Link, withRouter } from "react-router-dom";
import { compose } from "recompose";

import { withFirebase } from "../Firebase";
import * as ROUTES from "../../constants/routes";

import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import InputGroup from "react-bootstrap/InputGroup";
import Alert from "react-bootstrap/Alert";
import DateRangePicker from "@wojtekmaj/react-daterange-picker";
import TimeRangePicker from "@wojtekmaj/react-timerange-picker";

const SignUpPage = () => (
	<div style={{ paddingLeft: "80px", paddingRight: "80px", height: "100%" }}>
		<h1>Sign Up</h1>
		<SignUpForm />
	</div>
);

const INITIAL_STATE = {
	name: "",
	nusnetid: "",
	passwordOne: "",
	passwordTwo: "",
	venue: "",
	facultyLink: "",
	nussuLink: "",
	dateRange: null,
	startDate: "",
	endDate: "",
	timeRange: ["00:00", "00:00"],
	startTime: "00:00",
	endTime: "00:00",
	file: null,
	error: null,
};

class SignUpFormBase extends Component {
	constructor(props) {
		super(props);

		this.state = { ...INITIAL_STATE };
	}

	onSubmit = (event) => {
		const {
			name,
			nusnetid,
			passwordOne,
			file,
			startTime,
			endTime,
			startDate,
			endDate,
			facultyLink,
			nussuLink,
			venue,
		} = this.state;

		const email = nusnetid.concat("@u.nus.edu");
		this.props.firebase
			.doCreateUserWithEmailAndPassword(email, passwordOne)
			.then((authUser) => {
				// Update user profile
				this.props.firebase.doUpdateProfile(name);

				// Upload file to Firebase storage
				var uploadFile = this.props.firebase
					.userStorage(authUser.user.uid)
					.child(file.name)
					.put(file);

				// Create user in the Firebase realtime database
				uploadFile.then((snapshot) => {
					snapshot.ref.getDownloadURL().then((url) => {
						this.props.firebase.user(authUser.user.uid).set({
							name,
							email,
							file: url,
							startDate,
							endDate,
							startTime,
							endTime,
							facultyLink,
							nussuLink,
							venue,
						});

						// Sync excel data to Firebase realtime database
						this.syncToFirebase(authUser.user.uid, url).then(
							(spreadsheetid) => {
								console.log("promise done!", spreadsheetid);
								this.props.firebase.user(authUser.user.uid).update({
									spreadsheetid,
								});
								// Update Computing collection with admin details
								this.props.firebase.db.ref("Computing/admin").set({
									starttime: startTime,
									endtime: endTime,
									startdate: startDate,
									enddate: endDate,
									venue,
									facultylink: facultyLink,
									nussulink: nussuLink,
								});
							}
						);
					});
				});
			})
			.then(() => {
				return this.props.firebase.doSendEmailVerification();
			})
			.then(() => {
				// Reset state to intial state and redirect user to Home page
				this.setState({ ...INITIAL_STATE });
				this.props.history.push(ROUTES.HOME);
			})
			.catch((error) => {
				this.setState({ error });
			});

		event.preventDefault();
	};

	syncToFirebase = async (id, url) => {
		const response = await fetch(`/signup/${id}`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ file: url }),
		});
		const body = await response.text();
		return body;
	};

	onChange = (event) => {
		this.setState({ [event.target.name]: event.target.value });
	};

	onFileChange = (event) => {
		this.setState({ file: event.target.files[0] });
	};

	onDateChange = (date) => {
		const start = date[0];
		const end = date[1];

		const formattedStart =
			start.getDate() +
			"/" +
			(start.getMonth() + 1) +
			"/" +
			(start.getFullYear() % 100);

		const formattedEnd =
			end.getDate() +
			"/" +
			(end.getMonth() + 1) +
			"/" +
			(end.getFullYear() % 100);

		this.setState({
			dateRange: date,
			startDate: formattedStart,
			endDate: formattedEnd,
		});
	};

	onTimeChange = (time) => {
		const start = time[0].split(":").join("");
		const end = time[1].split(":").join("");
		this.setState({ timeRange: time, startTime: start, endTime: end });
	};

	render() {
		const {
			name,
			nusnetid,
			passwordOne,
			passwordTwo,
			venue,
			nussuLink,
			facultyLink,
			dateRange,
			timeRange,
			startTime,
			endTime,
			error,
		} = this.state;

		const invalidId =
			nusnetid !== ""
				? nusnetid.length !== 8 || nusnetid.charAt(0).toUpperCase() !== "E"
				: false;

		const validId =
			nusnetid.length === 8 && nusnetid.charAt(0).toUpperCase() === "E";

		const invalidPassword =
			passwordOne === "" || passwordTwo === ""
				? false
				: validId && name !== "" && passwordOne !== passwordTwo;

		const invalidTime = parseInt(startTime) - parseInt(endTime) >= 0;

		return (
			<Form onSubmit={this.onSubmit}>
				<Form.Group controlId="formBasicName">
					<Form.Label>Full Name</Form.Label>
					<Form.Control
						name="name"
						value={name}
						type="text"
						placeholder="Enter full name"
						onChange={this.onChange}
						required
					/>
				</Form.Group>

				<Form.Group controlId="formEmail">
					<Form.Label>NUS email address</Form.Label>
					<InputGroup className="email">
						<Form.Control
							placeholder="NUSNET ID"
							name="nusnetid"
							value={nusnetid}
							aria-label="NUSNET ID"
							aria-describedby="basic-addon2"
							onChange={this.onChange}
							isInvalid={invalidId}
							isValid={validId}
							required
						/>
						<InputGroup.Append>
							<InputGroup.Text id="basic-addon2">@u.nus.edu</InputGroup.Text>
						</InputGroup.Append>
						<Form.Control.Feedback type="invalid">
							Invalid ID.
						</Form.Control.Feedback>
						<Form.Control.Feedback type="valid">
							Valid ID.
						</Form.Control.Feedback>
					</InputGroup>
				</Form.Group>

				<Form.Group controlId="formBasicPassword">
					<Form.Label>Password</Form.Label>
					<Form.Control
						name="passwordOne"
						value={passwordOne}
						type="password"
						placeholder="Password"
						onChange={this.onChange}
						required
					/>
				</Form.Group>

				<Form.Group controlId="formConfirmPassword">
					<Form.Label>Confirm Password</Form.Label>
					<Form.Control
						name="passwordTwo"
						value={passwordTwo}
						type="password"
						placeholder="Password"
						onChange={this.onChange}
						isInvalid={invalidPassword}
						required
					/>
					<Form.Control.Feedback type="invalid">
						Invalid password. Please ensure both passwords are the same.
					</Form.Control.Feedback>
				</Form.Group>

				<Form.Group>
					<Form.Label>Collection Dates</Form.Label>
					<Form.Group>
						<DateRangePicker
							onChange={this.onDateChange}
							value={dateRange}
							required={true}
							clearIcon={null}
						/>
					</Form.Group>
				</Form.Group>

				<Form.Group>
					<Form.Label>Collection Time</Form.Label>
					<Form.Group>
						<TimeRangePicker
							onChange={this.onTimeChange}
							value={timeRange}
							format="hh:mm a"
							disableClock={true}
							maxDetail="minute"
							required={true}
							clearIcon={null}
						/>
						<Form.Text>
							{invalidTime ? (
								timeRange[0] === "00:00" && timeRange[1] === "00:00" ? (
									""
								) : (
									<p style={{ color: "red" }}>
										Please input a valid time range.
									</p>
								)
							) : (
								<p style={{ color: "green" }}>Great!</p>
							)}
						</Form.Text>
					</Form.Group>
				</Form.Group>

				<Form.Group controlId="venue">
					<Form.Label>Collection Venue</Form.Label>
					<Form.Control
						name="venue"
						value={venue}
						type="text"
						placeholder="Enter collection venue"
						onChange={this.onChange}
						required
					/>
				</Form.Group>

				<Form.Group controlId="facultylink">
					<Form.Label>Faculty Survey Link</Form.Label>
					<Form.Control
						name="facultyLink"
						value={facultyLink}
						type="text"
						placeholder="Enter Faculty survey link"
						onChange={this.onChange}
						required
					/>
				</Form.Group>

				<Form.Group controlId="nussulink">
					<Form.Label>NUSSU Survey Link</Form.Label>
					<Form.Control
						name="nussuLink"
						value={nussuLink}
						type="text"
						placeholder="Enter NUSSU survey link"
						onChange={this.onChange}
						required
					/>
				</Form.Group>

				<Form.Group onChange={this.onFileChange}>
					<Form.File
						id="exampleFormControlFile1"
						label="Upload Excel File"
						required
					/>
				</Form.Group>

				<Button
					variant="primary"
					type="submit"
					disabled={invalidPassword || invalidId || invalidTime}
				>
					Sign Up
				</Button>

				{error && (
					<Alert variant="danger" style={{ marginTop: "10px" }}>
						{error.message}
					</Alert>
				)}
			</Form>
		);
	}
}

const SignUpLink = () => (
	<p>
		Don't have an account? <Link to={ROUTES.SIGN_UP}>Sign Up</Link>
	</p>
);

const SignUpForm = compose(withRouter, withFirebase)(SignUpFormBase);

export default SignUpPage;

export { SignUpForm, SignUpLink };
