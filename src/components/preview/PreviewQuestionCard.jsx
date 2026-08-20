import PropTypes from "prop-types";
import { useState } from "react";

const PreviewQuestionCard = ({ item, index }) => {
	const [selectedOption, setSelectedOption] = useState("");
	const [checkedOptions, setCheckedOptions] = useState({});
	const [textAnswer, setTextAnswer] = useState("");

	const isTitleCard = item.type === "title";

	if (isTitleCard) {
		return (
			<div className="w-full bg-white rounded-lg border border-[#dadce0] p-6 shadow-sm mb-4">
				<h3 className="text-xl font-normal text-[#202124] mb-2">
					{item.questionTitle || item.title || "Untitled title"}
				</h3>
				{item.description && (
					<p className="text-sm text-[#5f6368] whitespace-pre-wrap">
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

	const questionType = item.questionType || "multiplechoice";
	const options = item.options && item.options.length > 0 ? item.options : ["Option 1"];

	return (
		<div className="w-full bg-white rounded-lg border border-[#dadce0] p-6 shadow-sm mb-4 transition duration-150 hover:shadow-md">
			{/* Question Title */}
			<div className="mb-4">
				<p className="text-base font-normal text-[#202124]">
					{item.questionTitle || "Untitled Question"}
					{item.required && <span className="text-red-500 ml-1">*</span>}
				</p>
			</div>

			{/* Question Inputs */}
			{questionType === "multiplechoice" && (
				<div className="flex flex-col gap-3">
					{options.map((option, optIdx) => (
						<label
							key={optIdx}
							className="flex items-center gap-3 cursor-pointer group"
						>
							<input
								type="radio"
								name={`preview_q_${index}`}
								value={option}
								checked={selectedOption === option}
								onChange={() => setSelectedOption(option)}
								className="w-4 h-4 text-[#673ab7] focus:ring-[#673ab7] cursor-pointer"
							/>
							<span className="text-sm text-[#202124] group-hover:text-black">
								{option}
							</span>
						</label>
					))}
				</div>
			)}

			{questionType === "checkbox" && (
				<div className="flex flex-col gap-3">
					{options.map((option, optIdx) => (
						<label
							key={optIdx}
							className="flex items-center gap-3 cursor-pointer group"
						>
							<input
								type="checkbox"
								checked={Boolean(checkedOptions[option])}
								onChange={() => handleCheckboxChange(option)}
								className="w-4 h-4 rounded text-[#673ab7] focus:ring-[#673ab7] cursor-pointer"
							/>
							<span className="text-sm text-[#202124] group-hover:text-black">
								{option}
							</span>
						</label>
					))}
				</div>
			)}

			{questionType === "shortanswer" && (
				<div className="mt-2">
					<input
						type="text"
						value={textAnswer}
						onChange={(e) => setTextAnswer(e.target.value)}
						placeholder="Your answer"
						className="w-full max-w-sm border-b border-gray-300 focus:border-[#673ab7] outline-none text-sm text-[#202124] pb-1 bg-transparent transition duration-150"
					/>
				</div>
			)}

			{questionType === "paragraph" && (
				<div className="mt-2">
					<textarea
						rows={2}
						value={textAnswer}
						onChange={(e) => setTextAnswer(e.target.value)}
						placeholder="Your answer"
						className="w-full border-b border-gray-300 focus:border-[#673ab7] outline-none text-sm text-[#202124] pb-1 bg-transparent resize-none transition duration-150"
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
	index: PropTypes.number.isRequired,
};

export default PreviewQuestionCard;
