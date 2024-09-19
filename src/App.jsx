import { createBrowserRouter } from "react-router-dom";
import "./App.css";
import LoginPage from "./pages/LoginPage";
import RegistrationPage from "./pages/RegistrationPage";
import HomePage from "./pages/HomePage";

const router = createBrowserRouter([
	{
		path: "/",
		element: <HomePage />,
	},
	{
		path: "/register",
		element: <RegistrationPage />,
	},
	{
		path: "/login",
		element: <LoginPage />,
	},
]);

export default router;
