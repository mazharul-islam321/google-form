import { LuEye } from "react-icons/lu";
import { GrRedo, GrUndo } from "react-icons/gr";

const HeaderIcons = () => {
	return (
		<div className="flex items-center">
			<div className="p-3 rounded-full hover:bg-slate-100 cursor-pointer">
				<LuEye fontSize="1.5em" color="#5f6368" />
			</div>
			<div className="p-3 rounded-full hover:bg-slate-100 cursor-pointer mx-1">
				<GrUndo color="#5f6368" fontSize="1.5em" />
			</div>
			<div className="p-3 rounded-full hover:bg-slate-100 cursor-pointer">
				<GrRedo color="#5f6368" fontSize="1.5em" />
			</div>
			<button className="py-1.5 px-4 rounded bg-[#673ab7] mx-5 cursor-pointer">
				<span className="text-white">share</span>
			</button>
		</div>
	);
};

export default HeaderIcons;
