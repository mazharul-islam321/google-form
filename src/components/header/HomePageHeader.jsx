import Logo from "../logo/Logo";
import HeaderFormSearch from "./HeaderFormSearch";
import Profile from "./Profile";

// fixed bg-white

const HomePageHeader = () => {
	return (
		<header className="flex items-center justify-between px-8 py-2 w-full">
			<Logo />

			<HeaderFormSearch />

			<Profile />
		</header>
	);
};

export default HomePageHeader;
