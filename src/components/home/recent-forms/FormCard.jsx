import PropTypes from "prop-types";
import { BsThreeDotsVertical } from "react-icons/bs";
import { Link } from "react-router-dom";
import form_logo from "../../../assets/form-logo.png";

const FormCard = ({ form, isMenuOpen, onMenuToggle }) => {
	return (
		<div className="relative">
			<Link
				to={`/create_or_edit?id=${form._id}`}
				className="flex items-center justify-between w-full h-14 rounded-xl cursor-pointer hover:bg-purple-50 px-4 transition duration-150 border border-transparent hover:border-purple-100"
			>
				{/* Left: icon + title */}
				<div className="flex items-center min-w-0">
					<img
						src={form_logo}
						alt="form icon"
						className="w-5 h-5 block rounded-sm mr-4 flex-shrink-0"
					/>
					<span className="text-[#202124] font-medium text-sm md:text-base truncate">
						{form.name || form.title || "Untitled form"}
					</span>
				</div>

				{/* Right: timestamp + 3-dot button */}
				<div className="flex items-center gap-4 flex-shrink-0">
					<span className="text-xs md:text-sm font-light text-[#5F6368]">
						{new Date(form.updatedAt).toLocaleDateString(undefined, {
							month: "short",
							day: "numeric",
							hour: "2-digit",
							minute: "2-digit",
						})}
					</span>

					<button
						type="button"
						onClick={(e) => {
							e.preventDefault();
							e.stopPropagation();
							onMenuToggle(form._id);
						}}
						className="p-2 rounded-full hover:bg-slate-200 cursor-pointer focus:outline-none"
					>
						<BsThreeDotsVertical fontSize="1.2em" color="#5f6368" />
					</button>
				</div>
			</Link>

			{/* Dropdown menu rendered by parent when open */}
			{isMenuOpen && (
				<slot name="menu" />
			)}
		</div>
	);
};

FormCard.propTypes = {
	form: PropTypes.shape({
		_id: PropTypes.string.isRequired,
		name: PropTypes.string,
		title: PropTypes.string,
		updatedAt: PropTypes.string,
	}).isRequired,
	isMenuOpen: PropTypes.bool,
	onMenuToggle: PropTypes.func.isRequired,
};

export default FormCard;
