import Dashboard from "../pages/Dashboard";
import FixedOperations from "../pages/FixedOperations";
import KellyCalculator from "../pages/KellyCalculator";
import StyleTest from "../components/StyleTest";
import ProtectedRoute from "../components/ProtectedRoute";
import Navbar from "../components/Navbar";

const PrivateLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="min-h-screen bg-primary">
      <Navbar />
      <main className="pt-16">
        {children}
      </main>
    </div>
  );
};

export const PrivateRoutes = [
	{
		path: "/",
		component: () => (
			<ProtectedRoute>
				<PrivateLayout>
					<Dashboard />
				</PrivateLayout>
			</ProtectedRoute>
		),
	},
	{
		path: "/fixed-operations",
		component: () => (
			<ProtectedRoute>
				<PrivateLayout>
					<FixedOperations />
				</PrivateLayout>
			</ProtectedRoute>
		),
	},
	{
		path: "/kelly-calculator",
		component: () => (
			<ProtectedRoute>
				<PrivateLayout>
					<KellyCalculator />
				</PrivateLayout>
			</ProtectedRoute>
		),
	},
	{
		path: "/style-test",
		component: () => (
			<ProtectedRoute>
				<PrivateLayout>
					<StyleTest />
				</PrivateLayout>
			</ProtectedRoute>
		),
	},
]; 