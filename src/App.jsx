import { createBrowserRouter } from "react-router-dom";
import "./App.css";
import LoginPage from "./pages/LoginPage";
import RegistrationPage from "./pages/RegistrationPage";
import HomePage from "./pages/HomePage";
import CreateOrEditFormPage from "./pages/CreateOrEditFormPage";

// bg-[rgba(0,0,0,0.2)]

const router = createBrowserRouter([
	{
		path: "/",
		element: <HomePage />,
	},
	{
		path: "/createoredit",
		element: <CreateOrEditFormPage />,
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
