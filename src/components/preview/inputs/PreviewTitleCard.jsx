import PropTypes from "prop-types";

const PreviewTitleCard = ({ title, description }) => {
	return (
		<div className="w-full bg-white rounded-lg border border-[#dadce0] p-6 shadow-sm mb-4">
			<h3 className="text-xl font-normal text-[#202124] mb-2">
				{title || "Untitled title"}
			</h3>
			{description && (
				<p className="text-sm text-[#5f6368] whitespace-pre-wrap leading-relaxed">
					{description}
				</p>
			)}
		</div>
	);
};

PreviewTitleCard.propTypes = {
	title: PropTypes.string,
	description: PropTypes.string,
};

export default PreviewTitleCard;
