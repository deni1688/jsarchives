import React, { Component } from "react";
import {
	BrowserRouter as Router,
	Switch,
	Route,
	Redirect
} from "react-router-dom";
import { Provider } from "react-redux";
import { setCurrentUser, logoutUser } from "./actions/authActions";
import { clearProfile } from "./actions/profileActions";
import jwt_decode from "jwt-decode";
import setAuthToken from "./utils/setAuthToken";
import store from "./store";
import "./App.scss";

// components
import Navbar from "components/layout/Navbar";
import Footer from "components/layout/Footer";
import Landing from "components/layout/Landing";
import Login from "components/auth/Login";
import Register from "components/auth/Register";
import Dashboard from "components/dashboard/Dashboard";
import PrivateRoute from "components/common/PrivateRoute";
import CreateProfile from "components/createProfile/CreateProfile";
import EditProfile from "components/editProfile/EditProfile";
import AddExperience from "components/addCreds/AddExperience";
import AddEducation from "components/addCreds/AddEducation";
import Profile from "components/profile/Profile";
import Profiles from "components/profiles/Profiles";
import Posts from "components/posts/Posts";
import PageNotFound from "components/layout/PageNotFound";

// check for token
if (localStorage.jwtToken) {
	// set auth token header
	setAuthToken(localStorage.jwtToken);
	const decodedToken = jwt_decode(localStorage.jwtToken);
	// set user and isAuthentication
	store.dispatch(setCurrentUser(decodedToken));
	// check for expired token
	const currentTime = Date.now() / 1000;
	if (decodedToken.exp < currentTime) {
		store.dispatch(logoutUser);
		store.dispatch(clearProfile);
		// redirect to login
		window.location.href = "/login";
	}
}

class App extends Component {
	render() {
		return (
			<Provider store={store}>
				<Router>
					<div className="App">
						<Navbar />
						<Switch>
							<Route exact path="/" component={Landing} />
							<Route path="/login" component={Login} />
							<Route path="/register" component={Register} />

							<PrivateRoute path="/dashboard" component={Dashboard} />
							<PrivateRoute path="/create-profile" component={CreateProfile} />
							<PrivateRoute path="/edit-profile" component={EditProfile} />
							<PrivateRoute path="/add-experience" component={AddExperience} />
							<PrivateRoute path="/add-education" component={AddEducation} />
							<PrivateRoute path="/feed" component={Posts} />
							<Route path="/profile/:handle" component={Profile} />
							<Route path="/profiles" component={Profiles} />
							<Route path="/404" component={PageNotFound} />
							<Redirect to="/404" />
						</Switch>

						<Footer />
					</div>
				</Router>
			</Provider>
		);
	}
}

export default App;
