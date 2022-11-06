import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import classnames from "classnames";
import { Link } from "react-router-dom";
class PostItem extends Component {
	render() {
		const { post, auth, showActions } = this.props;
		return (
			<div className="card card-body mb-3">
				<div className="row">
					<div className="col-md-2">
						<Link to="/feed">
							<img
								className="rounded-circle d-none d-md-block"
								src={post.avatar}
								alt=""
							/>
						</Link>
						<br />
						<p className="text-center">{post.name}</p>
					</div>
					<div className="col-md-10">
						<p className="lead">{post.text}</p>
						<span>
							<button type="button" className="btn btn-light mr-1 btn-sm">
								<i className={"fas fa-thumbs-up"} /> {post.likes.length}
							</button>
							<button type="button" className="btn btn-light mr-1 btn-sm">
								<i className="text-secondary fas fa-thumbs-down" />
							</button>
							<Link
								to={`/post/${post._id}`}
								className="btn btn-info mr-1  btn-sm"
							>
								Comments
							</Link>
							{post.user === auth.user.id ? (
								<button type="button" className="btn btn-danger mr-1 btn-sm">
									<i className="fas fa-times" />
								</button>
							) : null}
						</span>
					</div>
				</div>
			</div>
		);
	}
}
PostItem.propTypes = {
	post: PropTypes.object.isRequired,
	auth: PropTypes.object.isRequired
};
const mapStateToProps = state => ({
	auth: state.auth
});
export default connect(mapStateToProps, {})(PostItem);
