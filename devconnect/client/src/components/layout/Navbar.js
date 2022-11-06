import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { logoutUser } from "actions/authActions";
import { clearProfile } from "actions/profileActions";

class Navbar extends Component {
	handleLogoutClick = e => {
		e.preventDefault();
		this.props.logoutUser();
		this.props.clearProfile();
	};
	render() {
		const { isAuthenticated, user } = this.props.auth;
		const authLinks = (
			<ul className="navbar-nav ml-auto">
				<li className="nav-item">
					<a className="nav-link" href="" onClick={this.handleLogoutClick}>
						Logout
					</a>
				</li>
				<li className="nav-item">
					<Link to={`/dashboard`}>
						<img
							style={{
								width: "40px",
								height: "40px",
								borderRadius: "25px"
							}}
							src={user.avatar}
							alt={user.title}
							title="Must have a gravatar connected to email to display your image"
						/>
					</Link>
				</li>
			</ul>
		);
		const guestLinks = (
			<ul className="navbar-nav ml-auto">
				<li className="nav-item">
					<Link className="nav-link" to="/register">
						Register
					</Link>
				</li>
				<li className="nav-item">
					<Link className="nav-link" to="/login">
						Login
					</Link>
				</li>
			</ul>
		);
		return (
			<nav className="navbar navbar-expand-sm navbar-dark bg-dark mb-4">
				<div className="container">
					<Link className="navbar-brand" to="/">
						DevConnect
					</Link>
					<button
						className="navbar-toggler"
						type="button"
						data-toggle="collapse"
						data-target="#mobile-nav"
					>
						<span className="navbar-toggler-icon" />
					</button>

					<div className="collapse navbar-collapse" id="mobile-nav">
						<ul className="navbar-nav mr-auto">
							<li className="nav-item">
								<Link className="nav-link" to="/feed">
									Post Feed
								</Link>
							</li>
							<li className="nav-item">
								<Link className="nav-link" to="/profiles">
									Developers
								</Link>
							</li>
						</ul>
						{isAuthenticated ? authLinks : guestLinks}
					</div>
				</div>
			</nav>
		);
	}
}

Navbar.propTypes = {
	logoutUser: PropTypes.func.isRequired,
	clearProfile: PropTypes.func.isRequired,
	auth: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
	auth: state.auth
});

export default connect(mapStateToProps, { logoutUser, clearProfile })(
	withRouter(Navbar)
);
