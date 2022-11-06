import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import Spinner from "../common/Spinner";
import { getProfiles } from "actions/profileActions";
import ProfileItem from "./ProfileItem";

class Profiles extends Component {
	componentDidMount() {
		this.props.getProfiles();
	}
	render() {
		const { profiles, loading } = this.props.profile;
		let profileItems;
		if (profiles === null || loading) {
			profileItems = <Spinner />;
		} else {
			if (profiles.length) {
				profileItems = profiles.map(profile => (
					<ProfileItem profile={profile} key={profile._id} />
				));
			} else {
				profileItems = <h4>No Profiles media available</h4>;
			}
		}
		return (
			<div className="profiles">
				<div className="container">
					<div className="row">
						<div className="col-12">
							<h1>Devconnect Community</h1>
							<p>Browse and connect with us</p>
							{profileItems}
						</div>
					</div>
				</div>
			</div>
		);
	}
}
Profiles.propTypes = {
	profile: PropTypes.object.isRequired,
	getProfiles: PropTypes.func.isRequired
};
const mapStateToProps = state => ({
	profile: state.profile
});
export default connect(mapStateToProps, { getProfiles })(Profiles);
