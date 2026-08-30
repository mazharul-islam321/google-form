import { MdOutlineAutoAwesome } from "react-icons/md";

const AILoadingView = () => {
	return (
		<div className="flex-1 flex flex-col items-center justify-center text-center px-6 py-12">
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
	);
};

export default AILoadingView;
