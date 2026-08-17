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

	const { data: form } = useGetFormByIdQuery(formId, { skip: !formId });

	return (
		<div className="w-full h-screen bg-[#F0EBF8] overflow-hidden">
			<CreateOrEditHeader
				formTitle={form?.title || "Untitled form"}
				selectedBtn={selectedTab}
				setSelectedBtn={setSelectedTab}
			/>

			{selectedTab === 0 ? (
				<CreateOrEditForm />
			) : (
				<FormResponses formId={formId} />
			)}
		</div>
	);
};

export default CreateOrEditFormPage;
