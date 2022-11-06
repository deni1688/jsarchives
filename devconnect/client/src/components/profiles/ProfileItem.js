import React, { Component } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
class ProfileItem extends Component {
	render() {
		const { profile } = this.props;
		const skills = profile.skills.map((skill, i) => (
			<span className="badge badge-dark" key={i}>
				{skill}
			</span>
		));
		return (
			<div className="card card-body bg-light mb-3">
				<div className="row">
					<div className="col-2">
						<img
							className="rounded-circle mb-3 mb-md-0"
							src={profile.user.avatar}
							alt=""
						/>
					</div>
					<div className="col-md-6">
						<h3>{profile.user.name}</h3>
						<p>
							{profile.status}@{profile.company ? profile.company : ""}
						</p>
						<p>{profile.location ? profile.location : ""}</p>
						<Link
							to={`/profile/${profile.handle}`}
							className="btn btn-info btn-sm"
						>
							View Profile
						</Link>
					</div>
					<div className="col-md-4 mt-3 mt-md-0">
						<h4>Skill Set</h4>
						{skills}
					</div>
				</div>
			</div>
		);
	}
}

export default ProfileItem;
