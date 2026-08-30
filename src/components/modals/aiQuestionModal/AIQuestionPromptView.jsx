import PropTypes from "prop-types";
import {
	MdAddCircleOutline,
	MdModeEditOutline,
	MdOutlineAutoAwesome,
} from "react-icons/md";
import {
	ADD_SUGGESTIONS,
	EDIT_QUESTION_SUGGESTIONS,
	EDIT_HEADER_SUGGESTIONS,
} from "./aiQuestionSuggestionsData";

const AIQuestionPromptView = ({
	mode,
	setMode,
	isHeader,
	isQuestion,
	activeTargetTitle,
	prompt,
	setPrompt,
	error,
	setError,
	onGenerate,
}) => {
	const suggestions =
		mode === "add"
			? ADD_SUGGESTIONS
			: isHeader
			? EDIT_HEADER_SUGGESTIONS
			: EDIT_QUESTION_SUGGESTIONS;

	return (
		<div className="flex-1 p-6 overflow-y-auto flex flex-col justify-between">
			<div>
				{/* Full-width Segmented Tabs Control */}
				<div className="w-full grid grid-cols-2 p-1 bg-[#F1F3F4] rounded-xl border border-gray-200 mb-4">
					<button
						type="button"
						onClick={() => setMode("add")}
						className={`w-full flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-xs font-semibold transition-all duration-150 cursor-pointer ${
							mode === "add"
								? "bg-white text-[#673AB7] shadow-xs"
								: "text-[#5F6368] hover:text-[#202124]"
						}`}
					>
						<MdAddCircleOutline className="text-base" />
						<span>Add Question(s)</span>
					</button>

					<button
						type="button"
						onClick={() => setMode("edit")}
						className={`w-full flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-xs font-semibold transition-all duration-150 cursor-pointer ${
							mode === "edit"
								? "bg-white text-[#673AB7] shadow-xs"
								: "text-[#5F6368] hover:text-[#202124]"
						}`}
					>
						<MdModeEditOutline className="text-base" />
						<span>Edit Active Section</span>
					</button>
				</div>

				{/* Active Target Banner in Edit Mode */}
				{mode === "edit" && (
					<div className="bg-[#FAF8FC] border border-[#673AB7]/20 rounded-xl px-3.5 py-2.5 mb-4 text-xs flex items-center gap-2.5 shadow-2xs">
						<span className="font-bold text-[#673AB7] bg-[#EDE7F6] px-2 py-0.5 rounded-md text-[10px] uppercase tracking-wider whitespace-nowrap">
							{isHeader ? "Form Header" : isQuestion ? "Active Question" : "Section"}
						</span>
						<span className="truncate text-[#202124] font-medium flex-1">
							{activeTargetTitle}
						</span>
					</div>
				)}

				<label
					htmlFor="ai-question-prompt"
					className="block text-sm font-semibold text-[#1F1F1F] mb-2"
				>
					{mode === "edit"
						? isHeader
							? "How would you like to refine this title & description?"
							: "How would you like to modify this question?"
						: "What questions would you like to add?"}
				</label>

				<div className="relative">
					<textarea
						id="ai-question-prompt"
						rows={3}
						value={prompt}
						onChange={(e) => {
							setPrompt(e.target.value);
							if (error) setError("");
						}}
						onKeyDown={(e) => {
							if (e.key === "Enter" && !e.shiftKey) {
								e.preventDefault();
								onGenerate();
							}
						}}
						placeholder={
							mode === "edit"
								? isHeader
									? "e.g. Make the title more engaging and add clear submission guidelines..."
									: "e.g. Make it more professional, change to multiple choice, add 4 options..."
								: "e.g. Add 3 questions about delivery feedback (or 'Rate customer service from 1 to 5')..."
						}
						className="w-full text-sm text-[#1F1F1F] placeholder:text-[#747775] p-3.5 rounded-xl border border-gray-200 focus:border-[#673AB7] focus:ring-2 focus:ring-[#673AB7]/20 outline-none resize-none transition leading-relaxed bg-[#F8F9FA] focus:bg-white"
						autoFocus
					/>
				</div>

				{error && (
					<p className="text-xs text-red-600 mt-1.5 font-medium">
						{error}
					</p>
				)}

				{/* Suggestion Chips */}
				<div className="mt-3.5">
					<p className="text-xs font-semibold text-[#5F6368] mb-2 flex items-center gap-1">
						<MdOutlineAutoAwesome className="text-[#673AB7]" />
						<span>
							{mode === "edit" ? "Quick edit suggestions:" : "Ideas to try:"}
						</span>
					</p>
					<div className="flex flex-wrap gap-1.5 max-h-[110px] overflow-y-auto pr-1">
						{suggestions.map((suggestion, idx) => (
							<button
								key={idx}
								type="button"
								onClick={() => {
									setPrompt(suggestion);
									if (error) setError("");
								}}
								className="text-xs px-3 py-1 rounded-full bg-[#F1F3F4] text-[#3C4043] hover:bg-[#EDE7F6] hover:text-[#673AB7] hover:border-[#673AB7]/30 border border-transparent transition cursor-pointer font-medium"
							>
								{suggestion}
							</button>
						))}
					</div>
				</div>
			</div>

			<p className="text-[11px] text-[#747775] text-center mt-3">
				Press{" "}
				<kbd className="px-1.5 py-0.5 bg-gray-100 border border-gray-200 rounded text-[10px] font-sans">
					Enter ↵
				</kbd>{" "}
				to preview with AI
			</p>
		</div>
	);
};

AIQuestionPromptView.propTypes = {
	mode: PropTypes.string.isRequired,
	setMode: PropTypes.func.isRequired,
	isHeader: PropTypes.bool,
	isQuestion: PropTypes.bool,
	activeTargetTitle: PropTypes.string,
	prompt: PropTypes.string.isRequired,
	setPrompt: PropTypes.func.isRequired,
	error: PropTypes.string,
	setError: PropTypes.func.isRequired,
	onGenerate: PropTypes.func.isRequired,
};

export default AIQuestionPromptView;
