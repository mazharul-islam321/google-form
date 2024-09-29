import Logo from "../logo/Logo";
import HeaderFormSearch from "./HeaderFormSearch";
import Profile from "./Profile";

// fixed bg-white sticky top-0

const HomePageHeader = () => {
	return (
		<header className="flex items-center justify-between px-8 py-2 w-full sticky top-0  bg-white">
			<Logo />

			<HeaderFormSearch />

			<Profile />
		</header>
	);
};

export default HomePageHeader;
