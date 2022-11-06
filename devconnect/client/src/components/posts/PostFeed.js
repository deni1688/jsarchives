import React, { Component } from "react";
import PostItem from "./PostItem";

class PostFeed extends Component {
	render() {
		return this.props.posts.map(post => (
			<PostItem key={post._id} post={post} />
		));
	}
}

export default PostFeed;
