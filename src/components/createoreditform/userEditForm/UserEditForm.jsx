import { useState, useEffect, useRef } from "react";
import { useWatch } from "react-hook-form";
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
	onDuplicate,
	register,
	control,
	setValue,
	index,
	questionType = "multiplechoice",
}) => {
	const watchedQuestionType = useWatch({
		control,
		name: `items.${index}.questionType`,
		defaultValue: questionType || "multiplechoice",
	});

	const watchedDescription = useWatch({
		control,
		name: `items.${index}.description`,
		defaultValue: "",
	});

	const selectOption = watchedQuestionType || questionType || "multiplechoice";
	const [titleFocused, setTitleFocused] = useState(false);
	const [descFocused, setDescFocused] = useState(false);
	const [showDescription, setShowDescription] = useState(
		Boolean(watchedDescription)
	);

	const titleWrapperRef = useRef(null);
	const descWrapperRef = useRef(null);
	const descInputRef = useRef(null);

	const { ref: registerDescRef, ...descRest } = register
		? register(`items.${index}.description`)
		: { ref: () => {} };

	useEffect(() => {
		if (watchedDescription && !showDescription) {
			setShowDescription(true);
		}
	}, [watchedDescription, showDescription]);

	useEffect(() => {
		if (!activeElement) {
			setTitleFocused(false);
			setDescFocused(false);
		}
	}, [activeElement]);

	useClickOutside(
		titleWrapperRef,
		() => setTitleFocused(false),
		activeElement && titleFocused
	);

	useClickOutside(
		descWrapperRef,
		() => setDescFocused(false),
		activeElement && descFocused
	);

	const handleOptionTypeChange = (newType) => {
		if (setValue) {
			setValue(`items.${index}.questionType`, newType, {
				shouldDirty: true,
			});
		}
	};

	const handleToggleDescription = () => {
		if (showDescription) {
			setShowDescription(false);
			setValue?.(`items.${index}.description`, "", { shouldDirty: true });
			setDescFocused(false);
		} else {
			setShowDescription(true);
			setDescFocused(true);
			setTitleFocused(false);
			setTimeout(() => {
				descInputRef.current?.focus();
				descInputRef.current?.select();
			}, 50);
		}
	};

	return (
		<FormCard activeElement={activeElement}>
			<div className="flex items-center">
				<div
					ref={titleWrapperRef}
					onClick={() => {
						setTitleFocused(true);
						setDescFocused(false);
					}}
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
						onFocus={(e) => {
							setTitleFocused(true);
							setDescFocused(false);
							e.target.select();
						}}
						onClick={() => {
							setTitleFocused(true);
							setDescFocused(false);
						}}
						className={`w-full outline-none text-base bg-transparent ${
							activeElement
								? "py-3 pl-2 hover:bg-slate-200"
								: "py-0 pl-0 cursor-pointer font-normal text-[#202124]"
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

			{/* Question Description (toggled via 3-dots menu) */}
			{(showDescription || (!activeElement && Boolean(watchedDescription))) && (
				<>
					<div
						ref={descWrapperRef}
						onClick={() => {
							setDescFocused(true);
							setTitleFocused(false);
						}}
						className={`w-full mt-2 ${
							activeElement
								? `bg-slate-100 ${
										descFocused
											? "border-[#4C2B87] border-b-[1.5px]"
											: "border-[#9ea0a4] border-b"
								  }`
								: "bg-transparent border-transparent border-b"
						}`}
					>
						<input
							{...descRest}
							ref={(el) => {
								registerDescRef(el);
								descInputRef.current = el;
							}}
							onFocus={(e) => {
								setDescFocused(true);
								setTitleFocused(false);
								e.target.select();
							}}
							onClick={() => {
								setDescFocused(true);
								setTitleFocused(false);
							}}
							className={`w-full outline-none text-sm text-[#5f6368] bg-transparent ${
								activeElement
									? "py-2.5 pl-2 hover:bg-slate-200"
									: "py-0 pl-0 cursor-pointer font-normal"
							}`}
							placeholder="Description"
						/>
					</div>

					{activeElement && descFocused && (
						<TextFormattingIcons forDes={true} />
					)}
				</>
			)}

			{/* options list */}
			<OptionBasedDetails
				selectOption={selectOption}
				activeElement={activeElement}
				control={control}
				register={register}
				setValue={setValue}
				index={index}
				onOptionFocus={() => {
					setTitleFocused(false);
					setDescFocused(false);
				}}
			/>

			{/* bottom hr and toolbar only when active */}
			{activeElement && (
				<>
					<hr className="border-[0.5] border-[#DADCE0] mt-8 mb-2" />
					<BottomIconsContainer
						onDelete={onDelete}
						onDuplicate={onDuplicate}
						register={register}
						index={index}
						hasDescription={showDescription}
						onToggleDescription={handleToggleDescription}
					/>
				</>
			)}
		</FormCard>
	);
};

UserEditForm.propTypes = {
	activeElement: PropTypes.bool,
	onDelete: PropTypes.func,
	onDuplicate: PropTypes.func,
	register: PropTypes.func,
	control: PropTypes.object,
	setValue: PropTypes.func,
	index: PropTypes.number,
	questionType: PropTypes.string,
};

export default UserEditForm;
