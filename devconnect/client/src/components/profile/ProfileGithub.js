import React, { Component } from "react";

class ProfileGithub extends Component {
	state = {
		clientId: "69ed75141efd219a84e7",
		clientSecret: "c0423a7bef84c0787014661dfccbe50a3606d667",
		count: 5,
		sort: "created: asc",
		repos: []
	};
	componentDidMount() {
		const { githubUsername } = this.props;
		const { count, sort, clientId, clientSecret } = this.state;
		fetch(
			`https://api.github.com/users/${githubUsername}/repos?per_page=${count}&sort=${sort}&client_id=${clientId}&clientSecret=${clientSecret}`
		)
			.then(res => res.json())
			.then(data => {
				if (this.refs.github) {
					this.setState({ repos: data });
				}
			})
			.catch(err => console.log(err));
	}
	render() {
		const { repos } = this.state;
		let repoItems;
		if (repos) {
			repoItems = repos.map(repo => (
				<div className="list-group-item" key={repo.id}>
					<div className="row">
						<div className="col-md-6">
							<h4>
								<a href={repo.html_url} target="_blank">
									{repo.name}
								</a>
							</h4>
							<p>{repo.description}</p>
						</div>
						<div className="col-md-6">
							<span className="badge badge-info">
								Stars: {repo.stargazers_count}
							</span>
							<span className="badge badge-warning">
								Watchers: {repo.watchers_count}
							</span>
							<span className="badge badge-success">
								Forks: {repo.forks_count}
							</span>
						</div>
					</div>
				</div>
			));
		}
		return (
			<div className="col-12" ref="github">
				<div className="card card-body">
					<h4 className="text-center">Latest github Repos</h4>
					<div className="list-group">{repoItems}</div>
				</div>
			</div>
		);
	}
}

export default ProfileGithub;
