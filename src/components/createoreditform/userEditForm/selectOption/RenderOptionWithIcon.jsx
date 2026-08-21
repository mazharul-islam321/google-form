/* eslint-disable react/prop-types */
import { useState } from "react";
import { useWatch } from "react-hook-form";
import { MdDragIndicator, MdOutlineClose } from "react-icons/md";

const RenderOptionWithIcon = ({
	icon,
	activeElement = true,
	control,
	register,
	setValue,
	index,
	onOptionFocus,
}) => {
	const [selected, setSelected] = useState(null);
	const [isHover, setIsHover] = useState(null);

	const watchedOptions = useWatch({
		control,
		name: `items.${index}.options`,
		defaultValue: ["Option 1"],
	});

	const options =
		Array.isArray(watchedOptions) && watchedOptions.length > 0
			? watchedOptions
			: ["Option 1"];

	const addOption = (e) => {
		e.preventDefault();
		e.stopPropagation();
		const nextOptionNumber = options.length + 1;
		const updated = [...options, `Option ${nextOptionNumber}`];
		if (setValue) {
			setValue(`items.${index}.options`, updated, { shouldDirty: true });
		}
		setSelected(options.length);
		onOptionFocus?.();
	};

	const removeOption = (e, optIdx) => {
		e.preventDefault();
		e.stopPropagation();
		if (options.length > 1) {
			const updated = options.filter((_, i) => i !== optIdx);
			if (setValue) {
				setValue(`items.${index}.options`, updated, {
					shouldDirty: true,
				});
			}
		}
	};

	return (
		<div className="mt-2 flex flex-col gap-1.5">
			{options.map((optionText, optIdx) => (
				<div
					onMouseEnter={() => setIsHover(optIdx)}
					onMouseLeave={() => setIsHover(null)}
					className="flex items-center relative py-0.5"
					key={optIdx}
				>
					{activeElement && isHover === optIdx && (
						<MdDragIndicator
							fontSize="1.2em"
							color="#c8cbd0"
							className="cursor-move absolute -left-5"
						/>
					)}

					{icon}

					<div
						className={`flex-grow mx-2 ${
							activeElement
								? selected === optIdx
									? "border-[#4C2B87] border-b-[1.5px]"
									: isHover === optIdx
										? "border-[#DADCE0] border-b"
										: "border-transparent border-b"
								: "border-transparent border-b"
						}`}
					>
						<input
							{...(register
								? register(`items.${index}.options.${optIdx}`)
								: {})}
							onFocus={(e) => {
								setSelected(optIdx);
								onOptionFocus?.();
								e.target.select();
							}}
							onBlur={() => setSelected(null)}
							onClick={(e) => {
								e.stopPropagation();
								setSelected(optIdx);
								onOptionFocus?.();
							}}
							className={`flex-grow outline-none text-sm py-1.5 w-full bg-transparent ${
								!activeElement ? "cursor-pointer" : ""
							}`}
							defaultValue={optionText}
							placeholder={`Option ${optIdx + 1}`}
						/>
					</div>

					{activeElement && (
						<div
							className={`p-1.5 rounded-full hover:bg-slate-100 cursor-pointer ${
								options.length > 1 ? "block" : "invisible"
							}`}
							onClick={(e) => removeOption(e, optIdx)}
						>
							<MdOutlineClose fontSize="1.3em" color="#5f6368" />
						</div>
					)}
				</div>
			))}

			{activeElement && (
				<div
					onClick={addOption}
					className="flex items-center mt-2 py-1 cursor-pointer group"
				>
					{icon}
					<p className="text-sm text-[#5f6368] ml-2 group-hover:text-gray-900 group-hover:border-b border-gray-400">
						Add option
					</p>
				</div>
			)}
		</div>
	);
};

export default RenderOptionWithIcon;
