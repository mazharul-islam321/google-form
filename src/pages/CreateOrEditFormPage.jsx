import { useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import CreateOrEditForm from "../components/createoreditform/CreateOrEditForm";
import CreateOrEditHeader from "../components/header/create-or-edit-form-header/CreateOrEditHeader";
import FormResponses from "../components/responses/FormResponses";
import { useGetFormByIdQuery } from "../redux/api/formApi";

const CreateOrEditFormPage = () => {
	const { id: paramId } = useParams();
	const [searchParams] = useSearchParams();
	const formId = paramId || searchParams.get("id");
	const [selectedTab, setSelectedTab] = useState(0);
	const [liveName, setLiveName] = useState(null);
	const [saveStatus, setSaveStatus] = useState("idle");

	const { data: form } = useGetFormByIdQuery(formId, { skip: !formId });

	return (
		<div className="w-full h-screen bg-[#F0EBF8] overflow-hidden">
			<CreateOrEditHeader
				formId={formId}
				formName={liveName ?? form?.name ?? "Untitled form"}
				isStarred={form?.isStarred || false}
				onNameChange={setLiveName}
				onSaveStatusChange={setSaveStatus}
				selectedBtn={selectedTab}
				setSelectedBtn={setSelectedTab}
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
