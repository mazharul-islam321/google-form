import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { MdOutlineImage, MdClose, MdUploadFile } from "react-icons/md";

const BannerPickerModal = ({ isOpen, onClose, currentImage, onSave }) => {
	const [imageUrl, setImageUrl] = useState("");
	const [previewUrl, setPreviewUrl] = useState("");
	const [error, setError] = useState("");
	const [isProcessing, setIsProcessing] = useState(false);

	useEffect(() => {
		if (isOpen) {
			setImageUrl(currentImage || "");
			setPreviewUrl(currentImage || "");
			setError("");
			setIsProcessing(false);
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

	const handleDone = () => {
		if (!previewUrl.trim()) {
			setError("Please provide an image URL or upload a file.");
			return;
		}
		onSave(previewUrl.trim());
		onClose();
	};

	return (
		<div
			className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4 animate-fade-in"
			onClick={onClose}
		>
			<div
				className="bg-white w-full max-w-lg rounded-xl shadow-2xl overflow-hidden flex flex-col"
				onClick={(e) => e.stopPropagation()}
			>
				{/* Modal Header */}
				<div className="flex items-center justify-between px-6 py-4 border-b border-[#dadce0]">
					<div className="flex items-center gap-2.5">
						<MdOutlineImage className="text-2xl text-[#673ab7]" />
						<h3 className="text-lg font-medium text-[#202124]">
							Add Header Banner
						</h3>
					</div>
					<button
						type="button"
						onClick={onClose}
						className="p-1 rounded-full text-[#5f6368] hover:bg-gray-100 hover:text-[#202124] transition cursor-pointer"
					>
						<MdClose className="text-xl" />
					</button>
				</div>

				{/* Modal Body */}
				<div className="p-6 flex flex-col gap-5">
					{/* Image URL Input */}
					<div>
						<label className="block text-xs font-semibold text-[#5f6368] uppercase tracking-wider mb-2">
							Image URL
						</label>
						<input
							type="url"
							value={imageUrl.startsWith("data:") ? "" : imageUrl}
							onChange={(e) => handleUrlChange(e.target.value)}
							placeholder="https://example.com/banner.jpg"
							className="w-full text-sm border border-[#dadce0] rounded-lg px-3.5 py-2.5 outline-none focus:border-[#673ab7] focus:ring-1 focus:ring-[#673ab7] transition"
						/>
					</div>

					<div className="flex items-center gap-3 text-xs text-gray-400">
						<div className="h-[1px] bg-gray-200 flex-grow" />
						<span>OR UPLOAD IMAGE</span>
						<div className="h-[1px] bg-gray-200 flex-grow" />
					</div>

					{/* File Upload Area */}
					<div>
						<label className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 hover:border-[#673ab7] rounded-lg p-5 cursor-pointer bg-slate-50 hover:bg-purple-50/40 transition">
							<MdUploadFile className="text-3xl text-[#673ab7] mb-1" />
							<span className="text-xs font-medium text-[#202124]">
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

					{/* Error alert */}
					{error && (
						<p className="text-xs text-red-500 font-medium">
							{error}
						</p>
					)}

					{/* Preview */}
					{previewUrl && (
						<div>
							<p className="text-xs font-semibold text-[#5f6368] uppercase tracking-wider mb-2">
								Preview
							</p>
							<div className="w-full h-32 rounded-lg overflow-hidden border border-[#dadce0] bg-gray-100">
								<img
									src={previewUrl}
									alt="Banner preview"
									onError={() =>
										setError(
											"Unable to load image from URL. Please check the link."
										)
									}
									className="w-full h-full object-cover"
								/>
							</div>
						</div>
					)}
				</div>

				{/* Modal Footer */}
				<div className="flex items-center justify-between gap-3 px-6 py-4 bg-gray-50 border-t border-[#dadce0]">
					{currentImage ? (
						<button
							type="button"
							onClick={() => {
								onSave("");
								onClose();
							}}
							className="text-sm text-red-600 hover:text-red-700 font-medium px-2 py-1 hover:bg-red-50 rounded transition cursor-pointer"
						>
							Remove banner
						</button>
					) : (
						<div />
					)}
					<div className="flex items-center gap-3">
						<button
							type="button"
							onClick={onClose}
							className="px-4 py-2 text-sm font-medium text-[#5f6368] hover:text-[#202124] hover:bg-gray-200/60 rounded-md transition cursor-pointer"
						>
							Cancel
						</button>
						<button
							type="button"
							onClick={handleDone}
							disabled={isProcessing}
							className="px-5 py-2 text-sm font-medium text-white bg-[#673ab7] hover:bg-[#5a2ea6] rounded-md shadow-xs transition cursor-pointer disabled:opacity-50"
						>
							Done
						</button>
					</div>
				</div>
			</div>
		</div>
	);
};

BannerPickerModal.propTypes = {
	isOpen: PropTypes.bool.isRequired,
	onClose: PropTypes.func.isRequired,
	currentImage: PropTypes.string,
	onSave: PropTypes.func.isRequired,
};

export default BannerPickerModal;
