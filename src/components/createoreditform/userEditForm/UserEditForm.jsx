import { MdOutlineImage } from "react-icons/md";
import DraggingIcon from "../DraggingIcon";
import LeftSideActiveLine from "../LeftSideActiveLine";
import TextFormattingIcons from "../TextFormattingIcons";
import OptionBasedDetails from "./selectOption/OptionBasedDetails";
import BottomIconsContainer from "../BottomIconsContainer";
import SelectOption from "./selectOption/SelectOption";
import { useState } from "react";
import PropTypes from "prop-types";

const UserEditForm = ({ activeElement, onDelete }) => {
	const [selectOption, setSelectOption] = useState("multiplechoice");
	const [selected, setSelected] = useState(false);
	const [isHover, setIsHover] = useState(false);

	return (
		<div
			onMouseEnter={() => setIsHover(true)}
			onMouseLeave={() => setIsHover(false)}
			className="mt-3 relative w-[780px] rounded-lg bg-white border border-[#c8cbd0] shadow"
		>
			{/* drag and drop grip */}
			{isHover && <DraggingIcon />}

			<div className="flex">
				{/* Left Side Active Line */}
				<LeftSideActiveLine activeElement={activeElement} />

				<div className="pt-6 pb-5 w-full px-5 ">
					<div className="flex items-center">
						<div
							className={`flex-grow bg-slate-100 ${
								selected
									? "border-[#4C2B87] border-b-[1.5px]"
									: "border-[#9ea0a4] border-b"
							}`}
						>
							<input
								onFocus={() => setSelected(true)}
								onBlur={() => setSelected(false)}
								className="w-full outline-none text-base py-4 pl-4 bg-transparent hover:bg-slate-200"
								defaultValue={"Untitled Question"}
								placeholder="Question"
							/>
						</div>

						{/* image icon */}
						<div className="p-3 m-2 rounded-full hover:bg-slate-100 cursor-pointer">
							<MdOutlineImage fontSize="1.5em" color="#5f6368" />
						</div>

						<SelectOption
							selectOption={selectOption}
							setSelectOption={setSelectOption}
						/>
					</div>
					{selected && <TextFormattingIcons />}

					{/* after select option it will select based result */}
					<OptionBasedDetails selectOption={selectOption} />

					{/* bottom hr line */}
					<hr
						className={`border-[0.5] border-[#DADCE0] mt-10 mb-2`}
					/>

					{/* bottom icons */}
					<BottomIconsContainer onDelete={onDelete} />
				</div>
			</div>
		</div>
	);
};

UserEditForm.propTypes = {
	activeElement: PropTypes.bool,
	onDelete: PropTypes.func,
};

export default UserEditForm;
