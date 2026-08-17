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
	const [nameSaveTrigger, setNameSaveTrigger] = useState(null);
	const [saveStatus, setSaveStatus] = useState("idle");

	const { data: form } = useGetFormByIdQuery(formId, { skip: !formId });

	const handleNameSave = (newName) => {
		setLiveName(newName);
		setNameSaveTrigger(newName);
	};

	return (
		<div className="w-full h-screen bg-[#F0EBF8] overflow-hidden">
			<CreateOrEditHeader
				formName={liveName || form?.name || "Untitled form"}
				onNameSave={handleNameSave}
				selectedBtn={selectedTab}
				setSelectedBtn={setSelectedTab}
				saveStatus={saveStatus}
			/>

			{selectedTab === 0 ? (
				<CreateOrEditForm
					nameSaveTrigger={nameSaveTrigger}
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
