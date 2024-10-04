/* eslint-disable react/prop-types */
import { MdOutlineImage } from "react-icons/md";
import DraggingIcon from "../DraggingIcon";
import LeftSideActiveLine from "../LeftSideActiveLine";
import RightSideIconBar from "../RightSideIconBar";
import TextFormattingIcons from "../TextFormattingIcons";
import OptionBasedDetails from "./selectOption/OptionBasedDetails";
import BottomIconsContainer from "../BottomIconsContainer";
import SelectOption from "./selectOption/SelectOption";

const UserEditForm = ({ selectOption, setSelectOption }) => {
	return (
		<div className="mt-3 relative w-[780px] rounded-lg bg-white border border-[#c8cbd0] shadow">
			{/* drag and drop grip */}
			<DraggingIcon />

			{/* side bar */}
			<RightSideIconBar />

			<div className="flex">
				{/* Left Side Active Line */}
				<LeftSideActiveLine />

				<div className="pt-6 pb-5 w-full px-5 ">
					<div className="flex items-center">
						<div className="flex-grow bg-slate-100 border-b-[1.5px] border-[#4C2B87]">
							<input
								className="w-full outline-none text-base py-4 pl-4 bg-transparent "
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
					<TextFormattingIcons />

					{/* after select option it will select based result */}
					<OptionBasedDetails selectOption={selectOption} />

					{/* bottom hr line */}
					<hr
						className={`border-[0.5] border-[#DADCE0] mt-10 mb-2`}
					/>

					{/* bottom icons */}
					<BottomIconsContainer />
				</div>
			</div>
		</div>
	);
};

export default UserEditForm;
