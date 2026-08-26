import { useState, useRef, useEffect } from "react";
import { useWatch } from "react-hook-form";
import PropTypes from "prop-types";
import { MdOutlineImage } from "react-icons/md";
import FormCard from "../common/FormCard";
import TtileDesFormIcons from "../TtileDesFormIcons";
import QuestionImageContainer from "../userEditForm/QuestionImageContainer";
import ImagePickerModal from "../../modals/ImagePickerModal";
import useClickOutside from "../../../hooks/useClickOutside";

const ImageSectionForm = ({
	activeElement,
	onDelete,
	onDuplicate,
	register,
	control,
	setValue,
	index,
}) => {
	const [titleFocused, setTitleFocused] = useState(false);
	const [isImageModalOpen, setIsImageModalOpen] = useState(false);
	const titleWrapperRef = useRef(null);

	const watchedImage = useWatch({
		control,
		name: `items.${index}.image`,
		defaultValue: "",
	});

	const watchedAlignment = useWatch({
		control,
		name: `items.${index}.imageAlignment`,
		defaultValue: "center",
	});

	useEffect(() => {
		if (!activeElement) {
			setTitleFocused(false);
		}
	}, [activeElement]);

	useClickOutside(
		titleWrapperRef,
		() => setTitleFocused(false),
		activeElement && titleFocused
	);

	// Automatically open image picker modal if newly inserted without an image
	useEffect(() => {
		if (activeElement && !watchedImage) {
			setIsImageModalOpen(true);
		}
	}, []); // run once on mount

	return (
		<FormCard activeElement={activeElement}>
			{/* Image Title / Caption */}
			<div className="flex items-center gap-2">
				<div
					ref={titleWrapperRef}
					onClick={() => setTitleFocused(true)}
					className={`flex-grow ${
						activeElement
							? `bg-slate-100 ${
									titleFocused
										? "border-[#4C2B87] border-b-[1.5px]"
										: "border-[#9ea0a4] border-b"
							  }`
							: "bg-transparent border-transparent border-b"
					}`}
				>
					<input
						{...register(`items.${index}.title`)}
						onFocus={(e) => {
							setTitleFocused(true);
							e.target.select();
						}}
						onClick={() => setTitleFocused(true)}
						className={`w-full outline-none text-base bg-transparent ${
							activeElement
								? "py-3 pl-2 hover:bg-slate-200"
								: "py-0 pl-0 cursor-pointer font-normal text-[#202124]"
						}`}
						defaultValue={"Image title"}
						placeholder="Image title"
					/>
				</div>

				{/* Copy & Delete Icons at top right for active image card */}
				{activeElement && (
					<TtileDesFormIcons
						onDelete={onDelete}
						onDuplicate={onDuplicate}
					/>
				)}
			</div>

			{/* Image Display */}
			{watchedImage ? (
				<QuestionImageContainer
					image={watchedImage}
					alignment={watchedAlignment || "center"}
					onAlignmentChange={(newAlign) =>
						setValue?.(`items.${index}.imageAlignment`, newAlign, {
							shouldDirty: true,
						})
					}
					onChangeImage={() => setIsImageModalOpen(true)}
					onRemoveImage={() =>
						setValue?.(`items.${index}.image`, "", {
							shouldDirty: true,
						})
					}
					activeElement={activeElement}
				/>
			) : (
				/* Placeholder upload prompt if no image is selected yet */
				<div
					onClick={() => setIsImageModalOpen(true)}
					className="w-full my-4 py-8 border-2 border-dashed border-gray-300 hover:border-[#673ab7] rounded-xl flex flex-col items-center justify-center gap-2 cursor-pointer bg-slate-50 hover:bg-purple-50/40 transition duration-150"
				>
					<div className="w-12 h-12 bg-purple-100 text-[#673ab7] rounded-full flex items-center justify-center text-2xl">
						<MdOutlineImage />
					</div>
					<p className="text-sm font-medium text-[#202124]">
						Click to add an image
					</p>
					<p className="text-xs text-gray-400">
						Upload from computer or paste an image URL
					</p>
				</div>
			)}

			{/* Image Picker Modal */}
			<ImagePickerModal
				isOpen={isImageModalOpen}
				onClose={() => setIsImageModalOpen(false)}
				currentImage={watchedImage}
				title="Add Image"
				removeLabel="Remove image"
				onSave={(url) =>
					setValue?.(`items.${index}.image`, url, {
						shouldDirty: true,
					})
				}
			/>
		</FormCard>
	);
};

ImageSectionForm.propTypes = {
	activeElement: PropTypes.bool,
	onDelete: PropTypes.func,
	onDuplicate: PropTypes.func,
	register: PropTypes.func,
	control: PropTypes.object,
	setValue: PropTypes.func,
	index: PropTypes.number,
};

export default ImageSectionForm;
