import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { MdOutlineAutoAwesome, MdClose, MdArrowBack } from "react-icons/md";
import { useGenerateFormWithAIMutation } from "../../redux/api/formApi";

const QUICK_INSPIRATIONS = [
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
		label: "🎓 5-Question Quiz",
		prompt: "5-question multiple choice knowledge quiz with clear answer options",
	},
	{
		label: "📋 Employee Onboarding",
		prompt: "New employee onboarding questionnaire with emergency contacts and equipment needs",
	},
	{
		label: "☕ Coffee Shop Survey",
		prompt: "Coffee shop customer experience survey rating drinks, atmosphere, and service",
	},
];

const AIPromptModal = ({ isOpen, onClose, onSuccess }) => {
	const [mode, setMode] = useState("prompt"); // 'prompt' | 'preview'
	const [prompt, setPrompt] = useState("");
	const [error, setError] = useState("");
	const [previewData, setPreviewData] = useState(null);
	const [generateFormWithAI, { isLoading }] = useGenerateFormWithAIMutation();

	useEffect(() => {
		if (isOpen) {
			setPrompt("");
			setError("");
			setMode("prompt");
			setPreviewData(null);
		}
	}, [isOpen]);

	if (!isOpen) return null;

	const handleClose = () => {
		setPrompt("");
		setError("");
		setMode("prompt");
		setPreviewData(null);
		onClose?.();
	};

	const handleGenerate = async (promptToUse = prompt) => {
		const cleanPrompt = (promptToUse || "").trim();
		if (!cleanPrompt) {
			setError("Please describe the form you want to create.");
			return;
		}

		setError("");
		try {
			const res = await generateFormWithAI({ prompt: cleanPrompt }).unwrap();
			const formData = res?.data || res;
			setPreviewData(formData);
			setMode("preview");
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

	const handleAcceptForm = () => {
		if (!previewData) return;
		onSuccess?.(previewData);
		handleClose();
	};

	// Try again generates another fresh response with loading screen
	const handleTryAgain = () => {
		if (prompt && prompt.trim()) {
			handleGenerate(prompt.trim());
		} else {
			setMode("prompt");
		}
	};

	// Back arrow returns to the prompt editing view
	const handleBackToPrompt = () => {
		setMode("prompt");
	};

	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs px-4 animate-fade-in">
			<div className="bg-white rounded-2xl shadow-2xl w-full max-w-[780px] min-h-[500px] max-h-[86vh] overflow-hidden border border-[#E0E2EC] transition-all transform animate-scale-up flex flex-col justify-between">
				{/* 1. TOP HEADER */}
				{mode === "prompt" || isLoading ? (
					<div className="flex items-center justify-between px-6 pt-5 pb-3 border-b border-gray-100">
						<div className="flex items-center gap-2.5">
							<div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#673AB7] via-[#8E24AA] to-[#1E88E5] flex items-center justify-center shadow-xs">
								<MdOutlineAutoAwesome className="text-white text-base animate-pulse" />
							</div>
							<div>
								<h3 className="text-base font-semibold text-[#1F1F1F] tracking-tight">
									Create Form with AI
								</h3>
								<p className="text-[11px] text-[#5F6368]">
									Powered by Google Gemini 2.5
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
				) : (
					/* Preview Top Bar */
					<div className="flex items-center justify-between px-6 py-3.5 border-b border-gray-100 bg-white gap-3">
						<button
							type="button"
							onClick={handleBackToPrompt}
							className="text-[#444746] hover:text-[#1f1f1f] hover:bg-slate-100 p-2 rounded-full transition cursor-pointer flex-shrink-0"
							title="Back to edit prompt"
						>
							<MdArrowBack className="text-xl" />
						</button>

						{/* Prompt Pill Container */}
						<div className="flex-1 flex items-center justify-between bg-[#F0F4F9] rounded-full px-4 py-2 min-w-0 gap-2 border border-transparent">
							<span className="text-sm text-[#1F1F1F] truncate font-normal">
								{prompt}
							</span>

							<button
								type="button"
								onClick={handleTryAgain}
								className="flex-shrink-0 bg-[#C2E7FF] hover:bg-[#B3DEFF] text-[#001D35] text-xs font-semibold px-3.5 py-1.5 rounded-full transition shadow-2xs cursor-pointer flex items-center gap-1"
								title="Generate another response"
							>
								<MdOutlineAutoAwesome className="text-xs" />
								<span>Try again</span>
							</button>
						</div>

						<button
							type="button"
							onClick={handleClose}
							className="text-[#444746] hover:text-[#1f1f1f] hover:bg-slate-100 p-2 rounded-full transition cursor-pointer flex-shrink-0"
							title="Close preview"
						>
							<MdClose className="text-xl" />
						</button>
					</div>
				)}

				{/* 2. MAIN BODY */}
				{isLoading ? (
					/* Unified Loading State */
					<div className="flex-1 flex flex-col items-center justify-center text-center px-6 py-16">
						<div className="relative w-16 h-16 mb-5">
							<div className="absolute inset-0 rounded-full bg-gradient-to-tr from-[#8E24AA] via-[#673AB7] to-[#1E88E5] animate-spin blur-xs opacity-75" />
							<div className="relative w-full h-full rounded-full bg-white flex items-center justify-center shadow-md">
								<MdOutlineAutoAwesome className="text-3xl text-[#673AB7] animate-bounce" />
							</div>
						</div>
						<h4 className="text-lg font-semibold text-[#1F1F1F]">
							✨ Gemini is crafting your form...
						</h4>
						<p className="text-xs text-[#5F6368] mt-1.5 max-w-[340px] leading-relaxed">
							Designing relevant questions, smart choice options, and complete layout.
						</p>
					</div>
				) : mode === "prompt" ? (
					/* Unique Prompt Creation View */
					<div className="flex-1 px-7 py-5 flex flex-col justify-between">
						<div>
							<label className="block text-sm font-semibold text-[#1F1F1F] mb-2">
								What kind of form do you want to create?
							</label>

							<div className="relative">
								<textarea
									rows={4}
									value={prompt}
									onChange={(e) => {
										setPrompt(e.target.value);
										if (error) setError("");
									}}
									onKeyDown={(e) => {
										if (e.key === "Enter" && !e.shiftKey) {
											e.preventDefault();
											handleGenerate();
										}
									}}
									placeholder="Describe the form you want to create (e.g. Customer feedback survey with rating scales and contact info)..."
									className="w-full text-sm text-[#1F1F1F] placeholder:text-[#747775] p-4 rounded-xl border border-gray-200 focus:border-[#673AB7] focus:ring-2 focus:ring-[#673AB7]/20 outline-none resize-none transition leading-relaxed bg-[#F8F9FA] focus:bg-white"
									autoFocus
								/>
							</div>

							{error && (
								<p className="text-xs text-red-600 mt-1.5 font-medium">
									{error}
								</p>
							)}

							{/* Suggestions Chips */}
							<div className="mt-5">
								<p className="text-xs font-semibold text-[#5F6368] mb-2.5 flex items-center gap-1">
									<MdOutlineAutoAwesome className="text-[#673AB7]" />
									<span>Try an instant template:</span>
								</p>
								<div className="flex flex-wrap gap-2">
									{QUICK_INSPIRATIONS.map((item, idx) => (
										<button
											key={idx}
											type="button"
											onClick={() => handleChipClick(item.prompt)}
											className="text-xs text-[#3C4043] bg-[#F1F3F4] hover:bg-[#E8DEF8] hover:text-[#673AB7] px-3.5 py-1.5 rounded-full transition cursor-pointer font-medium border border-transparent hover:border-[#673AB7]/30"
										>
											{item.label}
										</button>
									))}
								</div>
							</div>
						</div>

						<p className="text-[11px] text-[#747775] text-center mt-4">
							Press <kbd className="px-1.5 py-0.5 bg-gray-100 border border-gray-200 rounded text-[10px] font-sans">Enter ↵</kbd> to generate with AI
						</p>
					</div>
				) : (
					/* Live Form Preview Area */
					<div className="flex-1 bg-[#F7F8FC] px-7 py-5 overflow-y-auto space-y-4 max-h-[58vh]">
						{/* Form Title & Description Card */}
						<div className="bg-white rounded-xl p-6 shadow-xs border-t-[6px] border-[#673AB7]">
							<h2 className="text-2xl font-bold text-[#1F1F1F] tracking-tight">
								{previewData?.title || "Untitled Form"}
							</h2>
							{previewData?.description && (
								<p className="text-sm text-[#444746] mt-2.5 whitespace-pre-wrap leading-relaxed">
									{previewData.description}
								</p>
							)}
						</div>

						{/* Generated Question Cards */}
						{Array.isArray(previewData?.items) &&
							previewData.items.map((item, index) => (
								<div
									key={index}
									className="bg-white rounded-xl p-5 shadow-xs border border-gray-100 transition"
								>
									<div className="flex items-baseline justify-between mb-3">
										<p className="text-[15px] font-medium text-[#1F1F1F]">
											{item.questionTitle || "Untitled Question"}
											{item.required && (
												<span className="text-red-500 ml-1" title="Required">
													*
												</span>
											)}
										</p>
									</div>

									{/* Choices / Input Field Types */}
									{(item.questionType === "multiplechoice" || item.questionType === "dropdown") && (
										<div className="space-y-2.5 mt-2">
											{(item.options || ["Option 1"]).map((opt, optIdx) => (
												<div
													key={optIdx}
													className="flex items-center text-sm text-[#3c4043]"
												>
													<div className="w-4 h-4 rounded-full border-2 border-gray-400 mr-3 flex-shrink-0" />
													<span>{opt}</span>
												</div>
											))}
										</div>
									)}

									{item.questionType === "checkbox" && (
										<div className="space-y-2.5 mt-2">
											{(item.options || ["Option 1"]).map((opt, optIdx) => (
												<div
													key={optIdx}
													className="flex items-center text-sm text-[#3c4043]"
												>
													<div className="w-4 h-4 rounded border-2 border-gray-400 mr-3 flex-shrink-0" />
													<span>{opt}</span>
												</div>
											))}
										</div>
									)}

									{item.questionType === "shortanswer" && (
										<div className="mt-3">
											<div className="w-3/5 border-b border-dotted border-gray-400 pb-1 text-xs text-gray-400 font-light">
												Short-answer text
											</div>
										</div>
									)}

									{item.questionType === "paragraph" && (
										<div className="mt-3">
											<div className="w-4/5 border-b border-dotted border-gray-400 pb-1 text-xs text-gray-400 font-light">
												Long-answer text
											</div>
										</div>
									)}
								</div>
							))}
					</div>
				)}

				{/* 3. FOOTER */}
				{mode === "prompt" && !isLoading ? (
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
							className="px-5 py-2.5 text-sm font-medium text-white bg-gradient-to-r from-[#673AB7] to-[#7E57C2] hover:from-[#5E35B1] hover:to-[#673AB7] rounded-xl shadow-sm hover:shadow transition cursor-pointer flex items-center gap-1.5"
						>
							<MdOutlineAutoAwesome className="text-base" />
							<span>Generate Form</span>
						</button>
					</div>
				) : mode === "preview" && !isLoading ? (
					<div className="flex items-center justify-between px-7 py-3.5 bg-white border-t border-gray-100">
						<span className="text-xs text-gray-500 font-medium">
							✨ {previewData?.items?.length || 0} questions generated
						</span>

						<button
							type="button"
							onClick={handleAcceptForm}
							className="px-7 py-2.5 text-sm font-medium text-white bg-[#0B57D0] hover:bg-[#0842A0] rounded-full shadow-sm hover:shadow transition cursor-pointer flex items-center gap-2"
						>
							<span>Create form</span>
						</button>
					</div>
				) : null}
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
