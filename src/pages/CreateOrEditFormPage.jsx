import CreateOrEditForm from "../components/createoreditform/CreateOrEditForm";
import CreateOrEditHeader from "../components/header/create-or-edit-form-header/CreateOrEditHeader";

const CreateOrEditFormPage = () => {
	return (
		<div className="w-full h-screen  bg-[#F0EBF8]  overflow-hidden">
			<CreateOrEditHeader />

			<CreateOrEditForm />
		</div>
	);
};

export default CreateOrEditFormPage;
