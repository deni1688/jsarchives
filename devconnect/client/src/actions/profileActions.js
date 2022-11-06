import {
	GET_PROFILE,
	GET_PROFILES,
	PROFILE_LOADING,
	CLEAR_CURRENT_PROFILE,
	GET_ERRORS
} from "actions/types";
import { logoutUser } from "./authActions";
import axios from "axios";

export const getCurrentProfile = () => dispatch => {
	dispatch(setProfileLoading());
	axios
		.get("/api/profile")
		.then(res => {
			dispatch({
				type: GET_PROFILE,
				payload: res.data
			});
		})
		.catch(err => {
			dispatch({
				type: GET_PROFILE,
				payload: {}
			});
		});
};

export const createProfile = (profileData, history) => dispatch => {
	axios
		.post("/api/profile", profileData)
		.then(res => history.push("/dashboard"))
		.catch(err => {
			dispatch({
				type: GET_ERRORS,
				payload: err.response.data
			});
		});
};

export const addExperience = (expData, history) => dispatch => {
	axios
		.post("/api/profile/experience", expData)
		.then(res => history.push("/dashboard"))
		.catch(err => {
			dispatch({
				type: GET_ERRORS,
				payload: err.response.data
			});
		});
};

export const addEducation = (eduData, history) => dispatch => {
	axios
		.post("/api/profile/education", eduData)
		.then(res => history.push("/dashboard"))
		.catch(err => {
			dispatch({
				type: GET_ERRORS,
				payload: err.response.data
			});
		});
};

export const deleteExperience = (expId, history) => dispatch => {
	axios
		.delete(`/api/profile/experience/${expId}`)
		.then(res =>
			dispatch({
				type: GET_PROFILE,
				payload: res.data
			})
		)
		.catch(err => {
			dispatch({
				type: GET_ERRORS,
				payload: err.response.data
			});
		});
};

export const deleteEducation = (eduId, history) => dispatch => {
	axios
		.delete(`/api/profile/education/${eduId}`)
		.then(res =>
			dispatch({
				type: GET_PROFILE,
				payload: res.data
			})
		)
		.catch(err => {
			dispatch({
				type: GET_ERRORS,
				payload: err.response.data
			});
		});
};

export const getProfiles = () => dispatch => {
	dispatch(setProfileLoading());
	axios
		.get(`/api/profile/all`)
		.then(res =>
			dispatch({
				type: GET_PROFILES,
				payload: res.data
			})
		)
		.catch(err => {
			dispatch({
				type: GET_ERRORS,
				payload: err.response.data
			});
		});
};

export const deleteAccount = () => dispatch => {
	if (prompt("Enter DELETE to confirm. ") === "DELETE") {
		axios
			.delete("/api/profile")
			.then(res => {
				dispatch(logoutUser());
			})
			.catch(err => {
				dispatch({
					type: GET_ERRORS,
					payload: err.response.data
				});
			});
	}
};

export const getProfileByHandle = handle => dispatch => {
	dispatch(setProfileLoading());
	axios
		.get(`/api/profile/handle/${handle}`)
		.then(res =>
			dispatch({
				type: GET_PROFILE,
				payload: res.data
			})
		)
		.catch(err => {
			dispatch({
				type: GET_ERRORS,
				payload: null
			});
		});
};

export const setProfileLoading = () => {
	return {
		type: PROFILE_LOADING
	};
};

export const clearProfile = () => {
	return {
		type: CLEAR_CURRENT_PROFILE
	};
};
