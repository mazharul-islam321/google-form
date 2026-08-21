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
	isStarred = false,
	onNameChange,
	selectedBtn = 0,
	setSelectedBtn,
	saveStatus = "idle",
	onSaveStatusChange,
}) => {
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

					<StarButton formId={formId} isStarred={isStarred} />

					<SaveStatusIndicator saveStatus={saveStatus} />
				</div>

				<div className="flex items-center gap-3">
					<HeaderIcons formId={formId} formName={formName} />
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
	isStarred: PropTypes.bool,
	onNameChange: PropTypes.func,
	selectedBtn: PropTypes.number,
	setSelectedBtn: PropTypes.func,
	saveStatus: PropTypes.string,
	onSaveStatusChange: PropTypes.func,
};

export default CreateOrEditHeader;
