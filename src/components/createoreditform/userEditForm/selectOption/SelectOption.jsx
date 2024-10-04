/* eslint-disable react/prop-types */
import { useState } from "react";
import {
	MdArrowDropDown,
	MdOutlineShortText,
	MdOutlineSubject,
	MdRadioButtonChecked,
} from "react-icons/md";
import { FaRegCheckSquare } from "react-icons/fa";
import Option from "./Option";

const SelectOption = ({ selectOption, setSelectOption }) => {
	const [showModal, setShowModal] = useState(false);

	const onModalShow = (value) => {
		setShowModal(value);
	};
	const onSelectOption = (value) => {
		setSelectOption(value);
	};

	const initialOption = SelectOptionData.find(
		(option) => option.trackId === selectOption
	);

	return (
		<div className="relative flex items-center justify-center w-60 h-12 rounded border border-[#c8cbd0]">
			<div
				onClick={() => onModalShow(true)}
				className="flex items-center justify-between w-full h-full cursor-pointer pl-2 pr-3"
			>
				<div className="flex items-center gap-3">
					{initialOption.modalIcon}
					<p className="text-sm">{initialOption.modalText}</p>
				</div>

				<MdArrowDropDown fontSize="1.5em" color="#5f6368" />
			</div>

			{showModal && (
				<div className="absolute bg-white w-full rounded border border-[#c8cbd0] py-2 ">
					<Option
						onModalShow={onModalShow}
						onSelectOption={onSelectOption}
						selectOption={selectOption}
						SelectOptionData={SelectOptionData}
					/>
				</div>
			)}
		</div>
	);
};

export default SelectOption;

const SelectOptionData = [
	{
		id: 0,
		trackId: "shortanswer",
		modalText: "Short answer",
		modalIcon: <MdOutlineShortText fontSize="1.5em" color="#5f6368" />,
	},
	{
		id: 1,
		trackId: "paragraph",
		modalText: "Paragraph",
		modalIcon: <MdOutlineSubject fontSize="1.5em" color="#5f6368" />,
	},
	{
		id: 2,
		trackId: "multiplechoice",
		modalText: "Multiple choice",
		modalIcon: <MdRadioButtonChecked fontSize="1.5em" color="#5f6368" />,
	},
	{
		id: 3,
		trackId: "checkboxe",
		modalText: "Checkboxes",
		modalIcon: <FaRegCheckSquare fontSize="1.5em" color="#5f6368" />,
	},
];
