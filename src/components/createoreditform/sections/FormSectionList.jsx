import PropTypes from "prop-types";
import MainTitleAndDesForm from "../mainTitleAndDescriptionForm/MainTitleAndDesForm";
import UserEditForm from "../userEditForm/UserEditForm";
import TitleAndDesForm from "../generalTitleAndDescriptionForm/TitleAndDesForm";

const FormSectionList = ({
	activeSection,
	onSectionClick,
	sectionRefs,
	register,
	control,
	setValue,
	fields,
	onDeleteField,
}) => {
	return (
		<div className="flex flex-col gap-1">
			{/* Main Title Form - Always present, Index 0 */}
			<div
				ref={(el) => (sectionRefs.current[0] = el)}
				onClick={() => onSectionClick(0)}
				onFocusCapture={() => onSectionClick(0)}
				className="cursor-pointer"
			>
				<MainTitleAndDesForm
					activeElement={activeSection === 0}
					register={register}
				/>
			</div>

			{/* Dynamic Question / Title Fields */}
			{fields.map((field, index) => {
				const realIndex = index + 1;
				return (
					<div
						key={field.id}
						ref={(el) => (sectionRefs.current[realIndex] = el)}
						onClick={() => onSectionClick(realIndex)}
						onFocusCapture={() => onSectionClick(realIndex)}
						className="cursor-pointer"
					>
						{field.type === "question" && (
							<UserEditForm
								activeElement={activeSection === realIndex}
								onDelete={() => onDeleteField(index)}
								register={register}
								control={control}
								setValue={setValue}
								index={index}
								questionType={field.questionType}
							/>
						)}

						{field.type === "title" && (
							<TitleAndDesForm
								activeElement={activeSection === realIndex}
								onDelete={() => onDeleteField(index)}
								register={register}
								index={index}
							/>
						)}
					</div>
				);
			})}
		</div>
	);
};

FormSectionList.propTypes = {
	activeSection: PropTypes.number.isRequired,
	onSectionClick: PropTypes.func.isRequired,
	sectionRefs: PropTypes.object.isRequired,
	register: PropTypes.func.isRequired,
	control: PropTypes.object.isRequired,
	setValue: PropTypes.func.isRequired,
	fields: PropTypes.array.isRequired,
	onDeleteField: PropTypes.func.isRequired,
};

export default FormSectionList;
