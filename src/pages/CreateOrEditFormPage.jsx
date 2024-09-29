// import { useState } from "react";
import CreateOrEditForm from "../components/createoreditform/CreateOrEditForm";
import CreateOrEditHeader from "../components/header/CreateOrEditHeader";

const CreateOrEditFormPage = () => {
	// 	const [activeElement, setActiveElement] = useState("");

	//   const handleClick = (value) => {
	//     if (value === activeElement) {
	//       setActiveElement("");
	//     } else {
	//       setActiveElement(value);
	//     }
	//   };

	return (
		<div className="w-full h-screen  bg-[#F0EBF8]  overflow-hidden">
			<CreateOrEditHeader />

			<CreateOrEditForm />
		</div>
	);
};

export default CreateOrEditFormPage;
