import TextFormattingIcons from "./TextFormattingIcons";
import { MdOutlineImage } from "react-icons/md";

import RightSideIconBar from "./RightSideIconBar";
import LeftSideActiveLine from "./LeftSideActiveLine";
import DraggingIcon from "./DraggingIcon";
import BottomIconsContainer from "./BottomIconsContainer";
import TtileDesFormIcons from "./TtileDesFormIcons";
import { useState } from "react";
import SelectOption from "./selectOption/SelectOption";
import OptionBasedDetails from "./selectOption/OptionBasedDetails";

// #4C2B87

const CreateOrEditForm = () => {
	const [selectOption, setSelectOption] = useState("multiplechoice");

	return (
		<main className="w-full h-full flex flex-col items-center pt-28 pb-20 overflow-y-scroll scroll-smooth">
			{/* form card */}

			<div className="relative  w-[780px] rounded-lg bg-white border border-[#DADCE0] shadow">
				<div className="w-full h-[10px] bg-[rgb(103,58,183)] rounded-t-lg absolute" />
				<RightSideIconBar />

				{/* here will be core design */}
				<div className="flex pt-0.5">
					{/* Left Side Active Line */}
					<LeftSideActiveLine />

					<div className="pt-7 pb-5 w-full px-5">
						{/* title */}
						<input
							className="outline-none text-3xl mb-3  w-full"
							defaultValue={"Untitled form"}
						/>
						<div className="h-[1.5px] w-full bg-[#4C2B87]" />
						{/* icons */}
						<TextFormattingIcons />
						{/* description */}
						<input
							className="mt-4 outline-none text-sm text-[#5f6368]"
							defaultValue={"Form description"}
						/>
						<div className="h-px w-full bg-[#DADCE0]" />
						<TextFormattingIcons />
					</div>
				</div>
			</div>

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
								<MdOutlineImage
									fontSize="1.5em"
									color="#5f6368"
								/>
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

			<div className="mt-3 relative w-[780px] rounded-lg bg-white border border-[#c8cbd0] shadow">
				{/* drag and drop grip */}
				<DraggingIcon />

				{/* side bar */}
				<RightSideIconBar />

				<div className="flex">
					{/* Left Side Active Line */}
					<LeftSideActiveLine />

					<div className="pt-6 pb-5 w-full px-5 ">
						<div className="flex items-center gap-2">
							<div className="flex-grow bg-slate-100 border-b-[1.5px] border-[#4C2B87]">
								<input
									className="w-full outline-none text-base py-4 pl-4 bg-transparent "
									defaultValue={"Untitled Question"}
									placeholder="Question"
								/>
							</div>

							{/* copy , delete and three dot */}
							<TtileDesFormIcons />
						</div>
						<TextFormattingIcons />

						<input
							className="mt-4 outline-none text-sm text-[#5f6368]"
							defaultValue={"Form description"}
						/>
						<div className="h-px w-full bg-[#DADCE0]" />
						<TextFormattingIcons />
					</div>
				</div>
			</div>
		</main>
	);
};

export default CreateOrEditForm;
