import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import CreateOrEditForm from "../components/createoreditform/CreateOrEditForm";
import CreateOrEditHeader from "../components/header/create-or-edit-form-header/CreateOrEditHeader";
import FormResponses from "../components/responses/FormResponses";
import { useGetFormByIdQuery } from "../redux/api/formApi";

const CreateOrEditFormPage = () => {
	const [searchParams] = useSearchParams();
	const formId = searchParams.get("id");
	const [selectedTab, setSelectedTab] = useState(0);
	const [liveName, setLiveName] = useState("Untitled form");
	const [saveStatus, setSaveStatus] = useState("idle");

	const { data: form } = useGetFormByIdQuery(formId, { skip: !formId });

	return (
		<div className="w-full h-screen bg-[#F0EBF8] overflow-hidden">
			<CreateOrEditHeader
				formId={formId}
				formName={liveName || form?.name || "Untitled form"}
				onNameChange={setLiveName}
				onSaveStatusChange={setSaveStatus}
				selectedBtn={selectedTab}
				setSelectedBtn={setSelectedTab}
				saveStatus={saveStatus}
			/>

			{selectedTab === 0 ? (
				<CreateOrEditForm
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
