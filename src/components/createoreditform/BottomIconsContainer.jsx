import { BsThreeDotsVertical } from "react-icons/bs";
import { MdOutlineContentCopy } from "react-icons/md";
import { RiDeleteBin6Line } from "react-icons/ri";
import PropTypes from "prop-types";

const BottomIconsContainer = ({ onDelete, register, index }) => {
	const inputId = `required-toggle-${index ?? 0}`;

	return (
		<div className="flex items-center justify-end gap-2">
			<div className="p-3 rounded-full hover:bg-slate-100 cursor-pointer" title="Duplicate question">
				<MdOutlineContentCopy fontSize="1.5em" color="#5f6368" />
			</div>

			<div
				onClick={onDelete}
				className="p-3 rounded-full hover:bg-slate-100 cursor-pointer"
				title="Delete question"
			>
				<RiDeleteBin6Line fontSize="1.5em" color="#5f6368" />
			</div>

			<div className="h-8 w-[1px] bg-[#DADCE0] mx-3" />

			<div className="relative flex flex-wrap items-center">
				<label
					className="cursor-pointer text-sm pr-3 text-[#202124] select-none"
					htmlFor={inputId}
				>
					Required
				</label>

				<input
					{...(register ? register(`items.${index}.required`) : {})}
					className="peer relative h-4 w-8 cursor-pointer appearance-none rounded-lg bg-gray-300 transition-colors after:absolute after:top-0 after:left-0 after:h-4 after:w-4 after:rounded-full after:bg-white after:shadow after:transition-all checked:bg-[#c9bddf] checked:after:left-4 checked:after:bg-[#4C2B87] focus:outline-none checked:focus:bg-[#c9bddf] checked:after:focus:bg-[#4C2B87] focus-visible:outline-none disabled:cursor-not-allowed disabled:bg-slate-200 disabled:after:bg-slate-300"
					type="checkbox"
					id={inputId}
				/>
			</div>

			<div className="p-3 rounded-full hover:bg-slate-100 cursor-pointer">
				<BsThreeDotsVertical fontSize="1.5em" color="#5f6368" />
			</div>
		</div>
	);
};

BottomIconsContainer.propTypes = {
	onDelete: PropTypes.func,
	register: PropTypes.func,
	index: PropTypes.number,
};

export default BottomIconsContainer;
