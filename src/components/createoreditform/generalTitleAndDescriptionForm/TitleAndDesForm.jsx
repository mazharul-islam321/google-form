import { useState, useEffect } from "react";
import DraggingIcon from "../DraggingIcon";
import LeftSideActiveLine from "../LeftSideActiveLine";
import TextFormattingIcons from "../TextFormattingIcons";
import TtileDesFormIcons from "../TtileDesFormIcons";
import PropTypes from "prop-types";

const TitleAndDesForm = ({ activeElement, onDelete, register, index }) => {
	const [selected, setSelected] = useState(0);
	const [isHover, setIsHover] = useState(false);

	useEffect(() => {
		if (!activeElement) {
			setSelected(null);
		} else if (selected === null) {
			setSelected(0);
		}
	}, [activeElement]);

	return (
		<div
			onMouseEnter={() => setIsHover(true)}
			onMouseLeave={() => setIsHover(false)}
			className={`mt-3 relative w-[780px] rounded-lg bg-white border ${
				activeElement
					? "border-[#c8cbd0] shadow-md"
					: "border-[#e0e0e0] shadow-xs"
			} transition-all duration-150`}
		>
			{/* drag and drop grip */}
			{isHover && <DraggingIcon />}

			<div className="flex">
				{/* Left Side Active Line */}
				<LeftSideActiveLine activeElement={activeElement} />

				<div className="pt-6 pb-5 w-full px-5">
					<div className="flex items-center gap-2">
						<div
							onClick={() => setSelected(0)}
							className={`flex-grow ${
								activeElement
									? `bg-slate-100 ${
											selected === 0
												? "border-[#4C2B87] border-b-[1.5px]"
												: "border-[#9ea0a4] border-b"
										}`
									: "bg-transparent border-transparent border-b"
							}`}
						>
							<input
								{...register(`items.${index}.questionTitle`)}
								onFocus={() => setSelected(0)}
								onClick={() => setSelected(0)}
								className={`w-full outline-none text-base py-3 pl-2 bg-transparent ${
									activeElement
										? "hover:bg-slate-200"
										: "cursor-pointer font-normal text-gray-900"
								}`}
								defaultValue={"Untitled title"}
							/>
						</div>

						{/* copy, delete and three dot icons */}
						{activeElement && (
							<TtileDesFormIcons onDelete={onDelete} />
						)}
					</div>

					{activeElement && selected === 0 && <TextFormattingIcons />}

					<div
						onClick={() => setSelected(1)}
						className={`w-full mt-2 ${
							activeElement
								? selected === 1
									? "border-[#4C2B87] border-b-[1.5px]"
									: "border-[#DADCE0] border-b"
								: "border-transparent border-b"
						}`}
					>
						<input
							{...register(`items.${index}.description`)}
							onFocus={() => setSelected(1)}
							onClick={() => setSelected(1)}
							className={`pt-3 outline-none text-sm text-[#5f6368] w-full bg-transparent ${
								!activeElement ? "cursor-pointer" : ""
							}`}
							defaultValue={"Description"}
						/>
					</div>

					{activeElement && selected === 1 && (
						<TextFormattingIcons forDes={true} />
					)}
				</div>
			</div>
		</div>
	);
};

TitleAndDesForm.propTypes = {
	activeElement: PropTypes.bool,
	onDelete: PropTypes.func,
	register: PropTypes.func,
	index: PropTypes.number,
};

export default TitleAndDesForm;
