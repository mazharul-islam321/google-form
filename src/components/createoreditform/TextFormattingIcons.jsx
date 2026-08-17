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
		<div
			className="flex mt-2 gap-3 items-center select-none"
			onMouseDown={(e) => e.preventDefault()}
		>
			<div
				className="p-1 rounded-sm hover:bg-slate-100 cursor-pointer"
				title="Bold"
			>
				<MdOutlineFormatBold fontSize="1.5em" color="#5f6368" />
			</div>

			<div
				className="p-1 rounded-sm hover:bg-slate-100 cursor-pointer"
				title="Italic"
			>
				<MdOutlineFormatItalic fontSize="1.5em" color="#5f6368" />
			</div>

			<div
				className="p-1 rounded-sm hover:bg-slate-100 cursor-pointer"
				title="Underline"
			>
				<MdOutlineFormatUnderlined fontSize="1.5em" color="#5f6368" />
			</div>

			<div
				className="p-1 rounded-sm hover:bg-slate-100 cursor-pointer"
				title="Insert link"
			>
				<MdOutlineInsertLink fontSize="1.5em" color="#5f6368" />
			</div>

			{forDes && (
				<>
					<div
						className="p-1 rounded-sm hover:bg-slate-100 cursor-pointer"
						title="Numbered list"
					>
						<MdFormatListNumbered
							fontSize="1.5em"
							color="#5f6368"
						/>
					</div>

					<div
						className="p-1 rounded-sm hover:bg-slate-100 cursor-pointer"
						title="Bulleted list"
					>
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
