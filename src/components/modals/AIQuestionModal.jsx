import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { MdOutlineAutoAwesome, MdClose } from "react-icons/md";
import { AiOutlineLoading3Quarters } from "react-icons/ai";

const PROMPT_SUGGESTIONS = [
	"Rate overall experience from 1 to 5",
	"Preferred days & times for interview",
	"Years of relevant technical experience",
	"How likely are you to recommend us?",
];

const AIQuestionModal = ({ isOpen, onClose, onGenerate, isLoading }) => {
	const [prompt, setPrompt] = useState("");

	useEffect(() => {
		if (!isOpen) {
			setPrompt("");
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
		
		const success = await onGenerate(prompt.trim());
		if (success) {
			setPrompt("");
		}
	};

	const handleChipClick = (suggestion) => {
		setPrompt(suggestion);
	};

	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-200">
			<div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden border border-slate-200 animate-in zoom-in-95 duration-200">
				{/* Top Gradient Banner */}
				<div className="bg-gradient-to-r from-[#8E24AA] via-[#673AB7] to-[#1E88E5] px-6 py-4 flex items-center justify-between text-white">
					<div className="flex items-center gap-2">
						<div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-xs">
							<MdOutlineAutoAwesome className="text-lg animate-pulse" />
						</div>
						<div>
							<h3 className="font-semibold text-base">
								Add Question with AI
							</h3>
							<p className="text-xs text-white/80">
								Powered by Google Gemini
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
					<label
						htmlFor="ai-question-prompt"
						className="block text-sm font-medium text-slate-700 mb-2"
					>
						What question would you like to add?
					</label>
					<div className="relative">
						<input
							id="ai-question-prompt"
							type="text"
							value={prompt}
							onChange={(e) => setPrompt(e.target.value)}
							onKeyDown={(e) => {
								if (e.key === "Enter") {
									handleSubmit(e);
								}
							}}
							placeholder="e.g. Rate our customer service quality..."
							disabled={isLoading}
							className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#673ab7] focus:bg-white transition text-sm disabled:opacity-75"
							autoFocus
						/>
					</div>

					{/* Suggestion Chips */}
					<div className="mt-3.5">
						<span className="text-xs text-slate-500 font-medium block mb-1.5">
							Ideas to try:
						</span>
						<div className="flex flex-wrap gap-1.5">
							{PROMPT_SUGGESTIONS.map((suggestion, idx) => (
								<button
									key={idx}
									type="button"
									onClick={() => handleChipClick(suggestion)}
									disabled={isLoading}
									className="text-xs px-2.5 py-1 rounded-full bg-slate-100 text-slate-600 hover:bg-purple-50 hover:text-[#673ab7] hover:border-purple-200 border border-transparent transition cursor-pointer disabled:opacity-50"
								>
									{suggestion}
								</button>
							))}
						</div>
					</div>

					{/* Action Buttons */}
					<div className="flex items-center justify-end gap-2.5 mt-6 pt-4 border-t border-slate-100">
						<button
							type="button"
							onClick={handleClose}
							disabled={isLoading}
							className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition cursor-pointer disabled:opacity-50"
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
									<span>Generating question...</span>
								</>
							) : (
								<>
									<MdOutlineAutoAwesome className="text-sm" />
									<span>Insert Question</span>
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
	isLoading: PropTypes.bool,
};

export default AIQuestionModal;
