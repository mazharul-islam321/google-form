import PropTypes from "prop-types";

const AddOptionRow = ({ icon, hasOther, onAddOption, onAddOther }) => {
	return (
		<div className="flex items-center py-1 select-none">
			{icon}
			<div className="flex items-center gap-1.5 ml-2 text-sm">
				<span
					onClick={onAddOption}
					className="text-[#70757a] hover:text-gray-900 cursor-pointer"
				>
					Add option
				</span>

				{!hasOther && (
					<>
						<span className="text-[#70757a]">or</span>
						<button
							type="button"
							onClick={onAddOther}
							className="text-[#1a73e8] hover:bg-blue-50 font-medium px-1.5 py-0.5 rounded cursor-pointer transition duration-150"
						>
							add &quot;Other&quot;
						</button>
					</>
				)}
			</div>
		</div>
	);
};

AddOptionRow.propTypes = {
	icon: PropTypes.node.isRequired,
	hasOther: PropTypes.bool.isRequired,
	onAddOption: PropTypes.func.isRequired,
	onAddOther: PropTypes.func.isRequired,
};

export default AddOptionRow;
