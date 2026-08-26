import { useState } from "react";
import PropTypes from "prop-types";
import { LuEye } from "react-icons/lu";
import { GrRedo, GrUndo } from "react-icons/gr";
import { IoColorPaletteOutline } from "react-icons/io5";
import useAuth from "../../../hooks/useAuth";
import AuthPromptModal from "../../modals/AuthPromptModal";
import ShareFormModal from "../../modals/ShareFormModal";
import ImagePickerModal from "../../modals/ImagePickerModal";
import {
	useGetFormByIdQuery,
	useUpdateFormMutation,
} from "../../../redux/api/formApi";

const HeaderIcons = ({
	formId,
	formName = "Untitled form",
	headerImage = "",
	onHeaderImageChange,
}) => {
	const { isAuthenticated } = useAuth();
	const [showShareModal, setShowShareModal] = useState(false);
	const [showBannerModal, setShowBannerModal] = useState(false);
	const [modalConfig, setModalConfig] = useState({
		isOpen: false,
		title: "",
		message: "",
	});

	const { data: form } = useGetFormByIdQuery(formId, { skip: !formId });
	const [updateForm] = useUpdateFormMutation();

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

	const handleSaveBanner = async (bannerUrl) => {
		onHeaderImageChange?.(bannerUrl);
		if (formId) {
			try {
				await updateForm({
					id: formId,
					headerImage: bannerUrl,
				}).unwrap();
			} catch (err) {
				console.error("Failed to update banner image:", err);
			}
		}
	};

	return (
		<>
			<div className="flex items-center">
				{/* Customize Banner / Theme Icon */}
				<div
					onClick={() => setShowBannerModal(true)}
					className="p-3 rounded-full hover:bg-slate-100 cursor-pointer"
					title="Customize header banner"
				>
					<IoColorPaletteOutline fontSize="1.5em" color="#5f6368" />
				</div>

				{/* Preview Icon */}
				<div
					onClick={() => handleAction("preview")}
					className="p-3 rounded-full hover:bg-slate-100 cursor-pointer ml-1"
					title={
						isAuthenticated
							? "Preview form"
							: "Sign in to preview form"
					}
				>
					<LuEye fontSize="1.5em" color="#5f6368" />
				</div>

				{/* Undo / Redo */}
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

				{/* Share Button */}
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

			<ImagePickerModal
				isOpen={showBannerModal}
				onClose={() => setShowBannerModal(false)}
				currentImage={headerImage || form?.headerImage || ""}
				title="Add Header Banner"
				removeLabel="Remove banner"
				onSave={handleSaveBanner}
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
	headerImage: PropTypes.string,
	onHeaderImageChange: PropTypes.func,
};

export default HeaderIcons;
