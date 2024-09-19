import HomePageHeader from "../components/header/HomePageHeader";
import BlankForm from "../components/home/BlankForm";
import RecentForms from "../components/home/recent-forms/RecentForms";

const HomePage = () => {
	return (
		<>
			<HomePageHeader />

			{/* your home page content */}
			<BlankForm />

			{/* recent forms */}
			<RecentForms />
		</>
	);
};

export default HomePage;
