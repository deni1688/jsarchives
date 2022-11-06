import React, { Component } from "react";

class ProfileAbout extends Component {
	render() {
		const { profile } = this.props;
		const skills = profile.skills.map((skill, i) => (
			<span className="badge badge-info" key={i}>
				<i className="fa fa-check mr-1" />
				{skill}
			</span>
		));
		return (
			<div className="col-md-12">
				<div className="card card-body bg-light mb-3">
					<h3 className="text-center">My Bio</h3>
					<p className="lead">{profile.bio}</p>
					<hr />
					<h3 className="text-center">What I work with</h3>
					<div className="text-center">{profile.skills ? skills : ""}</div>
				</div>
			</div>
		);
	}
}

export default ProfileAbout;
