import { useState } from "react";
import PropTypes from "prop-types";
import { MdOutlineImage, MdOutlineClose } from "react-icons/md";
import MainTitleAndDesForm from "../mainTitleAndDescriptionForm/MainTitleAndDesForm";
import UserEditForm from "../userEditForm/UserEditForm";
import TitleAndDesForm from "../generalTitleAndDescriptionForm/TitleAndDesForm";
import ImagePickerModal from "../../modals/ImagePickerModal";

const FormSectionList = ({
	activeSection,
	onSectionClick,
	sectionRefs,
	register,
	control,
	setValue,
	fields,
	headerImage,
	onHeaderImageChange,
	onDeleteField,
	onDuplicateField,
}) => {
	const [isBannerModalOpen, setIsBannerModalOpen] = useState(false);

	return (
		<div className="flex flex-col gap-3">
			{/* Standalone Separated Header Banner Card if present */}
			{headerImage && (
				<div className="w-[780px] h-[160px] md:h-[180px] rounded-lg overflow-hidden bg-white border border-[#DADCE0] shadow-xs mb-2 relative group">
					<img
						src={headerImage}
						alt="Form header banner"
						className="w-full h-full object-cover"
					/>
					<div className="absolute top-3 right-3 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition duration-150">
						<button
							type="button"
							onClick={() => setIsBannerModalOpen(true)}
							className="bg-white/90 hover:bg-white text-[#202124] text-xs font-medium px-3 py-1.5 rounded-md shadow-md backdrop-blur-xs transition cursor-pointer flex items-center gap-1.5"
						>
							<MdOutlineImage className="text-base text-[#673ab7]" />
							<span>Change banner</span>
						</button>

						<button
							type="button"
							onClick={() => onHeaderImageChange?.("")}
							className="bg-white/90 hover:bg-white text-red-600 p-1.5 rounded-md shadow-md backdrop-blur-xs transition cursor-pointer"
							title="Remove banner"
						>
							<MdOutlineClose className="text-base" />
						</button>
					</div>
				</div>
			)}

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
								onDuplicate={() => onDuplicateField?.(index)}
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
								onDuplicate={() => onDuplicateField?.(index)}
								register={register}
								index={index}
							/>
						)}
					</div>
				);
			})}

			<ImagePickerModal
				isOpen={isBannerModalOpen}
				onClose={() => setIsBannerModalOpen(false)}
				currentImage={headerImage}
				title="Add Header Banner"
				removeLabel="Remove banner"
				onSave={(url) => onHeaderImageChange?.(url)}
			/>
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
	headerImage: PropTypes.string,
	onHeaderImageChange: PropTypes.func,
	onDeleteField: PropTypes.func.isRequired,
	onDuplicateField: PropTypes.func,
};

export default FormSectionList;
