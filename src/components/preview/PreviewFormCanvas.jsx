import PropTypes from "prop-types";
import PreviewQuestionCard from "./PreviewQuestionCard";

const PreviewFormCanvas = ({ form }) => {
	const items = form?.items || [];

	const handleClearForm = () => {
		if (window.confirm("Clear all your answers?")) {
			window.location.reload();
		}
	};

	return (
		<div className="w-full max-w-[770px] mx-auto px-4 py-8">
			{/* Top Banner / Form Title Card */}
			<div className="w-full bg-white rounded-lg border border-[#dadce0] border-t-8 border-t-[#673ab7] p-6 shadow-sm mb-4">
				<h1 className="text-2xl md:text-3xl font-normal text-[#202124] mb-3 break-words">
					{form?.title || "Untitled form"}
				</h1>

				{form?.description && (
					<p className="text-sm text-[#202124] whitespace-pre-wrap break-words">
						{form.description}
					</p>
				)}

				<div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between text-xs text-red-500">
					<span>* Indicates required question</span>
				</div>
			</div>

			{/* Question List */}
			{items.map((item, index) => (
				<PreviewQuestionCard
					key={item._id || index}
					item={item}
				/>
			))}

			{/* Bottom Action Footer */}
			<div className="flex items-center justify-between mt-6 px-1">
				<div className="flex items-center gap-4">
					<button
						type="button"
						disabled
						className="px-6 py-2 bg-[#673ab7] text-white text-sm font-medium rounded opacity-50 cursor-not-allowed shadow-none"
						title="Submit is disabled in Preview mode"
					>
						Submit
					</button>

					<button
						type="button"
						onClick={handleClearForm}
						className="text-sm text-[#673ab7] hover:bg-purple-50 px-3 py-1.5 rounded transition duration-150 cursor-pointer"
					>
						Clear form
					</button>
				</div>

				<span className="text-xs text-gray-400 italic">
					Submit is disabled in Preview mode
				</span>
			</div>

			{/* Google Forms Disclaimer Footer */}
			<div className="text-center mt-10 text-xs text-gray-400">
				<p>This form was created inside Google Form Clone.</p>
			</div>
		</div>
	);
};

PreviewFormCanvas.propTypes = {
	form: PropTypes.shape({
		title: PropTypes.string,
		description: PropTypes.string,
		items: PropTypes.arrayOf(PropTypes.object),
	}),
};

export default PreviewFormCanvas;
