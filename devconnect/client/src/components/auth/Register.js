import React, { Component } from "react";
import PropTypes from "prop-types";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { registerUser } from "actions/authActions";
import TextFieldGroup from "../common/TextFieldGroup";

class Register extends Component {
	state = {
		name: "",
		email: "",
		password: "",
		password2: "",
		errors: {}
	};
	handleChange = e => {
		this.setState({ [e.target.name]: e.target.value });
	};

	handleSubmit = e => {
		e.preventDefault();
		const newUser = {
			name: this.state.name,
			email: this.state.email,
			password: this.state.password,
			password2: this.state.password2
		};
		this.props.registerUser(newUser, this.props.history);
	};
	// redirect user to dashboard if logged in
	componentDidMount() {
		if (this.props.auth.isAuthenticated) {
			this.props.history.push("/dashboard");
		}
	}
	// if state receives errors update component errors state
	componentWillReceiveProps(nextProps) {
		if (nextProps.errors) {
			this.setState({ errors: nextProps.errors });
		}
	}
	render() {
		const { errors } = this.state;
		return (
			<div className="register">
				<div className="container">
					<div className="row">
						<div className="col-md-8 m-auto">
							<h1 className="display-4 text-center">Sign Up</h1>
							<p className="lead text-center">
								Create your DevConnector account
							</p>
							<form onSubmit={this.handleSubmit} noValidate>
								<TextFieldGroup
									type="name"
									error={errors.name}
									placeholder="Name"
									name="name"
									value={this.state.name}
									onChange={this.handleChange}
								/>
								<TextFieldGroup
									type="email"
									error={errors.email}
									placeholder="Email Address"
									name="email"
									value={this.state.email}
									onChange={this.handleChange}
									info="This site uses Gravatar so if you want a profile image, use
                    a Gravatar email"
								/>
								<TextFieldGroup
									type="password"
									error={errors.password}
									placeholder="Password"
									name="password"
									value={this.state.password}
									onChange={this.handleChange}
								/>
								<TextFieldGroup
									type="password"
									error={errors.password}
									placeholder="Confirm Password"
									name="password2"
									value={this.state.password2}
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
Register.propTypes = {
	registerUser: PropTypes.func.isRequired,
	auth: PropTypes.object.isRequired,
	errors: PropTypes.object.isRequired
};
// getting props from state
const mapStateToProps = state => ({
	auth: state.auth,
	errors: state.errors
});
export default connect(mapStateToProps, { registerUser })(withRouter(Register)); // wrap component withRouter to access router histry
