import PropTypes from "prop-types";
import { MdOutlineAutoAwesome } from "react-icons/md";

const AIQuestionLoadingView = ({ mode, isHeader }) => {
	return (
		<div className="flex-1 bg-[#F8F9FD] p-6 relative overflow-hidden flex flex-col justify-center select-none">
			{/* Top Indeterminate Gradient Progress Line */}
			<div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-[#8E24AA] via-[#673AB7] via-[#1E88E5] to-[#8E24AA] animate-pulse" />

			{/* Background Question Skeleton */}
			<div className="w-full max-w-[560px] mx-auto opacity-35 pointer-events-none space-y-3">
				{mode === "edit" && isHeader ? (
					<div className="bg-white rounded-xl p-5 shadow-xs border-t-[6px] border-[#673AB7] space-y-3">
						<div className="h-5 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 rounded-md w-2/5 animate-pulse" />
						<div className="h-3.5 bg-gray-100 rounded-md w-3/4 animate-pulse" />
					</div>
				) : (
					<div className="bg-white rounded-xl p-5 shadow-xs border border-gray-100 space-y-3">
						<div className="h-4.5 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 rounded-md w-1/2 animate-pulse" />
						<div className="space-y-2.5 pt-1">
							<div className="flex items-center gap-3">
								<div className="w-4 h-4 rounded-full border-2 border-gray-300 animate-pulse" />
								<div className="h-3.5 bg-gray-100 rounded-md w-1/3 animate-pulse" />
							</div>
							<div className="flex items-center gap-3">
								<div className="w-4 h-4 rounded-full border-2 border-gray-300 animate-pulse" />
								<div className="h-3.5 bg-gray-100 rounded-md w-2/5 animate-pulse" />
							</div>
						</div>
					</div>
				)}
			</div>

			{/* Center Floating Status Badge */}
			<div className="absolute inset-0 flex items-center justify-center p-4">
				<div className="bg-white/95 backdrop-blur-md border border-purple-100/80 rounded-2xl shadow-xl px-8 py-5 text-center flex flex-col items-center animate-scale-up">
					<div className="relative w-12 h-12 mb-3 flex items-center justify-center">
						<div className="absolute inset-0 rounded-xl bg-gradient-to-tr from-[#673AB7] via-[#8E24AA] to-[#1E88E5] opacity-30 animate-ping blur-xs" />
						<div className="relative w-10 h-10 rounded-lg bg-gradient-to-tr from-[#673AB7] to-[#8E24AA] flex items-center justify-center shadow-xs">
							<MdOutlineAutoAwesome className="text-white text-xl animate-spin [animation-duration:5s]" />
						</div>
					</div>

					<h4 className="text-sm font-bold text-[#1F1F1F]">
						{mode === "edit"
							? isHeader
								? "Refining form header..."
								: "Refining question..."
							: "Crafting question(s) with Gemini..."}
					</h4>

					<p className="text-xs text-[#5F6368] mt-1 font-normal">
						Generating relevant wording and optimal choices...
					</p>
				</div>
			</div>
		</div>
	);
};

AIQuestionLoadingView.propTypes = {
	mode: PropTypes.string.isRequired,
	isHeader: PropTypes.bool,
};

export default AIQuestionLoadingView;
