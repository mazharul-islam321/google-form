import PropTypes from "prop-types";
import { MdOutlineAutoAwesome, MdClose, MdArrowBack } from "react-icons/md";

const AIModalHeader = ({
	mode,
	isLoading,
	prompt,
	onClose,
	onBackToPrompt,
	onTryAgain,
}) => {
	if (mode === "prompt" || isLoading) {
		return (
			<div className="h-16 shrink-0 flex items-center justify-between px-6 border-b border-gray-100 bg-white">
				<div className="flex items-center gap-2.5">
					<div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#673AB7] via-[#8E24AA] to-[#1E88E5] flex items-center justify-center shadow-xs">
						<MdOutlineAutoAwesome className="text-white text-base animate-pulse" />
					</div>
					<div>
						<h3 className="text-base font-semibold text-[#1F1F1F] tracking-tight leading-none">
							Create Form with AI
						</h3>
						<p className="text-[11px] text-[#5F6368] mt-1">
							Powered by Google Gemini 2.5
						</p>
					</div>
				</div>

				<button
					type="button"
					disabled={isLoading}
					onClick={onClose}
					className="text-[#5F6368] hover:text-[#1F1F1F] hover:bg-slate-100 p-2 rounded-full transition cursor-pointer"
					title="Close"
				>
					<MdClose className="text-xl" />
				</button>
			</div>
		);
	}

	return (
		<div className="h-16 shrink-0 flex items-center justify-between px-6 border-b border-gray-100 bg-white gap-3">
			<button
				type="button"
				onClick={onBackToPrompt}
				className="text-[#444746] hover:text-[#1f1f1f] hover:bg-slate-100 p-2 rounded-full transition cursor-pointer flex-shrink-0"
				title="Back to edit prompt"
			>
				<MdArrowBack className="text-xl" />
			</button>

			{/* Prompt Pill Container */}
			<div className="flex-1 flex items-center justify-between bg-[#F0F4F9] rounded-full px-4 py-1.5 min-w-0 gap-2 border border-transparent">
				<span className="text-sm text-[#1F1F1F] truncate font-normal">
					{prompt}
				</span>

				<button
					type="button"
					onClick={onTryAgain}
					className="flex-shrink-0 bg-[#C2E7FF] hover:bg-[#B3DEFF] text-[#001D35] text-xs font-semibold px-3.5 py-1.5 rounded-full transition shadow-2xs cursor-pointer flex items-center gap-1"
					title="Generate another response"
				>
					<MdOutlineAutoAwesome className="text-xs" />
					<span>Try again</span>
				</button>
			</div>

			<button
				type="button"
				onClick={onClose}
				className="text-[#444746] hover:text-[#1f1f1f] hover:bg-slate-100 p-2 rounded-full transition cursor-pointer flex-shrink-0"
				title="Close preview"
			>
				<MdClose className="text-xl" />
			</button>
		</div>
	);
};

AIModalHeader.propTypes = {
	mode: PropTypes.string.isRequired,
	isLoading: PropTypes.bool.isRequired,
	prompt: PropTypes.string,
	onClose: PropTypes.func.isRequired,
	onBackToPrompt: PropTypes.func.isRequired,
	onTryAgain: PropTypes.func.isRequired,
};

export default AIModalHeader;
