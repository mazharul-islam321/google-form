import { useState, useEffect, useRef } from "react";
import PropTypes from "prop-types";
import FormCard from "../common/FormCard";
import TextFormattingIcons from "../TextFormattingIcons";
import useClickOutside from "../../../hooks/useClickOutside";

const MainTitleAndDesForm = ({ activeElement, register }) => {
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
		<FormCard
			activeElement={activeElement}
			isDraggable={false}
			hasTopColorBar={true}
		>
			{/* title */}
			<div
				ref={titleWrapperRef}
				onClick={() => setSelected(0)}
				className={`w-full ${
					activeElement
						? selected === 0
							? "border-[#4C2B87] border-b-[1.5px]"
							: "border-[#DADCE0] border-b"
						: "border-transparent border-b"
				}`}
			>
				<input
					{...register("title")}
					onFocus={() => setSelected(0)}
					onClick={() => setSelected(0)}
					className={`outline-none text-3xl pb-2 w-full bg-transparent font-normal ${
						!activeElement ? "cursor-pointer" : ""
					}`}
					defaultValue={"Untitled form"}
				/>
			</div>

			{activeElement && selected === 0 && (
				<TextFormattingIcons forDes={false} />
			)}

			{/* description */}
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
					{...register("description")}
					onFocus={() => setSelected(1)}
					onClick={() => setSelected(1)}
					className={`pt-3 outline-none text-sm text-[#5f6368] w-full bg-transparent ${
						!activeElement ? "cursor-pointer" : ""
					}`}
					defaultValue={"Form description"}
				/>
			</div>

			{activeElement && selected === 1 && (
				<TextFormattingIcons forDes={true} />
			)}
		</FormCard>
	);
};

MainTitleAndDesForm.propTypes = {
	activeElement: PropTypes.bool,
	register: PropTypes.func,
};

export default MainTitleAndDesForm;
