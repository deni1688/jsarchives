import React, { Component } from "react";
import { connect } from "react-redux";
import { deleteEducation } from "actions/profileActions";
import moment from "moment";
class Education extends Component {
	handleDelete = eduId => {
		this.props.deleteEducation(eduId);
	};
	render() {
		const education = this.props.education.map(edu => (
			<tr key={edu._id}>
				<td>{edu.school}</td>
				<td>{edu.degree}</td>
				<td>{edu.fieldOfStudy}</td>
				<td>
					{moment(edu.from).format("YYYY/MM/DD")} -{" "}
					{edu.to === null ? "current" : moment(edu.to).format("YYYY/MM/DD")}
				</td>
				<td className="text-right">
					<button
						className="btn btn-danger btn-sm"
						onClick={() => this.handleDelete(edu._id)}
					>
						Delete
					</button>
				</td>
			</tr>
		));
		return (
			<div>
				<h4>Education</h4>
				<table className="table">
					<thead>
						<tr>
							<th>School</th>
							<th>Degree</th>
							<th>Field</th>
							<th>Years</th>
							<th />
						</tr>
					</thead>
					<tbody>{education}</tbody>
				</table>
			</div>
		);
	}
}

export default connect(null, { deleteEducation })(Education);
