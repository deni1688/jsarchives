import React, { Component } from "react";

class ProfileHeader extends Component {
	render() {
		const { profile } = this.props;
		return (
			<div className="col-md-12">
				<div className="card card-body blue-gradient text-white mb-3">
					<div className="row">
						<div className="col-4 col-md-3 m-auto">
							<img
								className="rounded-circle"
								src={profile.user.avatar}
								alt=""
							/>
						</div>
					</div>
					<div className="text-center">
						<h1 className="text-center text-white h2 mt-3">
							{profile.user.name}
						</h1>
						<p className="lead text-center">
							{profile.status}@{profile.company ? profile.company : ""}
						</p>
						<p>{profile.location ? profile.location : ""}</p>
						{profile.website ? (
							<a
								href={profile.website}
								className="text-white mx-1"
								target="_blank"
							>
								<i className="fas fa-globe fa-2x" />
							</a>
						) : (
							""
						)}
						{profile.social
							? Object.keys(profile.social).map(link => (
									<a
										href={profile.social[link]}
										className="text-white mx-1"
										target="_blank"
										key={link}
									>
										<i className={`fab fa-${link} fa-2x`} />
									</a>
							  ))
							: ""}
					</div>
				</div>
			</div>
		);
	}
}

export default ProfileHeader;
