import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import {
	MdOutlineAutoAwesome,
	MdClose,
	MdModeEditOutline,
	MdAddCircleOutline,
} from "react-icons/md";
import { AiOutlineLoading3Quarters } from "react-icons/ai";

const ADD_SUGGESTIONS = [
	"Rate overall experience from 1 to 5",
	"Preferred days & times for interview",
	"Years of relevant technical experience",
	"How likely are you to recommend us?",
];

const EDIT_QUESTION_SUGGESTIONS = [
	"Make it more professional & polite",
	"Make it shorter & concise",
	"Generate better options for this question",
	"Add a helpful description",
];

const EDIT_HEADER_SUGGESTIONS = [
	"Make title engaging & professional",
	"Add clear submission guidelines",
	"Make description welcoming & concise",
	"Translate to Spanish / Bengali",
];

const AIQuestionModal = ({
	isOpen,
	onClose,
	onGenerate,
	onUpdate,
	activeContext,
	isLoading,
}) => {
	const [mode, setMode] = useState("add"); // 'add' | 'edit'
	const [prompt, setPrompt] = useState("");

	const isHeader = activeContext?.isHeader === true;
	const isQuestion = activeContext?.type === "question";
	const activeTargetTitle =
		activeContext?.title ||
		activeContext?.questionTitle ||
		"Untitled";

	useEffect(() => {
		if (!isOpen) {
			setPrompt("");
			setMode("add");
		}
	}, [isOpen]);

	if (!isOpen) return null;

	const handleClose = () => {
		if (!isLoading) {
			setPrompt("");
			onClose?.();
		}
	};

	const handleSubmit = async (e) => {
		e?.preventDefault?.();
		if (!prompt.trim() || isLoading) return;

		const currentPrompt = prompt.trim();
		let success = false;

		if (mode === "edit" && onUpdate) {
			success = await onUpdate(currentPrompt);
		} else if (onGenerate) {
			success = await onGenerate(currentPrompt);
		}

		if (success) {
			setPrompt("");
		}
	};

	const handleChipClick = (suggestion) => {
		setPrompt(suggestion);
	};

	const suggestions =
		mode === "add"
			? ADD_SUGGESTIONS
			: isHeader
			? EDIT_HEADER_SUGGESTIONS
			: EDIT_QUESTION_SUGGESTIONS;

	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-200">
			<div className="bg-white rounded-2xl shadow-2xl max-w-[520px] w-full overflow-hidden border border-[#dadce0] animate-in zoom-in-95 duration-200">
				{/* Top Gradient Banner */}
				<div className="bg-gradient-to-r from-[#8E24AA] via-[#673AB7] to-[#1E88E5] px-6 py-4 flex items-center justify-between text-white">
					<div className="flex items-center gap-2.5">
						<div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-xs">
							<MdOutlineAutoAwesome className="text-lg animate-pulse" />
						</div>
						<div>
							<h3 className="font-semibold text-base">
								{mode === "edit"
									? isHeader
										? "Edit Form Header with AI"
										: "Edit Active Question with AI"
									: "Add Question with AI"}
							</h3>
							<p className="text-xs text-white/80">
								{mode === "edit"
									? "Refine, polish, or rewrite your active section"
									: "Powered by Google Gemini"}
							</p>
						</div>
					</div>
					<button
						type="button"
						disabled={isLoading}
						onClick={handleClose}
						className="p-1 rounded-full hover:bg-white/20 transition cursor-pointer text-white/90 hover:text-white disabled:opacity-50"
					>
						<MdClose className="text-xl" />
					</button>
				</div>

				{/* Modal Body */}
				<div className="p-6">
					{/* Full-width Segmented Tabs Control */}
					<div className="w-full grid grid-cols-2 p-1 bg-[#f1f3f4] rounded-xl border border-[#dadce0] mb-4">
						<button
							type="button"
							onClick={() => setMode("add")}
							disabled={isLoading}
							className={`w-full flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-xs font-semibold transition-all duration-150 cursor-pointer ${
								mode === "add"
									? "bg-white text-[#673ab7] shadow-xs"
									: "text-[#5f6368] hover:text-[#202124]"
							}`}
						>
							<MdAddCircleOutline className="text-base" />
							<span>Add Question</span>
						</button>

						<button
							type="button"
							onClick={() => setMode("edit")}
							disabled={isLoading}
							className={`w-full flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-xs font-semibold transition-all duration-150 cursor-pointer ${
								mode === "edit"
									? "bg-white text-[#673ab7] shadow-xs"
									: "text-[#5f6368] hover:text-[#202124]"
							}`}
						>
							<MdModeEditOutline className="text-base" />
							<span>Edit Active Section</span>
						</button>
					</div>

					{/* Active Target Banner in Edit Mode */}
					{mode === "edit" && (
						<div className="bg-[#fafafa] border border-[#dadce0] rounded-xl px-3.5 py-2.5 mb-4 text-xs flex items-center gap-2.5 shadow-2xs">
							<span className="font-bold text-[#673ab7] bg-[#ede7f6] px-2 py-0.5 rounded-md text-[10px] uppercase tracking-wider whitespace-nowrap">
								{isHeader ? "Form Header" : isQuestion ? "Question" : "Section"}
							</span>
							<span className="truncate text-[#202124] font-medium flex-1">
								{activeTargetTitle}
							</span>
						</div>
					)}

					<label
						htmlFor="ai-modal-prompt"
						className="block text-sm font-medium text-[#202124] mb-2"
					>
						{mode === "edit"
							? isHeader
								? "How would you like to refine this title & description?"
								: "How would you like to modify this question?"
							: "What question would you like to add?"}
					</label>
					<div className="relative">
						<input
							id="ai-modal-prompt"
							type="text"
							value={prompt}
							onChange={(e) => setPrompt(e.target.value)}
							onKeyDown={(e) => {
								if (e.key === "Enter") {
									handleSubmit(e);
								}
							}}
							placeholder={
								mode === "edit"
									? isHeader
										? "e.g. Make the title more engaging and add clear guidelines..."
										: "e.g. Make it more professional, change to multiple choice, add options..."
									: "e.g. Rate our customer service quality..."
							}
							disabled={isLoading}
							className="w-full px-4 py-2.5 bg-[#f8f9fa] border border-[#dadce0] rounded-xl text-[#202124] placeholder-[#70757a] focus:outline-none focus:ring-2 focus:ring-[#673ab7]/20 focus:border-[#673ab7] focus:bg-white transition text-sm disabled:opacity-75"
							autoFocus
						/>
					</div>

					{/* Suggestion Chips */}
					<div className="mt-3.5">
						<span className="text-xs text-[#5f6368] font-medium block mb-1.5">
							{mode === "edit"
								? "Quick edit suggestions:"
								: "Ideas to try:"}
						</span>
						<div className="flex flex-wrap gap-1.5">
							{suggestions.map((suggestion, idx) => (
								<button
									key={idx}
									type="button"
									onClick={() => handleChipClick(suggestion)}
									disabled={isLoading}
									className="text-xs px-3 py-1 rounded-full bg-[#f1f3f4] text-[#3c4043] hover:bg-[#ede7f6] hover:text-[#673ab7] hover:border-[#673ab7]/30 border border-transparent transition cursor-pointer font-medium disabled:opacity-50"
								>
									{suggestion}
								</button>
							))}
						</div>
					</div>

					{/* Action Buttons */}
					<div className="flex items-center justify-end gap-2.5 mt-6 pt-4 border-t border-[#f1f3f4]">
						<button
							type="button"
							onClick={handleClose}
							disabled={isLoading}
							className="px-4 py-2 text-sm font-medium text-[#5f6368] hover:text-[#202124] hover:bg-[#f1f3f4] rounded-lg transition cursor-pointer disabled:opacity-50"
						>
							Cancel
						</button>
						<button
							type="button"
							onClick={handleSubmit}
							disabled={!prompt.trim() || isLoading}
							className="flex items-center gap-2 px-5 py-2 text-sm font-medium text-white bg-[#673ab7] hover:bg-[#5a2ea6] rounded-lg transition shadow-xs hover:shadow-md cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
						>
							{isLoading ? (
								<>
									<AiOutlineLoading3Quarters className="animate-spin text-sm" />
									<span>
										{mode === "edit"
											? "Updating section..."
											: "Generating question..."}
									</span>
								</>
							) : (
								<>
									<MdOutlineAutoAwesome className="text-sm" />
									<span>
										{mode === "edit"
											? isHeader
												? "Update Header"
												: "Update Question"
											: "Insert Question"}
									</span>
								</>
							)}
						</button>
					</div>
				</div>
			</div>
		</div>
	);
};

AIQuestionModal.propTypes = {
	isOpen: PropTypes.bool.isRequired,
	onClose: PropTypes.func.isRequired,
	onGenerate: PropTypes.func.isRequired,
	onUpdate: PropTypes.func,
	activeContext: PropTypes.shape({
		isHeader: PropTypes.bool,
		type: PropTypes.string,
		title: PropTypes.string,
		questionTitle: PropTypes.string,
		description: PropTypes.string,
		questionType: PropTypes.string,
		options: PropTypes.array,
	}),
	isLoading: PropTypes.bool,
};

export default AIQuestionModal;
