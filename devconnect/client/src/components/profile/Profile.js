import React, { Component } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import ProfileHeader from "./ProfileHeader";
import ProfileAbout from "./ProfileAbout";
import ProfileCreds from "./ProfileCreds";
import ProfileGithub from "./ProfileGithub";
import Spinner from "../common/Spinner";
import { getProfileByHandle } from "actions/profileActions";

class Profile extends Component {
	componentDidMount() {
		if (this.props.match.params.handle) {
			this.props.getProfileByHandle(this.props.match.params.handle);
		}
	}
	componentWillReceiveProps(nextProps) {
		if (nextProps.profile.profile === null && this.props.loading) {
			this.props.history.push("/404");
		}
	}
	render() {
		const { profile, loading } = this.props.profile;
		let profileContent;
		if (profile === null || loading) {
			profileContent = <Spinner />;
		} else {
			profileContent = (
				<div className="row">
					<div className="col-md-6">
						<Link to="/profiles" className="btn btn-info btn-sm mb-3">
							Back to profiles
						</Link>
					</div>
					<ProfileHeader profile={profile} />
					<ProfileAbout profile={profile} />
					<ProfileCreds
						education={profile.education}
						experience={profile.experience}
					/>
					{profile.github ? (
						<ProfileGithub githubUsername={profile.github} />
					) : null}
				</div>
			);
		}
		return (
			<div className="profile">
				<div className="container">
					<div className="col-12">{profileContent}</div>
				</div>
			</div>
		);
	}
}
Profile.propTypes = {
	profile: PropTypes.object.isRequired,
	getProfileByHandle: PropTypes.func.isRequired
};
const mapStateToPorps = state => ({
	profile: state.profile
});
export default connect(mapStateToPorps, { getProfileByHandle })(Profile);
