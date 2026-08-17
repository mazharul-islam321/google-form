import { createBrowserRouter } from "react-router-dom";
import "./App.css";
import LoginPage from "./pages/LoginPage";
import RegistrationPage from "./pages/RegistrationPage";
import HomePage from "./pages/HomePage";
import CreateOrEditFormPage from "./pages/CreateOrEditFormPage";
import NotFoundPage from "./pages/NotFoundPage";

const router = createBrowserRouter([
	{
		path: "/",
		element: <HomePage />,
	},
	{
		path: "/create_or_edit",
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
	{
		path: "*",
		element: <NotFoundPage />,
	},
]);

export default router;
