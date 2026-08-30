import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { MdOutlineAutoAwesome, MdClose, MdArrowBack } from "react-icons/md";
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
			setError("Please enter a description for your form.");
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

	const handleTryAgain = () => {
		setMode("prompt");
	};

	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs px-4 animate-fade-in">
			<div
				className={`bg-white rounded-2xl shadow-2xl w-full overflow-hidden border border-[#E0E2EC] transition-all transform animate-scale-up ${
					mode === "preview" ? "max-w-[780px]" : "max-w-[580px]"
				}`}
			>
				{/* Modal Header */}
				{mode === "prompt" ? (
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
				) : (
					/* Preview Top Bar matching Google Forms */
					<div className="flex items-center justify-between px-5 py-3.5 border-b border-gray-100 bg-white gap-3">
						<button
							type="button"
							onClick={handleTryAgain}
							className="text-[#444746] hover:text-[#1f1f1f] hover:bg-slate-100 p-2 rounded-full transition cursor-pointer flex-shrink-0"
							title="Back to prompt"
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
								className="flex-shrink-0 bg-[#C2E7FF] hover:bg-[#B3DEFF] text-[#001D35] text-xs font-semibold px-3.5 py-1.5 rounded-full transition shadow-2xs cursor-pointer"
							>
								Try again
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

				{/* Modal Body */}
				{mode === "prompt" ? (
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
				) : (
					/* Live Form Preview Area */
					<div className="bg-[#F0EBF8]/60 px-6 py-5 max-h-[62vh] overflow-y-auto space-y-4">
						{/* Form Title & Description Card */}
						<div className="bg-white rounded-2xl p-6 shadow-xs border-t-[8px] border-[#673AB7]">
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
									className="bg-white rounded-xl p-5 shadow-xs border border-gray-100/80 transition"
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
									{item.questionType === "multiplechoice" && (
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

									{item.questionType === "dropdown" && (
										<div className="space-y-2 mt-2">
											<div className="inline-flex items-center justify-between border border-gray-300 rounded-md px-3 py-1.5 text-xs text-gray-500 bg-gray-50/50 min-w-[200px]">
												<span>Choose an option</span>
												<span className="text-gray-400 ml-2">▼</span>
											</div>
											<div className="pl-2 space-y-1">
												{(item.options || []).map((opt, optIdx) => (
													<p
														key={optIdx}
														className="text-xs text-gray-500 flex items-center gap-1.5"
													>
														<span className="text-gray-400">{optIdx + 1}.</span>
														<span>{opt}</span>
													</p>
												))}
											</div>
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

				{/* Modal Footer */}
				{mode === "prompt" ? (
					!isLoading && (
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
					)
				) : (
					/* Preview Footer with Create Form button */
					<div className="flex items-center justify-end px-6 py-3.5 bg-white border-t border-gray-100">
						<button
							type="button"
							onClick={handleAcceptForm}
							className="px-7 py-2.5 text-sm font-medium text-white bg-[#0B57D0] hover:bg-[#0842A0] rounded-full shadow-sm hover:shadow transition cursor-pointer flex items-center gap-2"
						>
							<span>Create form</span>
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
