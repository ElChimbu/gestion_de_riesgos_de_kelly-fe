import React from "react";
import { useNavigate } from "react-router-dom";

const PageNotFound = () => {
	const navigate = useNavigate();

	const handleGoHome = () => {
		navigate("/");
	};

	return (
		<div className="flex flex-col items-center justify-center">
			No encontrado, no rompas los huevos
		</div>
	);
};

export default PageNotFound;
