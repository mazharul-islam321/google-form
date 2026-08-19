import PropTypes from "prop-types";
import { BsPencil, BsTrash } from "react-icons/bs";

const FormCardMenu = ({ onRename, onDelete }) => {
	return (
		<div className="absolute right-4 top-12 w-44 bg-white rounded-lg shadow-lg border border-gray-100 py-1 z-30">
			<button
				onClick={onRename}
				className="flex items-center gap-2 w-full px-4 py-2 text-sm text-[#202124] hover:bg-gray-50"
			>
				<BsPencil className="text-gray-500" />
				<span>Rename</span>
			</button>
			<button
				onClick={onDelete}
				className="flex items-center gap-2 w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50"
			>
				<BsTrash />
				<span>Delete form</span>
			</button>
		</div>
	);
};

FormCardMenu.propTypes = {
	onRename: PropTypes.func.isRequired,
	onDelete: PropTypes.func.isRequired,
};

export default FormCardMenu;
