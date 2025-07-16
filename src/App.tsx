import RouteManager from "./hooks/RouteManager";
import { ToastProvider } from "./hooks/ToastContext";

function App() {
	return (
		<ToastProvider>
			<RouteManager />
		</ToastProvider>
	);
}
export default App;
