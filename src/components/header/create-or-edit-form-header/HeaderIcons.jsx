import { useState } from "react";
import PropTypes from "prop-types";
import { LuEye } from "react-icons/lu";
import { GrRedo, GrUndo } from "react-icons/gr";
import useAuth from "../../../hooks/useAuth";
import AuthPromptModal from "../../modals/AuthPromptModal";
import ShareFormModal from "../../modals/ShareFormModal";

const HeaderIcons = ({ formId, formName = "Untitled form" }) => {
	const { isAuthenticated } = useAuth();
	const [showShareModal, setShowShareModal] = useState(false);
	const [modalConfig, setModalConfig] = useState({
		isOpen: false,
		title: "",
		message: "",
	});

	const handleAction = (actionType) => {
		if (!isAuthenticated) {
			if (actionType === "share") {
				setModalConfig({
					isOpen: true,
					title: "Sign in to share",
					message:
						"You need to be signed in to generate a shareable link and collect responses.",
				});
			} else if (actionType === "preview") {
				setModalConfig({
					isOpen: true,
					title: "Sign in to preview",
					message: "Sign in to preview the live form.",
				});
			}
			return;
		}

		if (actionType === "preview") {
			if (formId) {
				window.open(`/forms/${formId}/preview`, "_blank");
			} else {
				alert("Please wait until the form is saved before previewing.");
			}
		} else if (actionType === "share") {
			if (formId) {
				setShowShareModal(true);
			} else {
				alert("Please wait until the form is saved before sharing.");
			}
		}
	};

	return (
		<>
			<div className="flex items-center">
				<div
					onClick={() => handleAction("preview")}
					className="p-3 rounded-full hover:bg-slate-100 cursor-pointer"
					title={
						isAuthenticated
							? "Preview form"
							: "Sign in to preview form"
					}
				>
					<LuEye fontSize="1.5em" color="#5f6368" />
				</div>
				<div
					className="p-3 rounded-full hover:bg-slate-100 cursor-pointer mx-1"
					title="Undo"
				>
					<GrUndo color="#5f6368" fontSize="1.5em" />
				</div>
				<div
					className="p-3 rounded-full hover:bg-slate-100 cursor-pointer"
					title="Redo"
				>
					<GrRedo color="#5f6368" fontSize="1.5em" />
				</div>
				<button
					type="button"
					onClick={() => handleAction("share")}
					className="py-1.5 px-5 rounded bg-[#673ab7] hover:bg-[#5a2ea6] mx-5 cursor-pointer text-white font-medium text-sm shadow-sm transition duration-150"
				>
					Share
				</button>
			</div>

			<ShareFormModal
				isOpen={showShareModal}
				onClose={() => setShowShareModal(false)}
				formId={formId}
				formTitle={formName}
			/>

			<AuthPromptModal
				isOpen={modalConfig.isOpen}
				onClose={() =>
					setModalConfig((prev) => ({ ...prev, isOpen: false }))
				}
				title={modalConfig.title}
				message={modalConfig.message}
			/>
		</>
	);
};

HeaderIcons.propTypes = {
	formId: PropTypes.string,
	formName: PropTypes.string,
};

export default HeaderIcons;
