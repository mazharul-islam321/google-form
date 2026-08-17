/* eslint-disable react/prop-types */
import { useState } from "react";
import { IoMdStar, IoMdStarOutline } from "react-icons/io";
import useAuth from "../../../hooks/useAuth";
import AuthPromptModal from "../../modals/AuthPromptModal";

const StarButton = ({ star, setStar }) => {
	const { isAuthenticated } = useAuth();
	const [showAuthModal, setShowAuthModal] = useState(false);

	const handleClick = (newStarState) => {
		if (!isAuthenticated) {
			setShowAuthModal(true);
			return;
		}
		setStar(newStarState);
	};

	return (
		<>
			{star ? (
				<div
					onClick={() => handleClick(false)}
					className="p-1 rounded-full hover:bg-slate-100 cursor-pointer"
					title="Unstar form"
				>
					<IoMdStar color="#f4b400" fontSize="1.5em" />
				</div>
			) : (
				<div
					onClick={() => handleClick(true)}
					className="p-1 rounded-full hover:bg-slate-100 cursor-pointer"
					title="Star form"
				>
					<IoMdStarOutline color="#5f6368" fontSize="1.5em" />
				</div>
			)}

			<AuthPromptModal
				isOpen={showAuthModal}
				onClose={() => setShowAuthModal(false)}
				title="Sign in to star forms"
				message="Sign in to bookmark this form and access it quickly from your starred forms."
			/>
		</>
	);
};

export default StarButton;
