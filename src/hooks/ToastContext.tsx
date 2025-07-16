import React, { useEffect, useState } from "react";
import { ToastContext } from ".";

interface ToastPrivderProps {
	children: React.ReactNode;
}

export const ToastProvider: React.FC<ToastPrivderProps> = ({ children }) => {
	const [toastType, setToastType] = useState<string>("");

	useEffect(() => {
		if (toastType !== "") {
			const timeout = setTimeout(() => {
				setToastType("");
			}, 5000);
			return () => clearTimeout(timeout);
		}
	}, [toastType]);

	return (
		<ToastContext.Provider value={{ toastType, setToastType }}>
			{children}
		</ToastContext.Provider>
	);
};
