import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { MdOutlineAutoAwesome, MdClose } from "react-icons/md";
import { useGenerateFormWithAIMutation } from "../../redux/api/formApi";

const SUGGESTIONS = [
	{
		label: "💼 Job Application",
		prompt: "Job application form for Software Engineer with skills, experience, and contact info",
	},
	{
		label: "⭐ Customer Feedback",
		prompt: "Customer satisfaction and feedback survey with rating scales and suggestions",
	},
	{
		label: "🍕 Event RSVP",
		prompt: "Event RSVP and registration form with guest counts and dietary preferences",
	},
	{
		label: "🎓 Assessment Quiz",
		prompt: "5-question multiple choice knowledge quiz on web development and computer science",
	},
];

const AIPromptModal = ({ isOpen, onClose, onSuccess }) => {
	const [prompt, setPrompt] = useState("");
	const [error, setError] = useState("");
	const [generateFormWithAI, { isLoading }] = useGenerateFormWithAIMutation();

	useEffect(() => {
		if (isOpen) {
			setPrompt("");
			setError("");
		}
	}, [isOpen]);

	if (!isOpen) return null;

	const handleClose = () => {
		setPrompt("");
		setError("");
		onClose?.();
	};

	const handleGenerate = async (promptToUse = prompt) => {
		const cleanPrompt = (promptToUse || "").trim();
		if (!cleanPrompt) {
			setError("Please enter a description for your form.");
			return;
		}

		setError("");
		try {
			const res = await generateFormWithAI({ prompt: cleanPrompt }).unwrap();
			const formData = res?.data || res;
			setPrompt("");
			setError("");
			onSuccess?.(formData);
			onClose?.();
		} catch (err) {
			console.error("AI Form Generation failed:", err);
			setError(
				err?.data?.message ||
					"Failed to generate form. Please try a different prompt."
			);
		}
	};

	const handleChipClick = (suggestionPrompt) => {
		setPrompt(suggestionPrompt);
		handleGenerate(suggestionPrompt);
	};

	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs px-4 animate-fade-in">
			<div className="bg-white rounded-2xl shadow-2xl w-full max-w-[580px] overflow-hidden border border-[#E0E2EC] transition-all transform animate-scale-up">
				{/* Modal Header with Gemini styling */}
				<div className="flex items-center justify-between px-6 pt-6 pb-2">
					<div className="flex items-center gap-2.5">
						<div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#8E24AA] via-[#673AB7] to-[#1E88E5] flex items-center justify-center shadow-xs">
							<MdOutlineAutoAwesome className="text-white text-lg animate-pulse" />
						</div>
						<div>
							<h3 className="text-lg font-semibold text-[#1F1F1F] tracking-tight flex items-center gap-1.5">
								Help me create a form
							</h3>
							<p className="text-xs text-[#5F6368]">
								Powered by Google Gemini
							</p>
						</div>
					</div>

					<button
						type="button"
						disabled={isLoading}
						onClick={handleClose}
						className="text-[#5F6368] hover:text-[#1F1F1F] hover:bg-slate-100 p-2 rounded-full transition cursor-pointer"
					>
						<MdClose className="text-xl" />
					</button>
				</div>

				{/* Modal Body */}
				<div className="px-6 py-4">
					{isLoading ? (
						<div className="py-12 flex flex-col items-center justify-center text-center">
							<div className="relative w-14 h-14 mb-5">
								<div className="absolute inset-0 rounded-full bg-gradient-to-tr from-[#8E24AA] via-[#673AB7] to-[#1E88E5] animate-spin blur-xs opacity-75" />
								<div className="relative w-full h-full rounded-full bg-white flex items-center justify-center shadow-md">
									<MdOutlineAutoAwesome className="text-2xl text-[#673AB7] animate-bounce" />
								</div>
							</div>
							<p className="text-base font-medium text-[#1F1F1F]">
								✨ Gemini is crafting your form...
							</p>
							<p className="text-xs text-[#5F6368] mt-1.5 max-w-[320px]">
								Generating relevant questions, multiple-choice options, and layout.
							</p>
						</div>
					) : (
						<>
							<div className="relative">
								<textarea
									rows={4}
									value={prompt}
									onChange={(e) => {
										setPrompt(e.target.value);
										if (error) setError("");
									}}
									onKeyDown={(e) => {
										if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
											e.preventDefault();
											handleGenerate();
										}
									}}
									placeholder="Describe the form you want to create (e.g. A 5-question customer satisfaction survey for a coffee shop)..."
									className="w-full text-sm text-[#1F1F1F] placeholder:text-[#747775] p-3.5 rounded-xl border border-[#DADCE0] focus:border-[#673AB7] focus:ring-2 focus:ring-[#673AB7]/20 outline-none resize-none transition leading-relaxed bg-[#FAFAFA] focus:bg-white"
									autoFocus
								/>
							</div>

							{error && (
								<p className="text-xs text-red-600 mt-2 font-medium">
									{error}
								</p>
							)}

							{/* Suggestions Chips */}
							<div className="mt-4">
								<p className="text-xs font-medium text-[#5F6368] mb-2">
									Or pick an instant idea:
								</p>
								<div className="flex flex-wrap gap-2">
									{SUGGESTIONS.map((item, idx) => (
										<button
											key={idx}
											type="button"
											onClick={() => handleChipClick(item.prompt)}
											className="text-xs text-[#444746] bg-[#F2F2F2] hover:bg-[#E8DEF8] hover:text-[#673AB7] px-3 py-1.5 rounded-full transition cursor-pointer font-medium border border-transparent hover:border-[#673AB7]/30"
										>
											{item.label}
										</button>
									))}
								</div>
							</div>
						</>
					)}
				</div>

				{/* Modal Footer */}
				{!isLoading && (
					<div className="flex items-center justify-end gap-2 px-6 py-4 bg-[#F8F9FA] border-t border-[#E0E2EC]">
						<button
							type="button"
							onClick={handleClose}
							className="px-4 py-2 text-sm font-medium text-[#5F6368] hover:bg-slate-200/60 rounded-lg transition cursor-pointer"
						>
							Cancel
						</button>
						<button
							type="button"
							onClick={() => handleGenerate()}
							className="px-5 py-2 text-sm font-medium text-white bg-gradient-to-r from-[#673AB7] to-[#7E57C2] hover:from-[#5E35B1] hover:to-[#673AB7] rounded-lg shadow-sm hover:shadow transition cursor-pointer flex items-center gap-1.5"
						>
							<MdOutlineAutoAwesome className="text-base" />
							<span>Generate Form</span>
						</button>
					</div>
				)}
			</div>
		</div>
	);
};

AIPromptModal.propTypes = {
	isOpen: PropTypes.bool.isRequired,
	onClose: PropTypes.func.isRequired,
	onSuccess: PropTypes.func,
};

export default AIPromptModal;
