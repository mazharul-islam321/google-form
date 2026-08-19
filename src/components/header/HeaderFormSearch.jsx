import PropTypes from "prop-types";
import { MdOutlineClose, MdSearch } from "react-icons/md";

const HeaderFormSearch = ({ searchQuery = "", onSearchChange }) => {
	return (
		<div className="flex items-center w-full max-w-[720px] h-12 bg-[#f0f4f9] rounded-full px-2">
			<div className="p-2 rounded-full hover:bg-slate-200 cursor-pointer">
				<MdSearch fontSize="1.5em" color="#5f6368" />
			</div>

			<input
				type="text"
				value={searchQuery}
				onChange={(e) => onSearchChange?.(e.target.value)}
				placeholder="Search"
				className="placeholder-[#000000]/80 font-light w-full h-full bg-[#f0f4f9] outline-none px-1"
			/>

			{searchQuery.length > 0 && (
				<button
					type="button"
					onClick={() => onSearchChange?.("")}
					className="p-2 rounded-full hover:bg-slate-200 cursor-pointer focus:outline-none transition duration-150"
					title="Clear search"
				>
					<MdOutlineClose fontSize="1.5em" color="#5f6368" />
				</button>
			)}
		</div>
	);
};

HeaderFormSearch.propTypes = {
	searchQuery: PropTypes.string,
	onSearchChange: PropTypes.func,
};

export default HeaderFormSearch;
