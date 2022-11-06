import React, { Component } from "react";
import moment from "moment";

class ProfileCreds extends Component {
	render() {
		const { experience, education } = this.props;
		const expItems = experience.map(exp => (
			<li className="list-group-item" key={exp._id}>
				<h4>{exp.company}</h4>
				<p>
					{moment(exp.from).format("YYYY/MM/DD")} -{" "}
					{exp.to === null ? "Current" : moment(exp.to).format("YYYY/MM/DD")}
				</p>
				<p>Position: {exp.title}</p>
				<p>{exp.location === "" ? null : `Location: ${exp.location}`}</p>
				<p>{exp.desc === "" ? null : `Description: ${exp.desc}`}</p>
			</li>
		));
		const eduItems = education.map(edu => (
			<li className="list-group-item" key={edu._id}>
				<h4>{edu.scool}</h4>
				<p>
					{moment(edu.from).format("YYYY/MM/DD")} -{" "}
					{edu.to === null ? "Current" : moment(edu.to).format("YYYY/MM/DD")}
				</p>
				<p>Degree: {edu.degree}</p>
				<p>Field: {edu.fieldOfStudy}</p>
				<p>{edu.desc === "" ? null : `Description: ${edu.desc}`}</p>
			</li>
		));
		return (
			<div className="col-12">
				<div className="card">
					<div className="card-body">
						<div className="row">
							<div className="col-md-6">
								<h3 className="text-center">Experience</h3>
								{experience.length ? (
									<ul className="list-group">{expItems}</ul>
								) : (
									<p>No experience listed</p>
								)}
							</div>
							<div className="col-md-6">
								<h3 className="text-center">Education</h3>
								{education.length ? (
									<ul className="list-group">{eduItems}</ul>
								) : (
									<p>No education listed</p>
								)}
							</div>
						</div>
					</div>
				</div>
			</div>
		);
	}
}

export default ProfileCreds;
