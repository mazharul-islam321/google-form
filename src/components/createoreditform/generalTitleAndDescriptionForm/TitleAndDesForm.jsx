import { useState } from "react";
import DraggingIcon from "../DraggingIcon";
import LeftSideActiveLine from "../LeftSideActiveLine";
import TextFormattingIcons from "../TextFormattingIcons";
import TtileDesFormIcons from "../TtileDesFormIcons";
import PropTypes from "prop-types";

const TitleAndDesForm = ({ activeElement, onDelete }) => {
	const [selected, setSelected] = useState(null);
	const [isHover, setIsHover] = useState(false);

	return (
		<div
			onMouseEnter={() => setIsHover(true)}
			onMouseLeave={() => setIsHover(false)}
			onBlur={() => setSelected(null)}
			className="mt-3 relative w-[780px] rounded-lg bg-white border border-[#c8cbd0] shadow"
		>
			{/* drag and drop grip */}
			{isHover && <DraggingIcon />}

			<div className="flex">
				{/* Left Side Active Line */}
				<LeftSideActiveLine activeElement={activeElement} />

				<div className="pt-6 pb-5 w-full px-5 ">
					<div className="flex items-center gap-2">
						<div
							className={`flex-grow bg-slate-100 ${
								selected === 0
									? "border-[#4C2B87] border-b-[1.5px]"
									: "border-[#9ea0a4] border-b"
							}`}
						>
							<input
								onFocus={() => setSelected(0)}
								className="w-full outline-none text-base py-4 pl-4 bg-transparent hover:bg-slate-200"
								defaultValue={"Untitled Question"}
								placeholder="Question"
							/>
						</div>

						{/* copy , delete and three dot */}
						<TtileDesFormIcons onDelete={onDelete} />
					</div>
					{selected === 0 && <TextFormattingIcons />}

					<div
						className={`w-full ${
							selected === 1
								? "border-[#4C2B87] border-b-[1.5px]"
								: "border-[#DADCE0] border-b"
						}`}
					>
						<input
							onFocus={() => setSelected(1)}
							className="pt-4 outline-none text-sm text-[#5f6368] w-full"
							defaultValue={"Form description"}
						/>
					</div>

					{selected === 1 && <TextFormattingIcons forDes={true} />}
				</div>
			</div>
		</div>
	);
};

TitleAndDesForm.propTypes = {
	activeElement: PropTypes.bool,
	onDelete: PropTypes.func,
};

export default TitleAndDesForm;
