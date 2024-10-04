import DraggingIcon from "../DraggingIcon";
import LeftSideActiveLine from "../LeftSideActiveLine";
import RightSideIconBar from "../RightSideIconBar";
import TextFormattingIcons from "../TextFormattingIcons";
import TtileDesFormIcons from "../TtileDesFormIcons";

const TitleAndDesForm = () => {
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
	);
};

export default TitleAndDesForm;
