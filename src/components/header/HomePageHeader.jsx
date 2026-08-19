import PropTypes from "prop-types";
import Logo from "../logo/Logo";
import HeaderFormSearch from "./HeaderFormSearch";
import Profile from "./Profile";

const HomePageHeader = ({ searchQuery = "", onSearchChange }) => {
	return (
		<header className="flex items-center justify-between px-8 py-2 w-full sticky top-0 bg-white z-40">
			<Logo />

			<HeaderFormSearch
				searchQuery={searchQuery}
				onSearchChange={onSearchChange}
			/>

			<Profile />
		</header>
	);
};

HomePageHeader.propTypes = {
	searchQuery: PropTypes.string,
	onSearchChange: PropTypes.func,
};

export default HomePageHeader;
