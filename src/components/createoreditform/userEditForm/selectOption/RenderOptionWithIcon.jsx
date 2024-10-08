/* eslint-disable react/prop-types */
import { useEffect, useRef, useState } from "react";
import { MdDragIndicator, MdOutlineClose } from "react-icons/md";

const RenderOptionWithIcon = ({ icon }) => {
	const inputRefs = useRef({});
	const [selected, setSelected] = useState(null);
	const [isHover, setIsHover] = useState(null);
	const [options, setOptions] = useState([
		{ id: Date.now(), value: "Option 1" },
	]);

	const addOption = () => {
		const newOption = {
			id: Date.now(),
			value: `Option ${options.length + 1}`,
		};
		setOptions((prevOptions) => [...prevOptions, newOption]);
		setSelected(newOption.id); // Automatically select the newly added option
	};

	const removeOption = (id) => {
		setOptions(options.filter((option) => option.id !== id));
	};

	// Effect to select text in the input when it is selected
	useEffect(() => {
		if (selected && inputRefs.current[selected]) {
			inputRefs.current[selected].focus(); // Focus the input
			inputRefs.current[selected].select(); // Select the input text
		}
	}, [selected]); // Run effect when selected changes

	return (
		<div className="mt-1">
			{options.map((option) => (
				<div
					onMouseEnter={() => setIsHover(option.id)}
					onMouseLeave={() => setIsHover(null)}
					className="flex items-center relative"
					key={option.id}
				>
					{isHover === option.id && (
						<MdDragIndicator
							fontSize="1.2em"
							color="#c8cbd0"
							className="cursor-move absolute -left-5"
						/>
					)}

					{icon}

					<div
						className={`flex-grow mx-2 ${
							selected === option.id
								? "border-[#4C2B87] border-b-[1.5px]"
								: isHover === option.id
								? "border-[#DADCE0] border-b"
								: "border-transparent border-b"
						}`}
					>
						<input
							ref={(el) => (inputRefs.current[option.id] = el)}
							onFocus={() => setSelected(option.id)}
							onBlur={() => setSelected(null)}
							className="flex-grow outline-none text-sm pb-1"
							defaultValue={option.value}
						/>
					</div>

					<div
						className={`p-3 rounded-full hover:bg-slate-100 cursor-pointer ${
							options.length > 1 ? "block" : "invisible"
						}`}
						onClick={() => removeOption(option.id)}
					>
						<MdOutlineClose fontSize="1.5em" color="#5f6368" />
					</div>
				</div>
			))}

			<div onClick={addOption} className="flex items-center mt-3">
				{icon}
				<p className="text-sm text-[#5f6368] ml-2 hover:border-b">
					Add option
				</p>
			</div>
		</div>
	);
};

export default RenderOptionWithIcon;
