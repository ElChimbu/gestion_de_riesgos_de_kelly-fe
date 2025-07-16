import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App";

createRoot(document.getElementById("root")!).render(
	<StrictMode>
		<div
			style={{
				backgroundColor: "#17171B",
				minHeight: "100vh",
				overflowY: "hidden",
			}}>
			<App />
		</div>
	</StrictMode>
);
