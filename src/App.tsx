import RouteManager from "./hooks/RouteManager";
import { ToastProvider } from "./hooks/ToastContext";
import { ThemeProvider } from "./hooks/ThemeContext";

function App() {
	return (
		<ThemeProvider>
			<ToastProvider>
				<RouteManager />
			</ToastProvider>
		</ThemeProvider>
	);
}
export default App;
