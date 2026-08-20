import PropTypes from "prop-types";
import { useState, useRef } from "react";
import {
	MdRadioButtonUnchecked,
	MdRadioButtonChecked,
	MdCheckBoxOutlineBlank,
	MdCheckBox,
} from "react-icons/md";

const PreviewQuestionCard = ({ item }) => {
	const [selectedOption, setSelectedOption] = useState("");
	const [checkedOptions, setCheckedOptions] = useState({});
	const [textAnswer, setTextAnswer] = useState("");
	const textareaRef = useRef(null);

	const isTitleCard = item.type === "title";

	if (isTitleCard) {
		return (
			<div className="w-full bg-white rounded-lg border border-[#dadce0] p-6 shadow-sm mb-4">
				<h3 className="text-xl font-normal text-[#202124] mb-2">
					{item.questionTitle || item.title || "Untitled title"}
				</h3>
				{item.description && (
					<p className="text-sm text-[#5f6368] whitespace-pre-wrap leading-relaxed">
						{item.description}
					</p>
				)}
			</div>
		);
	}

	const handleCheckboxChange = (opt) => {
		setCheckedOptions((prev) => ({
			...prev,
			[opt]: !prev[opt],
		}));
	};

	const handleTextareaInput = (e) => {
		setTextAnswer(e.target.value);
		if (textareaRef.current) {
			textareaRef.current.style.height = "auto";
			textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
		}
	};

	const questionType = item.questionType || "multiplechoice";
	const isCheckboxType = questionType === "checkbox";
	const options = item.options && item.options.length > 0 ? item.options : ["Option 1"];

	return (
		<div className="w-full bg-white rounded-lg border border-[#dadce0] p-6 shadow-sm mb-4 transition duration-150">
			{/* Question Title */}
			<div className="mb-6">
				<p className="text-base font-normal text-[#202124]">
					{item.questionTitle || "Untitled Question"}
					{item.required && <span className="text-red-500 ml-1">*</span>}
				</p>
			</div>

			{/* Multiple Choice (Radio) */}
			{questionType === "multiplechoice" && (
				<div className="flex flex-col gap-4 pl-1">
					{options.map((option, optIdx) => {
						const isSelected = selectedOption === option;
						return (
							<label
								key={optIdx}
								className="flex items-center gap-3.5 cursor-pointer group"
								onClick={() => setSelectedOption(option)}
							>
								<div className="flex-shrink-0 transition duration-150">
									{isSelected ? (
										<MdRadioButtonChecked
											fontSize="1.45em"
											className="text-[#673ab7]"
										/>
									) : (
										<MdRadioButtonUnchecked
											fontSize="1.45em"
											className="text-[#5f6368] group-hover:text-[#202124]"
										/>
									)}
								</div>
								<span className="text-sm md:text-base text-[#202124] group-hover:text-black select-none">
									{option}
								</span>
							</label>
						);
					})}

					{/* Clear Selection Button (only appears when an option is selected) */}
					{selectedOption && (
						<div className="flex justify-end pt-1">
							<button
								type="button"
								onClick={(e) => {
									e.preventDefault();
									e.stopPropagation();
									setSelectedOption("");
								}}
								className="text-xs font-medium text-[#5f6368] hover:text-[#202124] hover:bg-slate-100 px-2.5 py-1.5 rounded transition duration-150 focus:outline-none cursor-pointer"
							>
								Clear selection
							</button>
						</div>
					)}
				</div>
			)}

			{/* Checkbox */}
			{isCheckboxType && (
				<div className="flex flex-col gap-4 pl-1">
					{options.map((option, optIdx) => {
						const isChecked = Boolean(checkedOptions[option]);
						return (
							<label
								key={optIdx}
								className="flex items-center gap-3.5 cursor-pointer group"
								onClick={() => handleCheckboxChange(option)}
							>
								<div className="flex-shrink-0 transition duration-150">
									{isChecked ? (
										<MdCheckBox
											fontSize="1.45em"
											className="text-[#673ab7]"
										/>
									) : (
										<MdCheckBoxOutlineBlank
											fontSize="1.45em"
											className="text-[#5f6368] group-hover:text-[#202124]"
										/>
									)}
								</div>
								<span className="text-sm md:text-base text-[#202124] group-hover:text-black select-none">
									{option}
								</span>
							</label>
						);
					})}
				</div>
			)}

			{/* Short Answer (50% width underline) */}
			{questionType === "shortanswer" && (
				<div className="w-1/2 min-w-[260px] max-w-sm">
					<input
						type="text"
						maxLength={500}
						value={textAnswer}
						onChange={(e) => setTextAnswer(e.target.value)}
						placeholder="Your answer"
						className="w-full border-b border-[#dadce0] focus:border-b-2 focus:border-[#673ab7] outline-none text-sm text-[#202124] placeholder-[#70757a] pb-1.5 bg-transparent transition-colors duration-150"
					/>
				</div>
			)}

			{/* Paragraph / Long Answer (Full width 100% underline with auto-grow) */}
			{questionType === "paragraph" && (
				<div className="w-full">
					<textarea
						ref={textareaRef}
						rows={1}
						maxLength={2000}
						value={textAnswer}
						onChange={handleTextareaInput}
						placeholder="Your answer"
						className="w-full border-b border-[#dadce0] focus:border-b-2 focus:border-[#673ab7] outline-none text-sm text-[#202124] placeholder-[#70757a] pb-1.5 bg-transparent resize-none overflow-hidden transition-colors duration-150"
					/>
				</div>
			)}
		</div>
	);
};

PreviewQuestionCard.propTypes = {
	item: PropTypes.shape({
		type: PropTypes.string,
		questionTitle: PropTypes.string,
		title: PropTypes.string,
		questionType: PropTypes.string,
		options: PropTypes.arrayOf(PropTypes.string),
		description: PropTypes.string,
		required: PropTypes.bool,
	}).isRequired,
};

export default PreviewQuestionCard;
