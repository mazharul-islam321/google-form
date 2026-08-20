/* eslint-disable react/prop-types */

import { MdCheckBoxOutlineBlank, MdOutlineCircle } from "react-icons/md";
import RenderOptionWithIcon from "./RenderOptionWithIcon";

// Helper component for Short and Long Answer
const RenderAnswerOption = ({ label, hrWidth }) => (
	<div className="mt-4">
		<p className="text-[#92969b] text-sm mb-1">{label}</p>
		<hr
			className={`border-[0.5] border-dotted border-[#92969b] ${hrWidth}`}
		/>
	</div>
);

const OptionBasedDetails = ({
	selectOption,
	activeElement = true,
	control,
	register,
	setValue,
	index,
	onOptionFocus,
}) => {
	const renderOption = () => {
		switch (selectOption) {
			case "shortanswer":
				return (
					<RenderAnswerOption
						label="Short answer text"
						hrWidth="w-1/2"
					/>
				);

			case "paragraph":
				return (
					<RenderAnswerOption
						label="Long answer text"
						hrWidth="w-5/6"
					/>
				);

			case "multiplechoice":
				return (
					<RenderOptionWithIcon
						activeElement={activeElement}
						control={control}
						register={register}
						setValue={setValue}
						index={index}
						onOptionFocus={onOptionFocus}
						icon={
							<MdOutlineCircle fontSize="1.5em" color="#c8cbd0" />
						}
					/>
				);

			case "checkbox":
				return (
					<RenderOptionWithIcon
						activeElement={activeElement}
						control={control}
						register={register}
						setValue={setValue}
						index={index}
						onOptionFocus={onOptionFocus}
						icon={
							<MdCheckBoxOutlineBlank
								fontSize="1.5em"
								color="#c8cbd0"
							/>
						}
					/>
				);

			default:
				return (
					<p className="text-[#92969b] text-sm">
						Select an option to display details
					</p>
				);
		}
	};

	return <>{renderOption()}</>;
};

export default OptionBasedDetails;
