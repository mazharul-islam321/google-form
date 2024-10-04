import { useState } from "react";
import MainTitleAndDesForm from "./mainTitleAndDescriptionForm/MainTitleAndDesForm";
import UserEditForm from "./userEditForm/UserEditForm";
import TitleAndDesForm from "./generalTitleAndDescriptionForm/TitleAndDesForm";

// #4C2B87

const CreateOrEditForm = () => {
	const [selectOption, setSelectOption] = useState("multiplechoice");

	return (
		<main className="w-full h-full flex flex-col items-center pt-28 pb-20 overflow-y-scroll scroll-smooth">
			<MainTitleAndDesForm />

			<UserEditForm
				selectOption={selectOption}
				setSelectOption={setSelectOption}
			/>

			<TitleAndDesForm />
		</main>
	);
};

export default CreateOrEditForm;
