import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import {
	MdOutlineImage,
	MdClose,
	MdUploadFile,
	MdOutlineAutoAwesome,
	MdLink,
	MdArrowBack,
} from "react-icons/md";
import { useGenerateImageWithAIMutation } from "../../redux/api/formApi";

const STYLE_PRESETS = [
	{ label: "Minimalist", value: "clean minimalist illustration" },
	{ label: "Abstract Gradient", value: "vibrant abstract modern gradient art" },
	{ label: "Photorealistic", value: "high quality realistic photo" },
	{ label: "3D Render", value: "smooth 3D modern isometric render" },
	{ label: "Watercolor", value: "soft artistic watercolor painting" },
];

const AI_BANNER_IDEAS = [
	"Minimalist abstract purple & blue gradient",
	"Modern tech office workspace with laptop",
	"Creative geometric patterns with soft lighting",
	"Nature landscape with serene mountains and trees",
	"Vibrant sunset over calm ocean waves",
	"Abstract watercolor paint splash in purple and gold",
];

const AI_QUESTION_IDEAS = [
	"A fountain pen with blue ink on stationery",
	"Happy customer giving 5 star rating",
	"Package delivery box with shipping label",
	"Survey checkmark clipboard on modern desk",
	"Graduation cap and diploma on wooden desk",
	"Award trophy with golden celebratory stars",
];

const ImagePickerModal = ({
	isOpen,
	onClose,
	currentImage = "",
	onSave,
	title = "Insert Image",
	removeLabel = "Remove image",
	aspectRatio,
}) => {
	const isHeader =
		title.toLowerCase().includes("header") ||
		title.toLowerCase().includes("banner") ||
		aspectRatio === "16:9";

	const effectiveRatio = aspectRatio || (isHeader ? "16:9" : "4:3");

	const [tab, setTab] = useState("upload"); // 'upload' | 'ai'
	const [imageUrl, setImageUrl] = useState("");
	const [previewUrl, setPreviewUrl] = useState("");
	const [error, setError] = useState("");
	const [isProcessing, setIsProcessing] = useState(false);

	// AI Generation State
	const [aiPrompt, setAiPrompt] = useState("");
	const [selectedStyle, setSelectedStyle] = useState("");
	const [isAiPreviewStage, setIsAiPreviewStage] = useState(false);

	const [generateImageWithAI, { isLoading: isGeneratingAI }] =
		useGenerateImageWithAIMutation();

	useEffect(() => {
		if (isOpen) {
			setImageUrl(currentImage || "");
			setPreviewUrl(currentImage || "");
			setError("");
			setIsProcessing(false);
			setAiPrompt("");
			setSelectedStyle("");
			setIsAiPreviewStage(false);
			setTab("upload");
		}
	}, [isOpen, currentImage]);

	// Escape key to close
	useEffect(() => {
		const handleKeyDown = (e) => {
			if (e.key === "Escape") onClose();
		};
		if (isOpen) {
			window.addEventListener("keydown", handleKeyDown);
		}
		return () => window.removeEventListener("keydown", handleKeyDown);
	}, [isOpen, onClose]);

	if (!isOpen) return null;

	const handleUrlChange = (val) => {
		setImageUrl(val);
		setPreviewUrl(val);
		setError("");
	};

	const handleFileUpload = (e) => {
		const file = e.target.files?.[0];
		if (!file) return;

		if (!file.type.startsWith("image/")) {
			setError("Please upload a valid image file.");
			return;
		}

		setIsProcessing(true);
		setError("");

		const reader = new FileReader();
		reader.onload = (event) => {
			const rawDataUrl = event.target?.result;
			if (typeof rawDataUrl !== "string") {
				setIsProcessing(false);
				return;
			}

			// Compress image using HTML5 Canvas
			const img = new Image();
			img.onload = () => {
				const maxWidth = 1400;
				let width = img.width;
				let height = img.height;

				if (width > maxWidth) {
					height = Math.round((height * maxWidth) / width);
					width = maxWidth;
				}

				const canvas = document.createElement("canvas");
				canvas.width = width;
				canvas.height = height;
				const ctx = canvas.getContext("2d");
				ctx.drawImage(img, 0, 0, width, height);

				const compressedDataUrl = canvas.toDataURL("image/jpeg", 0.85);
				setImageUrl(compressedDataUrl);
				setPreviewUrl(compressedDataUrl);
				setIsProcessing(false);
			};
			img.onerror = () => {
				setError("Failed to process image file.");
				setIsProcessing(false);
			};
			img.src = rawDataUrl;
		};
		reader.readAsDataURL(file);
	};

	const handleGenerateAI = async (promptToUse = aiPrompt) => {
		const cleanPrompt = (promptToUse || "").trim();
		if (!cleanPrompt) {
			setError("Please enter a description for the image.");
			return;
		}

		setError("");
		try {
			const res = await generateImageWithAI({
				prompt: cleanPrompt,
				aspectRatio: effectiveRatio,
				style: selectedStyle || undefined,
			}).unwrap();

			const generatedUrl = res?.data?.imageUrl || res?.imageUrl;
			if (generatedUrl) {
				setPreviewUrl(generatedUrl);
				setImageUrl(generatedUrl);
				setIsAiPreviewStage(true);
			} else {
				setError("Failed to generate image. Please try another prompt.");
			}
		} catch (err) {
			console.error("AI Image Generation failed:", err);
			setError(
				err?.data?.message ||
					"Failed to generate image with AI. Please try again."
			);
		}
	};

	const handleDone = () => {
		if (!previewUrl.trim()) {
			setError("Please provide, upload, or generate an image first.");
			return;
		}
		onSave(previewUrl.trim());
		onClose();
	};

	const ideas = isHeader ? AI_BANNER_IDEAS : AI_QUESTION_IDEAS;

	return (
		<div
			className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4 animate-fade-in"
			onClick={onClose}
		>
			<div
				className="bg-white w-full max-w-[620px] h-[600px] rounded-2xl shadow-2xl overflow-hidden flex flex-col justify-between border border-[#DADCE0] transition-all transform animate-scale-up"
				onClick={(e) => e.stopPropagation()}
			>
				{/* Modal Header */}
				{tab === "ai" && isAiPreviewStage ? (
					/* AI Preview Stage Header with Back and Editable Prompt */
					<div className="h-16 shrink-0 flex items-center justify-between px-6 border-b border-gray-100 bg-white gap-3">
						<button
							type="button"
							disabled={isGeneratingAI}
							onClick={() => setIsAiPreviewStage(false)}
							className="text-[#444746] hover:text-[#1F1F1F] hover:bg-slate-100 p-2 rounded-full transition cursor-pointer flex-shrink-0"
							title="Back to prompt settings"
						>
							<MdArrowBack className="text-xl" />
						</button>

						{/* Editable Prompt Pill */}
						<div className="flex-1 flex items-center justify-between bg-[#F0F4F9] hover:bg-[#E9EEF6] focus-within:bg-white focus-within:ring-2 focus-within:ring-[#673AB7]/25 focus-within:border-[#673AB7] rounded-full pl-4 pr-1.5 py-1 min-w-0 gap-2 border border-transparent transition">
							<input
								type="text"
								disabled={isGeneratingAI}
								value={aiPrompt}
								onChange={(e) => setAiPrompt(e.target.value)}
								onKeyDown={(e) => {
									if (e.key === "Enter" && !isGeneratingAI) {
										e.preventDefault();
										handleGenerateAI();
									}
								}}
								placeholder="Modify prompt..."
								className="flex-1 bg-transparent text-xs text-[#1F1F1F] placeholder:text-[#747775] outline-none min-w-0 font-normal py-0.5"
							/>

							<button
								type="button"
								disabled={isGeneratingAI}
								onClick={() => handleGenerateAI()}
								className="flex-shrink-0 bg-[#C2E7FF] hover:bg-[#B3DEFF] active:scale-95 text-[#001D35] text-xs font-semibold px-3 py-1.5 rounded-full transition shadow-2xs cursor-pointer flex items-center gap-1"
								title="Generate another (Enter ↵)"
							>
								<MdOutlineAutoAwesome
									className={`text-xs ${
										isGeneratingAI ? "animate-spin" : ""
									}`}
								/>
								<span>{isGeneratingAI ? "Generating..." : "Try again"}</span>
							</button>
						</div>

						<button
							type="button"
							onClick={onClose}
							className="p-1.5 rounded-full text-[#5F6368] hover:bg-gray-100 hover:text-[#1F1F1F] transition cursor-pointer"
						>
							<MdClose className="text-xl" />
						</button>
					</div>
				) : (
					/* Standard Modal Header */
					<div className="h-16 shrink-0 flex items-center justify-between px-6 border-b border-gray-100 bg-white">
						<div className="flex items-center gap-2.5">
							<div className="w-8 h-8 rounded-xl bg-[#673AB7]/10 flex items-center justify-center text-[#673AB7]">
								<MdOutlineImage className="text-xl" />
							</div>
							<div>
								<h3 className="text-base font-semibold text-[#1F1F1F] leading-none">
									{title}
								</h3>
								<p className="text-[11px] text-[#5F6368] mt-1">
									{isHeader
										? "Recommended aspect ratio: 16:9 banner"
										: "Attach image to question or section"}
								</p>
							</div>
						</div>
						<button
							type="button"
							onClick={onClose}
							className="p-1.5 rounded-full text-[#5F6368] hover:bg-gray-100 hover:text-[#1F1F1F] transition cursor-pointer"
						>
							<MdClose className="text-xl" />
						</button>
					</div>
				)}

				{/* Segmented Mode Selector (Only in input stage) */}
				{!(tab === "ai" && isAiPreviewStage) && (
					<div className="px-6 pt-3">
						<div className="w-full grid grid-cols-2 p-1 bg-[#F1F3F4] rounded-xl border border-gray-200">
							<button
								type="button"
								onClick={() => {
									setTab("upload");
									setError("");
								}}
								className={`w-full flex items-center justify-center gap-2 py-1.5 px-3 rounded-lg text-xs font-semibold transition-all duration-150 cursor-pointer ${
									tab === "upload"
										? "bg-white text-[#673AB7] shadow-xs"
										: "text-[#5F6368] hover:text-[#202124]"
								}`}
							>
								<MdUploadFile className="text-base" />
								<span>Upload & Link</span>
							</button>

							<button
								type="button"
								onClick={() => {
									setTab("ai");
									setError("");
								}}
								className={`w-full flex items-center justify-center gap-2 py-1.5 px-3 rounded-lg text-xs font-semibold transition-all duration-150 cursor-pointer ${
									tab === "ai"
										? "bg-white text-[#673AB7] shadow-xs"
										: "text-[#5F6368] hover:text-[#202124]"
								}`}
							>
								<MdOutlineAutoAwesome className="text-base" />
								<span>Generate with AI</span>
							</button>
						</div>
					</div>
				)}

				{/* Modal Body */}
				<div className="flex-1 p-6 overflow-y-auto flex flex-col justify-between">
					{isGeneratingAI ? (
						/* AI Loading View */
						<div className="my-auto flex flex-col items-center justify-center text-center">
							<div className="relative w-16 h-16 mb-4 flex items-center justify-center">
								<div className="absolute inset-0 rounded-2xl bg-gradient-to-tr from-[#673AB7] via-[#8E24AA] to-[#1E88E5] opacity-25 animate-ping blur-xs" />
								<div className="relative w-13 h-13 rounded-xl bg-gradient-to-tr from-[#673AB7] via-[#8E24AA] to-[#1E88E5] flex items-center justify-center shadow-md">
									<MdOutlineAutoAwesome className="text-white text-2xl animate-spin [animation-duration:5s]" />
								</div>
							</div>
							<h4 className="text-base font-bold text-[#1F1F1F]">
								Generating image with AI...
							</h4>
							<p className="text-xs text-[#5F6368] mt-1 font-normal">
								Crafting high-resolution visual matching your prompt...
							</p>
						</div>
					) : tab === "ai" && isAiPreviewStage ? (
						/* AI Image Preview View (Prominent Full Display) */
						<div className="my-auto flex flex-col items-center justify-center w-full">
							<div
								className={`w-full rounded-xl overflow-hidden border border-gray-200 bg-gray-900/5 shadow-sm flex items-center justify-center ${
									isHeader ? "h-[290px]" : "h-[310px]"
								}`}
							>
								<img
									src={previewUrl}
									alt="AI Generated Preview"
									onError={() =>
										setError(
											"Unable to load generated image. Please click Try Again."
										)
									}
									className="w-full h-full object-cover"
								/>
							</div>
						</div>
					) : tab === "upload" ? (
						/* Upload & Link Body with Empty & Active Preview Box */
						<div className="space-y-3.5">
							{/* 1. Image URL Input */}
							<div>
								<label className="block text-xs font-semibold text-[#5F6368] uppercase tracking-wider mb-1 flex items-center gap-1">
									<MdLink className="text-base" />
									<span>Image URL</span>
								</label>
								<input
									type="url"
									value={imageUrl.startsWith("data:") ? "" : imageUrl}
									onChange={(e) => handleUrlChange(e.target.value)}
									placeholder="https://example.com/image.jpg"
									className="w-full text-sm border border-gray-200 rounded-xl px-3 py-2 outline-none focus:border-[#673AB7] focus:ring-2 focus:ring-[#673AB7]/20 transition bg-[#F8F9FA] focus:bg-white"
								/>
							</div>

							<div className="flex items-center gap-3 text-xs text-gray-400">
								<div className="h-[1px] bg-gray-200 flex-grow" />
								<span>OR UPLOAD FILE</span>
								<div className="h-[1px] bg-gray-200 flex-grow" />
							</div>

							{/* 2. Upload Box */}
							<div>
								<label className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 hover:border-[#673AB7] rounded-xl p-4 cursor-pointer bg-[#F8F9FA] hover:bg-[#F3EDF7]/40 transition">
									<MdUploadFile className="text-3xl text-[#673AB7] mb-1" />
									<span className="text-xs font-semibold text-[#1F1F1F]">
										{isProcessing
											? "Processing image..."
											: "Click to upload an image"}
									</span>
									<span className="text-[11px] text-gray-400 mt-0.5">
										PNG, JPG, WebP up to 5MB
									</span>
									<input
										type="file"
										accept="image/*"
										onChange={handleFileUpload}
										disabled={isProcessing}
										className="hidden"
									/>
								</label>
							</div>

							{/* 3. Preview Section with Always Visible Box */}
							<div>
								<p className="text-xs font-semibold text-[#5F6368] uppercase tracking-wider mb-1.5">
									Preview
								</p>
								{previewUrl ? (
									<div className="h-40 rounded-xl overflow-hidden border border-gray-200 bg-gray-50 flex items-center justify-center p-2">
										<img
											src={previewUrl}
											alt="Upload Preview"
											onError={() =>
												setError(
													"Unable to load image from URL. Please check the link."
												)
											}
											className="max-h-36 w-auto object-contain"
										/>
									</div>
								) : (
									<div className="h-36 rounded-xl border-2 border-dashed border-gray-200 bg-gray-50/70 flex flex-col items-center justify-center text-gray-400 gap-1.5 select-none">
										<MdOutlineImage className="text-3xl text-gray-300" />
										<span className="text-xs font-medium text-gray-400">
											No image selected yet
										</span>
									</div>
								)}
							</div>
						</div>
					) : (
						/* AI Generator Prompt & Settings Body */
						<div className="space-y-3">
							<div>
								<label className="block text-xs font-semibold text-[#5F6368] uppercase tracking-wider mb-1.5 flex items-center gap-1">
									<MdOutlineAutoAwesome className="text-[#673AB7]" />
									<span>Describe the image you want</span>
								</label>
								<textarea
									rows={3}
									value={aiPrompt}
									onChange={(e) => {
										setAiPrompt(e.target.value);
										if (error) setError("");
									}}
									onKeyDown={(e) => {
										if (e.key === "Enter" && !e.shiftKey) {
											e.preventDefault();
											handleGenerateAI();
										}
									}}
									placeholder={
										isHeader
											? "e.g. Minimalist abstract purple gradient for science survey header..."
											: "e.g. A blue fountain pen resting on a clean notepad..."
									}
									className="w-full min-h-[96px] text-sm border border-gray-200 rounded-xl p-3 outline-none focus:border-[#673AB7] focus:ring-2 focus:ring-[#673AB7]/20 transition bg-[#F8F9FA] focus:bg-white resize-none leading-relaxed"
									autoFocus
								/>
							</div>

							{/* Style Presets */}
							<div>
								<span className="text-xs text-[#5F6368] font-medium block mb-1">
									Style Preset:
								</span>
								<div className="flex flex-wrap gap-1">
									{STYLE_PRESETS.map((s, idx) => (
										<button
											key={idx}
											type="button"
											onClick={() =>
												setSelectedStyle(
													selectedStyle === s.value ? "" : s.value
												)
											}
											className={`text-xs px-2.5 py-1 rounded-full border transition cursor-pointer font-medium ${
												selectedStyle === s.value
													? "bg-[#673AB7] text-white border-[#673AB7]"
													: "bg-[#F1F3F4] text-[#3C4043] hover:bg-[#EDE7F6] hover:text-[#673AB7] border-transparent"
											}`}
										>
											{s.label}
										</button>
									))}
								</div>
							</div>

							{/* Idea Chips */}
							<div>
								<span className="text-xs text-[#5F6368] font-medium block mb-1">
									Ideas to try:
								</span>
								<div className="flex flex-wrap gap-1">
									{ideas.map((idea, idx) => (
										<button
											key={idx}
											type="button"
											onClick={() => {
												setAiPrompt(idea);
												if (error) setError("");
											}}
											className="text-xs px-2.5 py-1 rounded-full bg-[#F1F3F4] text-[#3C4043] hover:bg-[#EDE7F6] hover:text-[#673AB7] border border-transparent transition cursor-pointer font-normal text-left"
										>
											{idea}
										</button>
									))}
								</div>
							</div>

							{/* Generate Button */}
							<button
								type="button"
								onClick={() => handleGenerateAI()}
								disabled={!aiPrompt.trim() || isGeneratingAI}
								className="w-full py-2.5 px-4 mt-1 bg-[#673AB7] hover:bg-[#5A2EA6] text-white text-sm font-medium rounded-xl transition shadow-xs flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
							>
								<MdOutlineAutoAwesome className="text-base" />
								<span>Generate Image</span>
							</button>
						</div>
					)}

					{/* Error Alert */}
					{error && (
						<p className="text-xs text-red-500 font-medium mt-2">{error}</p>
					)}
				</div>

				{/* Modal Footer */}
				<div className="h-16 shrink-0 flex items-center justify-between px-6 bg-[#F8F9FA] border-t border-gray-200">
					{currentImage ? (
						<button
							type="button"
							onClick={() => {
								onSave("");
								onClose();
							}}
							className="text-sm text-red-600 hover:text-red-700 font-medium px-2 py-1 hover:bg-red-50 rounded-lg transition cursor-pointer"
						>
							{removeLabel}
						</button>
					) : (
						<div />
					)}
					<div className="flex items-center gap-2.5">
						<button
							type="button"
							onClick={onClose}
							className="px-4 py-2 text-sm font-medium text-[#5F6368] hover:text-[#1F1F1F] hover:bg-gray-200/60 rounded-xl transition cursor-pointer"
						>
							Cancel
						</button>
						<button
							type="button"
							onClick={handleDone}
							disabled={
								isProcessing ||
								isGeneratingAI ||
								!previewUrl.trim() ||
								(tab === "ai" && !isAiPreviewStage)
							}
							className="px-5 py-2 text-sm font-medium text-white bg-[#0B57D0] hover:bg-[#0842A0] rounded-xl shadow-xs transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
						>
							Done
						</button>
					</div>
				</div>
			</div>
		</div>
	);
};

ImagePickerModal.propTypes = {
	isOpen: PropTypes.bool.isRequired,
	onClose: PropTypes.func.isRequired,
	currentImage: PropTypes.string,
	onSave: PropTypes.func.isRequired,
	title: PropTypes.string,
	removeLabel: PropTypes.string,
	aspectRatio: PropTypes.string,
};

export default ImagePickerModal;
