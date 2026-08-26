import { useState, useEffect, useRef } from "react";
import PropTypes from "prop-types";
import FormCard from "../common/FormCard";
import TextFormattingIcons from "../TextFormattingIcons";
import TtileDesFormIcons from "../TtileDesFormIcons";
import useClickOutside from "../../../hooks/useClickOutside";

const TitleAndDesForm = ({
	activeElement,
	onDelete,
	onDuplicate,
	register,
	index,
}) => {
	const [selected, setSelected] = useState(null);
	const titleWrapperRef = useRef(null);
	const descWrapperRef = useRef(null);

	useEffect(() => {
		if (!activeElement) {
			setSelected(null);
		}
	}, [activeElement]);

	useClickOutside(
		[titleWrapperRef, descWrapperRef],
		() => setSelected(null),
		activeElement && selected !== null
	);

	return (
		<FormCard activeElement={activeElement}>
			<div className="flex items-center gap-2">
				<div
					ref={titleWrapperRef}
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
						onFocus={(e) => {
							setSelected(0);
							e.target.select();
						}}
						onClick={() => setSelected(0)}
						className={`w-full outline-none text-base bg-transparent ${
							activeElement
								? "py-3 pl-2 hover:bg-slate-200"
								: "py-0 pl-0 cursor-pointer font-normal text-[#202124]"
						}`}
						defaultValue={"Untitled title"}
					/>
				</div>

				{/* copy, delete and three dot icons */}
				{activeElement && (
					<TtileDesFormIcons
						onDelete={onDelete}
						onDuplicate={onDuplicate}
					/>
				)}
			</div>

			{activeElement && selected === 0 && <TextFormattingIcons />}

			<div
				ref={descWrapperRef}
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
					onFocus={(e) => {
						setSelected(1);
						e.target.select();
					}}
					onClick={() => setSelected(1)}
					className={`outline-none text-sm text-[#5f6368] w-full bg-transparent ${
						activeElement ? "pt-3 pl-2" : "pt-1 pl-0 cursor-pointer"
					}`}
					defaultValue={"Description"}
				/>
			</div>

			{activeElement && selected === 1 && (
				<TextFormattingIcons forDes={true} />
			)}
		</FormCard>
	);
};

TitleAndDesForm.propTypes = {
	activeElement: PropTypes.bool,
	onDelete: PropTypes.func,
	onDuplicate: PropTypes.func,
	register: PropTypes.func,
	index: PropTypes.number,
};

export default TitleAndDesForm;
