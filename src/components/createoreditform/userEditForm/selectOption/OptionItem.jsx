import { useState } from "react";
import PropTypes from "prop-types";
import { MdDragIndicator, MdOutlineClose } from "react-icons/md";

const OptionItem = ({
	icon,
	optionText,
	optIdx,
	totalOptions,
	activeElement,
	isSelected,
	isHover,
	isDragging = false,
	isDropTarget = false,
	dropPosition = "top",
	onMouseEnter,
	onMouseLeave,
	onFocus,
	onBlur,
	onClick,
	onRemove,
	onDragStart,
	onDragOver,
	onDragEnd,
	onDrop,
	register,
	index,
}) => {
	const [canDrag, setCanDrag] = useState(false);

	return (
		<div
			draggable={canDrag}
			onDragStart={(e) => onDragStart?.(e, optIdx)}
			onDragOver={(e) => onDragOver?.(e, optIdx)}
			onDragEnd={(e) => {
				setCanDrag(false);
				onDragEnd?.(e);
			}}
			onDrop={(e) => onDrop?.(e, optIdx)}
			onMouseEnter={onMouseEnter}
			onMouseLeave={onMouseLeave}
			className={`flex items-center relative py-0.5 rounded-md transition-all group ${
				isDragging
					? "opacity-50 bg-white shadow-md border border-gray-200 z-20"
					: ""
			} ${
				isDropTarget
					? dropPosition === "top"
						? "border-t-2 border-[#673ab7]"
						: "border-b-2 border-[#673ab7]"
					: ""
			}`}
		>
			{/* 6-Dots Drag Handle (absolute in left gutter so it never shifts the radio/checkbox icon) */}
			{activeElement && (
				<div
					onMouseDown={() => setCanDrag(true)}
					onMouseUp={() => setCanDrag(false)}
					className="opacity-0 group-hover:opacity-100 cursor-grab active:cursor-grabbing text-gray-400 hover:text-gray-700 transition absolute -left-5 flex items-center justify-center w-5 h-full"
					title="Drag to reorder"
				>
					<MdDragIndicator className="text-xl" />
				</div>
			)}

			{/* Radio or Checkbox Icon */}
			<div className="flex items-center justify-center shrink-0">
				{icon}
			</div>

			{/* Option Text Input */}
			<div
				className={`flex-grow mx-2 ${
					activeElement
						? isSelected
							? "border-[#4C2B87] border-b-[1.5px]"
							: isHover
								? "border-[#DADCE0] border-b"
								: "border-transparent border-b"
						: "border-transparent border-b"
				}`}
			>
				<input
					{...(register
						? register(`items.${index}.options.${optIdx}`)
						: {})}
					onFocus={onFocus}
					onBlur={onBlur}
					onClick={onClick}
					className={`flex-grow outline-none text-sm py-1.5 w-full bg-transparent ${
						!activeElement ? "cursor-pointer" : ""
					}`}
					defaultValue={optionText}
					placeholder={`Option ${optIdx + 1}`}
				/>
			</div>

			{/* Remove Option Button */}
			{activeElement && (
				<div
					className={`p-1.5 rounded-full hover:bg-slate-100 cursor-pointer text-[#5f6368] hover:text-[#202124] transition duration-150 ${
						totalOptions > 1 ? "block" : "invisible"
					}`}
					onClick={onRemove}
					title="Remove option"
				>
					<MdOutlineClose fontSize="1.3em" />
				</div>
			)}
		</div>
	);
};

OptionItem.propTypes = {
	icon: PropTypes.node.isRequired,
	optionText: PropTypes.string.isRequired,
	optIdx: PropTypes.number.isRequired,
	totalOptions: PropTypes.number.isRequired,
	activeElement: PropTypes.bool.isRequired,
	isSelected: PropTypes.bool.isRequired,
	isHover: PropTypes.bool.isRequired,
	isDragging: PropTypes.bool,
	isDropTarget: PropTypes.bool,
	dropPosition: PropTypes.oneOf(["top", "bottom"]),
	onMouseEnter: PropTypes.func.isRequired,
	onMouseLeave: PropTypes.func.isRequired,
	onFocus: PropTypes.func.isRequired,
	onBlur: PropTypes.func.isRequired,
	onClick: PropTypes.func.isRequired,
	onRemove: PropTypes.func.isRequired,
	onDragStart: PropTypes.func,
	onDragOver: PropTypes.func,
	onDragEnd: PropTypes.func,
	onDrop: PropTypes.func,
	register: PropTypes.func,
	index: PropTypes.number.isRequired,
};

export default OptionItem;
