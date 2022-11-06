import React, { Component } from "react";
import PropTypes from "prop-types";
import isEmpty from "validation/isEmpty";
import { connect } from "react-redux";
import { Link, withRouter } from "react-router-dom";
import { createProfile, getCurrentProfile } from "actions/profileActions";
import TextFieldGroup from "../common/TextFieldGroup";
import TextAreaFieldGroup from "../common/TextAreaFieldGroup";
import SelectListGroup from "../common/SelectListGroup";
import InputGroup from "../common/InputGroup";

class EditProfile extends Component {
	state = {
		showSocialInputs: false,
		handle: "",
		company: "",
		website: "",
		location: "",
		status: "",
		skills: "",
		github: "",
		bio: "",
		twitter: "",
		facebook: "",
		youtube: "",
		instagram: "",
		linkedin: "",
		errors: {}
	};
	handleChange = e => {
		this.setState({ [e.target.name]: e.target.value });
	};

	handleSubmit = e => {
		e.preventDefault();
		const profileData = {
			handle: this.check(this.state.handle),
			company: this.check(this.state.company),
			website: this.check(this.state.website),
			location: this.check(this.state.location),
			status: this.check(this.state.status),
			skills: this.check(this.state.skills),
			github: this.check(this.state.github),
			bio: this.check(this.state.bio),
			twitter: this.check(this.state.twitter),
			facebook: this.check(this.state.facebook),
			youtube: this.check(this.state.youtube),
			instagram: this.check(this.state.instagram),
			linkedin: this.check(this.state.linkedin)
		};

		this.props.createProfile(profileData, this.props.history);
	};
	componentWillReceiveProps(nextProps) {
		if (nextProps.errors) {
			this.setState({ errors: nextProps.errors });
		}
		if (nextProps.profile.profile) {
			const {
				handle,
				website,
				skills,
				location,
				status,
				company,
				bio,
				github
			} = nextProps.profile.profile;
			const social = !isEmpty(nextProps.profile.profile.social)
				? nextProps.profile.profile.social
				: {};

			this.setState({
				website,
				location,
				status,
				company,
				handle,
				bio,
				github,
				skills: skills.join(", "),
				...social
			});
		}
	}

	check = value => {
		if (!isEmpty(value)) return value;
		return "";
	};

	componentDidMount() {
		this.props.getCurrentProfile();
	}
	render() {
		const { errors, showSocialInputs } = this.state;
		let socialInputs;
		if (showSocialInputs) {
			socialInputs = (
				<div>
					<InputGroup
						type="url"
						placeholder="Twitter Profile URL"
						icon="fab fa-twitter"
						name="twitter"
						value={this.state.twitter}
						onChange={this.handleChange}
						error={errors.twitter}
					/>
					<InputGroup
						type="url"
						placeholder="Facebook Profile URL"
						icon="fab fa-facebook"
						name="facebook"
						value={this.state.facebook}
						onChange={this.handleChange}
						error={errors.facebook}
					/>
					<InputGroup
						type="url"
						placeholder="Youtube Profile URL"
						icon="fab fa-youtube"
						name="youtube"
						value={this.state.youtube}
						onChange={this.handleChange}
						error={errors.youtube}
					/>
					<InputGroup
						type="url"
						placeholder="Linkedin Profile URL"
						icon="fab fa-linkedin"
						name="linkedin"
						value={this.state.linkedin}
						onChange={this.handleChange}
						error={errors.linkedin}
					/>
					<InputGroup
						type="url"
						placeholder="Instagram Profile URL"
						icon="fab fa-instagram"
						name="instagram"
						value={this.state.instagram}
						onChange={this.handleChange}
						error={errors.instagram}
					/>
				</div>
			);
		}
		const options = [
			{
				label: "Select Professional Status (required)",
				value: 0
			},
			{
				label: "Developer",
				value: "Developer"
			},
			{
				label: "Junior Developer",
				value: "Junior Developer"
			},
			{
				label: "Senior Developer",
				value: "Senior Developer"
			},
			{
				label: "Manager",
				value: "Manager"
			},
			{
				label: "Instructor",
				value: "Instructor"
			},
			{
				label: "Intern",
				value: "Intern"
			},
			{
				label: "Designer",
				value: "Designer"
			},
			{
				label: "Other",
				value: "Other"
			}
		];
		return (
			<div className="CreateProfile">
				<div className="container">
					<div className="row">
						<div className="col-8 m-auto">
							<Link to="/dashboard" className="btn btn-info btn-sm mb-3">
								Go Back
							</Link>
							<h1> Edit Your Profile</h1>
						</div>
						<div className="col-md-8 m-auto">
							<form onSubmit={this.handleSubmit}>
								<TextFieldGroup
									placeholder="Profile Handle (required)"
									name="handle"
									value={this.state.handle}
									onChange={this.handleChange}
									info="A unique handle for your profile URL. Your full name, company name, nickname, etc"
									error={errors.handle}
								/>
								<SelectListGroup
									type="select"
									name="status"
									options={options}
									value={this.state.status}
									error={errors.status}
									info="Give as an idea where you are at professionally"
									onChange={this.handleChange}
								/>
								<TextFieldGroup
									placeholder="Company"
									name="company"
									value={this.state.company}
									onChange={this.handleChange}
									info="Your own company or your current place of work"
									error={errors.company}
								/>
								<TextFieldGroup
									placeholder="Website"
									name="website"
									value={this.state.website}
									onChange={this.handleChange}
									info="Your own website or your current place of work"
									error={errors.website}
								/>
								<TextFieldGroup
									placeholder="location"
									name="location"
									value={this.state.location}
									onChange={this.handleChange}
									info="Your city, state, country eg. Manhattan, New York, USA"
									error={errors.location}
								/>
								<TextFieldGroup
									placeholder="Skills (required)"
									name="skills"
									value={this.state.skills}
									onChange={this.handleChange}
									info="List your skills seperated by ',' eg. html, css, php"
									error={errors.skills}
								/>
								<TextFieldGroup
									placeholder="Github username"
									name="github"
									value={this.state.github}
									onChange={this.handleChange}
									info="Add if you want to show the last 5 repos of your github account"
									error={errors.github}
								/>
								<TextAreaFieldGroup
									placeholder="Bio"
									name="bio"
									value={this.state.bio}
									onChange={this.handleChange}
									info="Give us a short description of your background"
									error={errors.bio}
								/>
								<div className="mb-3 text-right">
									<button
										type="button"
										className="btn btn-primary btn-sm"
										onClick={() =>
											this.setState({
												showSocialInputs: !this.state.showSocialInputs
											})
										}
									>
										Optional Social Links
									</button>
								</div>
								{socialInputs}
								<input type="submit" className="btn btn-info btn-block mt-4" />
							</form>
						</div>
					</div>
				</div>
			</div>
		);
	}
}

EditProfile.propTypes = {
	auth: PropTypes.object.isRequired,
	errors: PropTypes.object,
	createProfile: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
	auth: state.auth,
	errors: state.errors,
	profile: state.profile
});
export default connect(mapStateToProps, { createProfile, getCurrentProfile })(
	withRouter(EditProfile)
);
