import {
	MdAddCircleOutline,
	MdOutlineImage,
	MdOutlineTextFields,
	// MdOutlineViewAgenda,
} from "react-icons/md";

import PropTypes from "prop-types";

const RightSideIconBar = ({ onAddQuestion, onAddTitle }) => {
	return (
		<div className="py-3 px-1 bg-white rounded-md border border-[#DADCE0] shadow">
			<div
				onClick={onAddQuestion}
				className="p-[6px] rounded-full hover:bg-slate-100 cursor-pointer"
			>
				<MdAddCircleOutline fontSize="1.5em" color="#5f6368" />
			</div>

			<div
				onClick={onAddTitle}
				className="p-[6px] rounded-full hover:bg-slate-100 cursor-pointer my-2"
			>
				<MdOutlineTextFields fontSize="1.5em" color="#5f6368" />
			</div>

			<div className="p-[6px] rounded-full hover:bg-slate-100 cursor-pointer">
				<MdOutlineImage fontSize="1.5em" color="#5f6368" />
			</div>

			{/* <div className="p-[6px] rounded-full hover:bg-slate-100 cursor-pointer">
				<MdOutlineViewAgenda fontSize="1.5em" color="#5f6368" />
			</div> */}
		</div>
	);
};

RightSideIconBar.propTypes = {
	onAddQuestion: PropTypes.func.isRequired,
	onAddTitle: PropTypes.func.isRequired,
};

export default RightSideIconBar;
