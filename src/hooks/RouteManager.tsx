import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { PublicRoutes, PrivateRoutes } from "../Routes";
import PageNotFound from "../pages/PageNotFound";
import AuthRedirect from "../components/AuthRedirect";

function RouteManager() {
	return (
		<Router>
			<AuthRedirect />
			<Routes>
				{PublicRoutes.map(({ path, component: Component }) => (
					<Route key={path} path={path} element={<Component />} />
				))}

				{PrivateRoutes.map(({ path, component: Component }) => (
					<Route key={path} path={path} element={<Component />} />
				))}

				<Route path="*" element={<PageNotFound />} />
			</Routes>
		</Router>
	);
}

export default RouteManager;
