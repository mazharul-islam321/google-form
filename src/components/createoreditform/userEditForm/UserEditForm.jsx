import { useState, useEffect, useRef } from "react";
import { MdOutlineImage } from "react-icons/md";
import PropTypes from "prop-types";
import FormCard from "../common/FormCard";
import TextFormattingIcons from "../TextFormattingIcons";
import OptionBasedDetails from "./selectOption/OptionBasedDetails";
import BottomIconsContainer from "../BottomIconsContainer";
import SelectOption from "./selectOption/SelectOption";
import useClickOutside from "../../../hooks/useClickOutside";

const UserEditForm = ({
	activeElement,
	onDelete,
	register,
	control,
	setValue,
	index,
}) => {
	const [selectOption, setSelectOption] = useState("multiplechoice");
	const [titleFocused, setTitleFocused] = useState(false);
	const titleWrapperRef = useRef(null);

	useEffect(() => {
		if (!activeElement) {
			setTitleFocused(false);
		}
	}, [activeElement]);

	useClickOutside(
		titleWrapperRef,
		() => setTitleFocused(false),
		activeElement && titleFocused
	);

	const handleOptionTypeChange = (newType) => {
		setSelectOption(newType);
		if (setValue) {
			setValue(`items.${index}.questionType`, newType, {
				shouldDirty: true,
			});
		}
	};

	return (
		<FormCard activeElement={activeElement} className="mt-3">
			<div className="flex items-center">
				<div
					ref={titleWrapperRef}
					onClick={() => setTitleFocused(true)}
					className={`flex-grow ${
						activeElement
							? `bg-slate-100 ${
									titleFocused
										? "border-[#4C2B87] border-b-[1.5px]"
										: "border-[#9ea0a4] border-b"
							  }`
							: "bg-transparent border-transparent border-b"
					}`}
				>
					<input
						{...register(`items.${index}.questionTitle`)}
						onFocus={() => setTitleFocused(true)}
						onClick={() => setTitleFocused(true)}
						className={`w-full outline-none text-base py-3 pl-2 bg-transparent ${
							activeElement
								? "hover:bg-slate-200"
								: "cursor-pointer font-normal text-gray-900"
						}`}
						defaultValue={"Untitled Question"}
						placeholder="Question"
					/>
				</div>

				{/* image icon */}
				{activeElement && (
					<div className="p-3 m-2 rounded-full hover:bg-slate-100 cursor-pointer">
						<MdOutlineImage fontSize="1.5em" color="#5f6368" />
					</div>
				)}

				{/* type selector */}
				{activeElement && (
					<SelectOption
						selectOption={selectOption}
						setSelectOption={handleOptionTypeChange}
					/>
				)}
			</div>

			{activeElement && titleFocused && <TextFormattingIcons />}

			{/* options list */}
			<OptionBasedDetails
				selectOption={selectOption}
				activeElement={activeElement}
				control={control}
				register={register}
				setValue={setValue}
				index={index}
				onOptionFocus={() => setTitleFocused(false)}
			/>

			{/* bottom hr and toolbar only when active */}
			{activeElement && (
				<>
					<hr className="border-[0.5] border-[#DADCE0] mt-8 mb-2" />
					<BottomIconsContainer onDelete={onDelete} />
				</>
			)}
		</FormCard>
	);
};

UserEditForm.propTypes = {
	activeElement: PropTypes.bool,
	onDelete: PropTypes.func,
	register: PropTypes.func,
	control: PropTypes.object,
	setValue: PropTypes.func,
	index: PropTypes.number,
};

export default UserEditForm;
