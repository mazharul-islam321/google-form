import { useState } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import LogoImage from "../../logo/LogoImage";
import Profile from "../Profile";
import StarButton from "./StarButton";
import HeaderIcons from "./HeaderIcons";
import TabNavigation from "./TabNavigation";
import DocumentTitleInput from "./DocumentTitleInput";
import SaveStatusIndicator from "./SaveStatusIndicator";

const CreateOrEditHeader = ({
	formId,
	formName = "Untitled form",
	onNameChange,
	selectedBtn = 0,
	setSelectedBtn,
	saveStatus = "idle",
	onSaveStatusChange,
}) => {
	const [star, setStar] = useState(false);

	return (
		<header className="border-b border-[#DADCE0] w-full fixed z-40 bg-white shadow-sm">
			<div className="flex items-center justify-between px-5 py-2">
				<div className="flex items-center">
					<Link to="/">
						<LogoImage />
					</Link>

					<DocumentTitleInput
						formId={formId}
						formName={formName}
						onNameChange={onNameChange}
						onSaveStatusChange={onSaveStatusChange}
					/>

					<StarButton star={star} setStar={setStar} />

					<SaveStatusIndicator saveStatus={saveStatus} />
				</div>

				<div className="flex items-center gap-3">
					<HeaderIcons />
					<Profile />
				</div>
			</div>

			<TabNavigation
				selectedBtn={selectedBtn}
				setSelectedBtn={setSelectedBtn}
			/>
		</header>
	);
};

CreateOrEditHeader.propTypes = {
	formId: PropTypes.string,
	formName: PropTypes.string,
	onNameChange: PropTypes.func,
	selectedBtn: PropTypes.number,
	setSelectedBtn: PropTypes.func,
	saveStatus: PropTypes.string,
	onSaveStatusChange: PropTypes.func,
};

export default CreateOrEditHeader;
