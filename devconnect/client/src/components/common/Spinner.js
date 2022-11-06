import React from "react";

const Spinner = () => {
	return (
		<span
			style={{ fontSize: "12px", padding: "5px" }}
			className="d-flex align-items-center"
		>
			Loading{" "}
			<img src="/img/loader.svg" alt="Loader" style={{ width: "25px" }} />
		</span>
	);
};

export default Spinner;
