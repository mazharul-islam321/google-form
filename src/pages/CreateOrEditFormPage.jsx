import { useState } from "react";
import { useParams, useSearchParams, useLocation, useNavigate } from "react-router-dom";
import CreateOrEditForm from "../components/createoreditform/CreateOrEditForm";
import CreateOrEditHeader from "../components/header/create-or-edit-form-header/CreateOrEditHeader";
import FormResponses from "../components/responses/FormResponses";
import { useGetFormByIdQuery } from "../redux/api/formApi";

const CreateOrEditFormPage = () => {
	const { id: paramId } = useParams();
	const [searchParams] = useSearchParams();
	const location = useLocation();
	const navigate = useNavigate();
	const formId = paramId || searchParams.get("id");

	// Authentic Google Forms hash-based tab navigation (#responses)
	const isResponsesTab =
		location.hash === "#responses" || searchParams.get("tab") === "responses";
	const selectedTab = isResponsesTab ? 1 : 0;

	const [liveName, setLiveName] = useState(null);
	const [saveStatus, setSaveStatus] = useState("idle");

	const { data: form } = useGetFormByIdQuery(formId, { skip: !formId });

	const handleTabChange = (tabIndex) => {
		if (tabIndex === 1) {
			navigate(
				{
					pathname: location.pathname,
					search: location.search,
					hash: "responses",
				},
				{ replace: true }
			);
		} else {
			navigate(
				{
					pathname: location.pathname,
					search: location.search,
					hash: "",
				},
				{ replace: true }
			);
		}
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

			{selectedTab === 0 ? (
				<CreateOrEditForm
					formId={formId}
					onNameChange={setLiveName}
					onSaveStatusChange={setSaveStatus}
				/>
			) : (
				<FormResponses formId={formId} />
			)}
		</div>
	);
};

export default CreateOrEditFormPage;
