import { GET_ERRORS, SET_CURRENT_USER } from "./types";
import axios from "axios";
import setAuthToken from "utils/setAuthToken";
import jwt_decode from "jwt-decode";

// register user action creator
export const registerUser = (userData, history) => dispatch => {
	axios
		.post("/api/users/register", userData)
		.then(res => {
			history.push("/login");
		})
		.catch(err =>
			dispatch({
				type: GET_ERRORS,
				payload: err.response.data
			})
		);
};

// login user action creator
export const loginUser = userData => dispatch => {
	axios
		.post("/api/users/login", userData)
		.then(res => {
			// save jwt to localStorage
			const { token } = res.data;
			localStorage.setItem("jwtToken", token);
			// set token to auth header with util function
			setAuthToken(token);
			// decode token
			const decodedToken = jwt_decode(token);
			// set the user through token payload
			dispatch(setCurrentUser(decodedToken));
		})
		.catch(err =>
			dispatch({
				type: GET_ERRORS,
				payload: err.response.data
			})
		);
};

// Set the logged in user
export const setCurrentUser = decodedToken => {
	return {
		type: SET_CURRENT_USER,
		payload: decodedToken
	};
};

// Logout current user
export const logoutUser = () => dispatch => {
	// remove token
	localStorage.removeItem("jwtToken");
	// remove auth header
	setAuthToken(false);
	// reset current user
	dispatch(setCurrentUser({}));
};
