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
	onMouseEnter,
	onMouseLeave,
	onFocus,
	onBlur,
	onClick,
	onRemove,
	register,
	index,
}) => {
	return (
		<div
			onMouseEnter={onMouseEnter}
			onMouseLeave={onMouseLeave}
			className="flex items-center relative py-0.5"
		>
			{activeElement && isHover && (
				<MdDragIndicator
					fontSize="1.2em"
					color="#c8cbd0"
					className="cursor-move absolute -left-5"
				/>
			)}

			{icon}

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
	onMouseEnter: PropTypes.func.isRequired,
	onMouseLeave: PropTypes.func.isRequired,
	onFocus: PropTypes.func.isRequired,
	onBlur: PropTypes.func.isRequired,
	onClick: PropTypes.func.isRequired,
	onRemove: PropTypes.func.isRequired,
	register: PropTypes.func,
	index: PropTypes.number.isRequired,
};

export default OptionItem;
