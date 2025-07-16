import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { PublicRoutes } from "../Routes";
import PageNotFound from "../pages/PageNotFound";

function RouteManager() {
	return (
		<Router>
			<Routes>
				{PublicRoutes.map(({ path, component: Component }) => (
					<Route key={path} path={path} element={<Component />} />
				))}

				<Route path="*" element={<PageNotFound />} />
			</Routes>
		</Router>
	);
}

export default RouteManager;
