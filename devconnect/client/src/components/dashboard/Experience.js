import React, { Component } from "react";
import { connect } from "react-redux";
import { deleteExperience } from "actions/profileActions";
import moment from "moment";
class Experience extends Component {
	handleDelete = expId => {
		this.props.deleteExperience(expId);
	};
	render() {
		const experience = this.props.experience.map(exp => (
			<tr key={exp._id}>
				<td>{exp.company}</td>
				<td>{exp.title}</td>
				<td>
					{moment(exp.from).format("YYYY/MM/DD")} -{" "}
					{exp.current ? "current" : moment(exp.to).format("YYYY/MM/DD")}
				</td>
				<td className="text-right">
					<button
						className="btn btn-danger btn-sm"
						onClick={() => this.handleDelete(exp._id)}
					>
						Delete
					</button>
				</td>
			</tr>
		));
		return (
			<div>
				<h4>Experience</h4>
				<table className="table">
					<thead>
						<tr>
							<th>Company</th>
							<th>Title</th>
							<th>Years</th>
							<th />
						</tr>
					</thead>
					<tbody>{experience}</tbody>
				</table>
			</div>
		);
	}
}

export default connect(null, { deleteExperience })(Experience);
