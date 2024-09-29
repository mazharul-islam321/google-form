/* eslint-disable react/prop-types */
import {
	MdCheckBoxOutlineBlank,
	MdDragIndicator,
	MdOutlineCircle,
	MdOutlineClose,
} from "react-icons/md";

// Helper component for Short and Long Answer
const RenderAnswerOption = ({ label, hrWidth }) => (
	<>
		<p className="text-[#92969b] text-sm mb-1">{label}</p>
		<hr
			className={`border-[0.5] border-dotted border-[#92969b] ${hrWidth}`}
		/>
	</>
);

// Helper component for Options with either Radio or Checkbox
const RenderOptionWithIcon = ({ icon }) => (
	<div className="relative">
		<div className="flex items-center relative mb-3">
			<MdDragIndicator
				fontSize="1.5em"
				color="#c8cbd0"
				className="cursor-move absolute -left-5"
			/>

			{icon}

			<input
				className="flex-grow outline-none text-sm ml-2"
				defaultValue="Option 1"
			/>
			<div className="p-3 rounded-full hover:bg-slate-100 cursor-pointer">
				<MdOutlineClose fontSize="1.5em" color="#5f6368" />
			</div>
		</div>
		<div className="flex items-center">
			{icon}
			<p className="text-sm text-[#5f6368] ml-2 hover:border-b">
				Add option
			</p>
		</div>
	</div>
);

const OptionBasedDetails = ({ selectOption }) => {
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
						icon={
							<MdOutlineCircle fontSize="1.5em" color="#c8cbd0" />
						}
					/>
				);

			case "checkboxe":
				return (
					<RenderOptionWithIcon
						icon={
							<MdCheckBoxOutlineBlank
								fontSize="1.6em"
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

	return <div className="mt-4">{renderOption()}</div>;
};

export default OptionBasedDetails;
