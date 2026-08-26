import PropTypes from "prop-types";
import { SiGooglesheets } from "react-icons/si";
import { BsTrash } from "react-icons/bs";

const ResponsesHeader = ({
	totalResponses,
	formTitle,
	onExportCSV,
	onDeleteAllClick,
}) => {
	return (
		<div className="flex items-center justify-between border-b border-gray-100 pb-5 mb-6">
			<div>
				<h2 className="text-2xl font-bold text-gray-900">
					{totalResponses}{" "}
					{totalResponses === 1 ? "Response" : "Responses"}
				</h2>
				<p className="text-xs text-gray-500 mt-1">
					{formTitle || "Form"} responses list
				</p>
			</div>

			{totalResponses > 0 && (
				<div className="flex items-center gap-2.5">
					<button
						type="button"
						onClick={onExportCSV}
						className="flex items-center gap-1.5 px-3.5 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 rounded-lg text-xs font-semibold shadow-2xs transition duration-150 cursor-pointer"
						title="Download responses as CSV file"
					>
						<SiGooglesheets className="text-base text-emerald-600" />
						<span>Download .CSV</span>
					</button>

					<button
						type="button"
						onClick={onDeleteAllClick}
						className="flex items-center gap-1.5 px-3 py-1.5 text-red-600 hover:text-red-700 hover:bg-red-50 border border-red-200 rounded-lg text-xs font-semibold transition duration-150 cursor-pointer"
						title="Delete all responses"
					>
						<BsTrash className="text-sm" />
						<span>Delete all</span>
					</button>
				</div>
			)}
		</div>
	);
};

ResponsesHeader.propTypes = {
	totalResponses: PropTypes.number.isRequired,
	formTitle: PropTypes.string,
	onExportCSV: PropTypes.func.isRequired,
	onDeleteAllClick: PropTypes.func.isRequired,
};

export default ResponsesHeader;
