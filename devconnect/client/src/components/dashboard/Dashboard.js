import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { getCurrentProfile, deleteAccount } from "actions/profileActions";
import Spinner from "../common/Spinner";
import ProfileActions from "./ProfileActions";
import { Link } from "react-router-dom";
import Experience from "./Experience";
import Education from "./Education";
class Dashboard extends Component {
	handleDeleteAccount = () => {
		this.props.deleteAccount();
	};
	componentDidMount() {
		this.props.getCurrentProfile();
	}
	render() {
		const { user } = this.props.auth;
		const { profile } = this.props.profile;
		let dashboardContent;
		if (profile === null) {
			dashboardContent = <Spinner />;
		} else {
			if (Object.keys(profile).length > 0) {
				dashboardContent = (
					<div>
						<h4>
							Hello{" "}
							<Link to={`/profile/${profile.handle}`}>{profile.handle} </Link>
						</h4>

						<hr />
						<ProfileActions />
						{profile.experience.length ? (
							<Experience experience={profile.experience} />
						) : (
							""
						)}
						{profile.education.length ? (
							<Education education={profile.education} />
						) : (
							""
						)}
						<div className="mt-5">
							<button
								className="btn btn-danger btn-sm"
								onClick={this.handleDeleteAccount}
							>
								Delete My Account
							</button>
						</div>
					</div>
				);
			} else {
				dashboardContent = (
					<div>
						<h4 className="text-muted">Hello {user.name}</h4>
						<p>You have not made a profile yet. </p>
						<Link to="/create-profile" className="btn btn-info btn-sm">
							Create Profile
						</Link>
					</div>
				);
			}
		}
		return (
			<div className="container">
				<h1>Dashboard</h1>
				{dashboardContent}
			</div>
		);
	}
}
Dashboard.propTypes = {
	getCurrentProfile: PropTypes.func.isRequired,
	deleteAccount: PropTypes.func.isRequired,
	profile: PropTypes.object.isRequired,
	auth: PropTypes.object.isRequired
};
const mapStateToProps = state => ({
	profile: state.profile,
	auth: state.auth
});

export default connect(mapStateToProps, { getCurrentProfile, deleteAccount })(
	Dashboard
);
