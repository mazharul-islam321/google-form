import PropTypes from "prop-types";
import { useState, useEffect } from "react";
import { MdErrorOutline } from "react-icons/md";
import FormattedText from "../common/FormattedText";
import PreviewTitleCard from "./inputs/PreviewTitleCard";
import PreviewImageCard from "./inputs/PreviewImageCard";
import PreviewRadioQuestion from "./inputs/PreviewRadioQuestion";
import PreviewCheckboxQuestion from "./inputs/PreviewCheckboxQuestion";
import PreviewShortAnswer from "./inputs/PreviewShortAnswer";
import PreviewParagraph from "./inputs/PreviewParagraph";

const PreviewQuestionCard = ({ item, value, onChange, hasError }) => {
	const [localAnswer, setLocalAnswer] = useState("");
	const [localChecked, setLocalChecked] = useState({});
	const [otherRadioText, setOtherRadioText] = useState("");
	const [otherCheckboxText, setOtherCheckboxText] = useState("");

	const isControlled = onChange !== undefined;
	const isTitleCard = item.type === "title";
	const isImageCard = item.type === "image";
	const questionType = item.questionType || "multiplechoice";
	const options =
		item.options && item.options.length > 0 ? item.options : ["Option 1"];

	// Sync controlled value if provided
	useEffect(() => {
		if (isControlled && value !== undefined) {
			if (questionType === "checkbox") {
				const checkedMap = {};
				let otherFound = false;
				if (Array.isArray(value)) {
					value.forEach((v) => {
						if (typeof v === "string" && v.startsWith("Other:")) {
							checkedMap["__OTHER__"] = true;
							setOtherCheckboxText(v.replace("Other:", "").trim());
							otherFound = true;
						} else {
							checkedMap[v] = true;
						}
					});
				}
				if (!otherFound) setOtherCheckboxText("");
				setLocalChecked(checkedMap);
			} else {
				if (typeof value === "string" && value.startsWith("Other:")) {
					setLocalAnswer("__OTHER__");
					setOtherRadioText(value.replace("Other:", "").trim());
				} else {
					setLocalAnswer(value || "");
					setOtherRadioText("");
				}
			}
		}
	}, [value, isControlled, questionType]);

	if (isTitleCard) {
		return (
			<PreviewTitleCard
				title={item.questionTitle || item.title}
				description={item.description}
			/>
		);
	}

	if (isImageCard) {
		return (
			<PreviewImageCard
				title={item.title || item.questionTitle}
				image={item.image}
				alignment={item.imageAlignment || "center"}
				hoverText={item.hoverText}
			/>
		);
	}

	// Radio Actions
	const handleRadioSelect = (opt) => {
		setLocalAnswer(opt);
		onChange?.(opt);
	};

	const handleOtherRadioSelect = () => {
		setLocalAnswer("__OTHER__");
		const fullValue = otherRadioText.trim()
			? `Other: ${otherRadioText.trim()}`
			: "Other";
		onChange?.(fullValue);
	};

	const handleOtherRadioTextChange = (text) => {
		setOtherRadioText(text);
		setLocalAnswer("__OTHER__");
		const fullValue = text.trim() ? `Other: ${text.trim()}` : "Other";
		onChange?.(fullValue);
	};

	const handleRadioClear = () => {
		setLocalAnswer("");
		setOtherRadioText("");
		onChange?.("");
	};

	// Checkbox Actions
	const emitCheckboxChanges = (checkedMap, customOtherText) => {
		if (onChange) {
			const selectedValues = [];
			Object.keys(checkedMap).forEach((k) => {
				if (checkedMap[k]) {
					if (k === "__OTHER__") {
						selectedValues.push(
							customOtherText.trim()
								? `Other: ${customOtherText.trim()}`
								: "Other"
						);
					} else {
						selectedValues.push(k);
					}
				}
			});
			onChange(selectedValues);
		}
	};

	const handleCheckboxToggle = (opt) => {
		const updated = { ...localChecked, [opt]: !localChecked[opt] };
		setLocalChecked(updated);
		emitCheckboxChanges(updated, otherCheckboxText);
	};

	const handleOtherCheckboxToggle = () => {
		const isNowChecked = !localChecked["__OTHER__"];
		const updated = { ...localChecked, ["__OTHER__"]: isNowChecked };
		setLocalChecked(updated);
		emitCheckboxChanges(updated, otherCheckboxText);
	};

	const handleOtherCheckboxTextChange = (text) => {
		setOtherCheckboxText(text);
		const updated = { ...localChecked, ["__OTHER__"]: true };
		setLocalChecked(updated);
		emitCheckboxChanges(updated, text);
	};

	// Text Inputs
	const handleTextChange = (val) => {
		setLocalAnswer(val);
		onChange?.(val);
	};

	return (
		<div
			className={`w-full bg-white rounded-lg border p-6 shadow-sm mb-4 transition duration-150 ${
				hasError ? "border-red-500" : "border-[#dadce0]"
			}`}
		>
			{/* Question Title & Optional Description */}
			<div className="mb-6">
				<p className="text-base font-normal text-[#202124]">
					<FormattedText
						text={item.questionTitle || "Untitled Question"}
					/>
					{item.required && <span className="text-red-500 ml-1">*</span>}
				</p>
				{item.description && (
					<p className="text-sm text-[#5f6368] mt-1.5 whitespace-pre-wrap leading-relaxed">
						<FormattedText text={item.description} />
					</p>
				)}
			</div>

			{/* Question Attached Image */}
			{item.image && (
				<div
					className={`w-full mb-6 flex ${
						item.imageAlignment === "left"
							? "justify-start"
							: item.imageAlignment === "right"
							? "justify-end"
							: "justify-center"
					}`}
				>
					<img
						src={item.image}
						alt={item.questionTitle || "Question visual"}
						className="max-h-[380px] max-w-full rounded-lg object-contain border border-[#DADCE0] shadow-2xs"
					/>
				</div>
			)}

			{/* Multiple Choice (Radio) */}
			{questionType === "multiplechoice" && (
				<PreviewRadioQuestion
					options={options}
					localAnswer={localAnswer}
					otherText={otherRadioText}
					onSelectOption={handleRadioSelect}
					onSelectOther={handleOtherRadioSelect}
					onOtherTextChange={handleOtherRadioTextChange}
					onClear={handleRadioClear}
				/>
			)}

			{/* Checkbox */}
			{questionType === "checkbox" && (
				<PreviewCheckboxQuestion
					options={options}
					checkedMap={localChecked}
					otherText={otherCheckboxText}
					onToggleOption={handleCheckboxToggle}
					onToggleOther={handleOtherCheckboxToggle}
					onOtherTextChange={handleOtherCheckboxTextChange}
				/>
			)}

			{/* Short Answer */}
			{questionType === "shortanswer" && (
				<PreviewShortAnswer
					value={localAnswer}
					onChange={handleTextChange}
				/>
			)}

			{/* Paragraph */}
			{questionType === "paragraph" && (
				<PreviewParagraph
					value={localAnswer}
					onChange={handleTextChange}
				/>
			)}

			{/* Required Error Message */}
			{hasError && (
				<div className="flex items-center gap-1.5 text-red-500 text-xs mt-3">
					<MdErrorOutline fontSize="1.2em" />
					<span>This is a required question</span>
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
		image: PropTypes.string,
		imageAlignment: PropTypes.string,
		hoverText: PropTypes.string,
		required: PropTypes.bool,
	}).isRequired,
	value: PropTypes.any,
	onChange: PropTypes.func,
	hasError: PropTypes.bool,
};

export default PreviewQuestionCard;
