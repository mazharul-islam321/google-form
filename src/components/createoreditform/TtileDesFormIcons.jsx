import { BsThreeDotsVertical } from "react-icons/bs";
import { MdOutlineContentCopy } from "react-icons/md";
import { RiDeleteBin6Line } from "react-icons/ri";

const TtileDesFormIcons = () => {
	return (
		<div className="flex items-center gap-2">
			<div className="p-3 rounded-full hover:bg-slate-100 cursor-pointer">
				<MdOutlineContentCopy fontSize="1.5em" color="#5f6368" />
			</div>

			<div className="p-3 rounded-full hover:bg-slate-100 cursor-pointer">
				<RiDeleteBin6Line fontSize="1.5em" color="#5f6368" />
			</div>

			<div className="p-3 rounded-full hover:bg-slate-100 cursor-pointer">
				<BsThreeDotsVertical fontSize="1.5em" color="#5f6368" />
			</div>
		</div>
	);
};

export default TtileDesFormIcons;
