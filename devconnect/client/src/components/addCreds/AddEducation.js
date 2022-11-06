import React, { Component } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { withRouter } from "react-router-dom";
import TextFieldGroup from "../common/TextFieldGroup";
import TextAreaFieldGroup from "../common/TextAreaFieldGroup";
import { addEducation } from "actions/profileActions";
class AddEducation extends Component {
	state = {
		school: "",
		degree: "",
		fieldOfStudy: "",
		from: "",
		to: "",
		current: false,
		desc: "",
		errors: {},
		disabled: false
	};
	onSubmit = e => {
		e.preventDefault();

		const eduData = {
			school: this.state.school,
			degree: this.state.degree,
			fieldOfStudy: this.state.fieldOfStudy,
			from: this.state.from,
			to: this.state.to,
			current: this.state.current,
			desc: this.state.desc
		};

		this.props.addEducation(eduData, this.props.history);
	};

	handleChange = e => {
		this.setState({ [e.target.name]: e.target.value });
	};
	handleCheck = e => {
		this.setState({
			disabled: !this.state.disabled,
			current: !this.state.current
		});
	};
	componentWillReceiveProps(nextProps) {
		if (nextProps.errors) {
			this.setState({ errors: nextProps.errors });
		}
	}
	render() {
		const { errors } = this.state;
		console.log(this.props);

		return (
			<div className="add-education">
				<div className="container">
					<div className="row">
						<div className="col-md-8 m-auto">
							<Link to="/dashboard" className="btn btn-dark btn-sm mb-3">
								Back to Dashboard
							</Link>
							<h1>Add Education</h1>
							<p>Add education, certifications, other creditations</p>
							<form onSubmit={this.onSubmit}>
								<TextFieldGroup
									placeholder="School (required)"
									name="school"
									value={this.state.school}
									onChange={this.handleChange}
									error={errors.school}
								/>
								<TextFieldGroup
									placeholder="Degree (required)"
									name="degree"
									value={this.state.degree}
									onChange={this.handleChange}
									error={errors.degree}
								/>
								<TextFieldGroup
									placeholder="Field of study"
									name="fieldOfStudy"
									value={this.state.fieldOfStudy}
									onChange={this.handleChange}
									error={errors.fieldOfStudy}
								/>
								<div className="d-md-flex">
									<span className="w-50 mr-md-2">
										<label>From Date</label>
										<TextFieldGroup
											name="from"
											type="date"
											value={this.state.from}
											onChange={this.handleChange}
											error={errors.from}
										/>
									</span>
									<span className="w-50 ml=md-2">
										<label>To Date</label>
										<TextFieldGroup
											name="to"
											type="date"
											value={this.state.to}
											onChange={this.handleChange}
											error={errors.to}
											disabled={this.state.disabled ? "disabled" : ""}
										/>
									</span>
								</div>
								<div className="form-check mb-4">
									<input
										type="checkbox"
										className="form-check-input"
										name="current"
										value={this.state.current}
										checked={this.state.current}
										onChange={this.handleCheck}
										id="current"
									/>
									<label htmlFor="current" className="form-check-label">
										Currently Attending
									</label>
								</div>
								<TextAreaFieldGroup
									placeholder="Description"
									name="desc"
									value={this.state.desc}
									onChange={this.handleChange}
									error={errors.desc}
									info="Tell us about what you studied"
								/>
								<input
									type="submit"
									value="Submit"
									className="btn btn-info btn-block mt-4"
								/>
							</form>
						</div>
					</div>
				</div>
			</div>
		);
	}
}
AddEducation.propTypes = {
	addEducation: PropTypes.func.isRequired,
	profile: PropTypes.object.isRequired,
	errors: PropTypes.object.isRequired
};

const mapStateToPorps = state => ({
	profile: state.profile,
	errors: state.errors
});
export default connect(mapStateToPorps, { addEducation })(
	withRouter(AddEducation)
);
