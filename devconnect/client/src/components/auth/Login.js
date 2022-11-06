import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { loginUser } from "actions/authActions";
import TextFieldGroup from "../common/TextFieldGroup";

class Login extends Component {
	state = {
		email: "",
		password: "",
		errors: {}
	};
	handleChange = e => {
		this.setState({ [e.target.name]: e.target.value });
	};

	handleSubmit = e => {
		e.preventDefault();
		const user = {
			email: this.state.email,
			password: this.state.password
		};
		this.props.loginUser(user);
	};
	// redirect user to dashboard if logged in
	componentDidMount() {
		if (this.props.auth.isAuthenticated) {
			this.props.history.push("/dashboard");
		}
	}
	// if state receives errors update component errors state
	componentWillReceiveProps(nextProps) {
		if (nextProps.auth.isAuthenticated) {
			this.props.history.push("/dashboard");
		}

		if (nextProps.errors) {
			this.setState({ errors: nextProps.errors });
		}
	}
	render() {
		const { errors } = this.state;
		return (
			<div className="login">
				<div className="container">
					<div className="row">
						<div className="col-md-8 m-auto">
							<h1 className="display-4 text-center">Log In</h1>
							<p className="lead text-center">
								Sign in to your DevConnector account
							</p>
							<form onSubmit={this.handleSubmit}>
								<TextFieldGroup
									type="email"
									error={errors.email}
									placeholder="Email Address"
									name="email"
									value={this.state.email}
									onChange={this.handleChange}
								/>
								<TextFieldGroup
									type="password"
									error={errors.password}
									placeholder="Password"
									name="password"
									value={this.state.password}
									onChange={this.handleChange}
								/>
								<input type="submit" className="btn btn-info btn-block mt-4" />
							</form>
						</div>
					</div>
				</div>
			</div>
		);
	}
}

// declare prop types
Login.propTypes = {
	loginUser: PropTypes.func.isRequired,
	auth: PropTypes.object.isRequired,
	errors: PropTypes.object.isRequired
};

// getting props from state
const mapStateToProps = state => ({
	auth: state.auth,
	errors: state.errors
});
export default connect(mapStateToProps, { loginUser })(Login);
