import PropTypes from "prop-types";
import { MdArrowBack } from "react-icons/md";
import { useState } from "react";

const PreviewHeader = ({ formName = "Untitled form" }) => {
	const [copied, setCopied] = useState(false);

	const handleBack = () => {
		if (window.history.length > 1) {
			window.history.back();
		} else {
			window.close();
		}
	};

	const handleShare = () => {
		const shareUrl = window.location.href;
		if (navigator.clipboard) {
			navigator.clipboard.writeText(shareUrl);
			setCopied(true);
			setTimeout(() => setCopied(false), 2500);
		}
	};

	return (
		<header className="sticky top-0 z-40 bg-white border-b border-[#dadce0] px-6 py-2.5 flex items-center justify-between shadow-sm">
			{/* Left side: Back button and Preview Mode text */}
			<div className="flex items-center gap-3">
				<button
					type="button"
					onClick={handleBack}
					className="p-2 rounded-full hover:bg-slate-100 cursor-pointer focus:outline-none text-[#5f6368] transition duration-150"
					title="Go back"
				>
					<MdArrowBack fontSize="1.4em" />
				</button>

				<div className="flex items-center gap-2.5">
					<span className="text-base md:text-lg font-medium text-[#202124] truncate max-w-[280px] md:max-w-md">
						{formName}
					</span>
					<span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-purple-100 text-[#673ab7]">
						Preview mode
					</span>
				</div>
			</div>

			{/* Right side: Share button */}
			<div className="flex items-center gap-2">
				{copied && (
					<span className="text-xs text-green-600 font-medium animate-fade-in">
						Link copied!
					</span>
				)}
				<button
					type="button"
					onClick={handleShare}
					className="py-1.5 px-5 rounded-md bg-[#673ab7] hover:bg-[#5a2ea6] text-white font-medium text-sm shadow-sm transition duration-150 cursor-pointer"
				>
					Share
				</button>
			</div>
		</header>
	);
};

PreviewHeader.propTypes = {
	formName: PropTypes.string,
	formId: PropTypes.string,
};

export default PreviewHeader;
