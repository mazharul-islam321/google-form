/* eslint-disable react/prop-types */
import {
	MdOutlineInsertLink,
	MdFormatListBulleted,
	MdFormatListNumbered,
	MdOutlineFormatBold,
	MdOutlineFormatItalic,
	MdOutlineFormatUnderlined,
} from "react-icons/md";

const TextFormattingIcons = ({ forDes }) => {
	return (
		<div className="flex mt-2 gap-3">
			<div className="p-1 rounded-sm hover:bg-slate-100 cursor-pointer">
				<MdOutlineFormatBold fontSize="1.5em" color="#5f6368" />
			</div>

			<div className="p-1 rounded-sm hover:bg-slate-100 cursor-pointer">
				<MdOutlineFormatItalic fontSize="1.5em" color="#5f6368" />
			</div>

			<div className="p-1 rounded-sm hover:bg-slate-100 cursor-pointer">
				<MdOutlineFormatUnderlined fontSize="1.5em" color="#5f6368" />
			</div>
			<div className="p-1 rounded-sm hover:bg-slate-100 cursor-pointer">
				<MdOutlineInsertLink fontSize="1.5em" color="#5f6368" />
			</div>

			{forDes && (
				<>
					<div className="p-1 rounded-sm hover:bg-slate-100 cursor-pointer">
						<MdFormatListNumbered
							fontSize="1.5em"
							color="#5f6368"
						/>
					</div>

					<div className="p-1 rounded-sm hover:bg-slate-100 cursor-pointer">
						<MdFormatListBulleted
							fontSize="1.5em"
							color="#5f6368"
						/>
					</div>
				</>
			)}
		</div>
	);
};

export default TextFormattingIcons;
