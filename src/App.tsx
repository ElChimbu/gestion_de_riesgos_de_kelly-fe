import RouteManager from "./hooks/RouteManager";
import { ToastProvider } from "./hooks/ToastContext";
import { ThemeProvider } from "./hooks/ThemeContext";
import { AuthProvider } from "./hooks/AuthContext";

function App() {
	return (
		<AuthProvider>
			<ThemeProvider>
				<ToastProvider>
					<RouteManager />
				</ToastProvider>
			</ThemeProvider>
		</AuthProvider>
	);
}
export default App;
