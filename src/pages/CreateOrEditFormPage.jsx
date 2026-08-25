import { useState } from "react";
import { useParams, useSearchParams, useLocation, useNavigate } from "react-router-dom";
import CreateOrEditForm from "../components/createoreditform/CreateOrEditForm";
import CreateOrEditHeader from "../components/header/create-or-edit-form-header/CreateOrEditHeader";
import FormResponses from "../components/responses/FormResponses";
import FormSettings from "../components/settings/FormSettings";
import { useGetFormByIdQuery } from "../redux/api/formApi";

const CreateOrEditFormPage = () => {
	const { id: paramId } = useParams();
	const [searchParams] = useSearchParams();
	const location = useLocation();
	const navigate = useNavigate();
	const formId = paramId || searchParams.get("id");

	// Authentic Google Forms hash-based tab navigation (#responses, #settings)
	const isResponsesTab =
		location.hash === "#responses" || searchParams.get("tab") === "responses";
	const isSettingsTab =
		location.hash === "#settings" || searchParams.get("tab") === "settings";

	let selectedTab = 0;
	if (isResponsesTab) selectedTab = 1;
	if (isSettingsTab) selectedTab = 2;

	const [liveName, setLiveName] = useState(null);
	const [saveStatus, setSaveStatus] = useState("idle");

	const { data: form } = useGetFormByIdQuery(formId, { skip: !formId });

	const handleTabChange = (tabIndex) => {
		let newHash = "";
		if (tabIndex === 1) newHash = "responses";
		if (tabIndex === 2) newHash = "settings";

		navigate(
			{
				pathname: location.pathname,
				search: location.search,
				hash: newHash,
			},
			{ replace: true }
		);
	};

	return (
		<div className="w-full h-screen bg-[#F0EBF8] overflow-hidden">
			<CreateOrEditHeader
				formId={formId}
				formName={liveName ?? form?.name ?? "Untitled form"}
				isStarred={form?.isStarred || false}
				onNameChange={setLiveName}
				onSaveStatusChange={setSaveStatus}
				selectedBtn={selectedTab}
				setSelectedBtn={handleTabChange}
				saveStatus={saveStatus}
			/>

			{selectedTab === 0 && (
				<CreateOrEditForm
					formId={formId}
					onNameChange={setLiveName}
					onSaveStatusChange={setSaveStatus}
				/>
			)}

			{selectedTab === 1 && <FormResponses formId={formId} />}

			{selectedTab === 2 && <FormSettings formId={formId} />}
		</div>
	);
};

export default CreateOrEditFormPage;
