import { MdOutlineClose, MdSearch } from "react-icons/md";

const HeaderFormSearch = () => {
	return (
		<div className="flex items-center w-full max-w-[720px] h-12 bg-[#f0f4f9] rounded-full px-2 ">
			<div className="p-2 rounded-full hover:bg-slate-200 cursor-pointer">
				<MdSearch fontSize="1.5em" color="#5f6368" />
			</div>
			<input
				type="text"
				name=""
				id=""
				placeholder="Search"
				className="placeholder-[#000000]/80 font-light w-full h-full bg-[#f0f4f9] outline-none"
			/>
			<div className="p-2 rounded-full hover:bg-slate-200 cursor-pointer">
				<MdOutlineClose fontSize="1.5em" color="#5f6368" />
			</div>
		</div>
	);
};

export default HeaderFormSearch;
