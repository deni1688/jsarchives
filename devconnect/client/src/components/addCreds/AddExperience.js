import React, { Component } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { withRouter } from "react-router-dom";
import TextFieldGroup from "../common/TextFieldGroup";
import TextAreaFieldGroup from "../common/TextAreaFieldGroup";
import { addExperience } from "actions/profileActions";
class AddExperience extends Component {
	state = {
		company: "",
		title: "",
		location: "",
		from: "",
		to: "",
		current: false,
		desc: "",
		errors: {},
		disabled: false
	};
	onSubmit = e => {
		e.preventDefault();

		const expData = {
			company: this.state.company,
			title: this.state.title,
			location: this.state.location,
			from: this.state.from,
			to: this.state.to,
			current: this.state.current,
			desc: this.state.desc
		};

		this.props.addExperience(expData, this.props.history);
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
		return (
			<div className="add-experience">
				<div className="container">
					<div className="row">
						<div className="col-md-8 m-auto">
							<Link to="/dashboard" className="btn btn-dark btn-sm mb-3">
								Back to Dashboard
							</Link>
							<h1>Add Experience</h1>
							<p>Add past and current job or experience</p>
							<form onSubmit={this.onSubmit}>
								<TextFieldGroup
									placeholder="Company (required)"
									name="company"
									value={this.state.company}
									onChange={this.handleChange}
									error={errors.company}
								/>
								<TextFieldGroup
									placeholder="Job Title (required)"
									name="title"
									value={this.state.title}
									onChange={this.handleChange}
									error={errors.title}
								/>
								<TextFieldGroup
									placeholder="Location"
									name="location"
									value={this.state.location}
									onChange={this.handleChange}
									error={errors.location}
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
										Current Job
									</label>
								</div>
								<TextAreaFieldGroup
									placeholder="Job Description"
									name="desc"
									value={this.state.desc}
									onChange={this.handleChange}
									error={errors.desc}
									info="Tell us about the the position"
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
AddExperience.propTypes = {
	addExperience: PropTypes.func.isRequired,
	profile: PropTypes.object.isRequired,
	errors: PropTypes.object.isRequired
};

const mapStateToPorps = state => ({
	profile: state.profile,
	errors: state.errors
});
export default connect(mapStateToPorps, { addExperience })(
	withRouter(AddExperience)
);
