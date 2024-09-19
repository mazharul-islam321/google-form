import { MdOutlineClose, MdSearch } from "react-icons/md";

const HeaderFormSearch = () => {
	return (
		<div className="flex items-center w-full max-w-[720px] h-12 bg-[#f0f4f9] rounded-full px-2 ">
			<div className="p-2 rounded-[50%] hover:bg-slate-200 cursor-pointer">
				<MdSearch className="w-6 h-6" color="#444746" />
			</div>
			<input
				type="text"
				name=""
				id=""
				placeholder="Search"
				className="placeholder-[#000000]/80 font-light w-full h-full bg-[#f0f4f9] outline-none"
			/>
			<div className="p-2 rounded-[50%] hover:bg-slate-200 cursor-pointer">
				<MdOutlineClose className="w-6 h-6" color="#444746" />
			</div>
		</div>
	);
};

export default HeaderFormSearch;
