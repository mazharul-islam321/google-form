import { useState } from "react";
import PropTypes from "prop-types";
import { useWatch } from "react-hook-form";
import OptionItem from "./OptionItem";
import OtherOptionItem from "./OtherOptionItem";
import AddOptionRow from "./AddOptionRow";

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
	const [hoverIdx, setHoverIdx] = useState(null);

	const watchedOptions = useWatch({
		control,
		name: `items.${index}.options`,
		defaultValue: ["Option 1"],
	});

	const options =
		Array.isArray(watchedOptions) && watchedOptions.length > 0
			? watchedOptions
			: ["Option 1"];

	const hasOther = options.some(
		(opt) => opt === "__OTHER__" || opt === "Other..."
	);

	const handleAddOption = (e) => {
		e.preventDefault();
		e.stopPropagation();

		let updated;
		if (hasOther) {
			const otherIdx = options.findIndex(
				(opt) => opt === "__OTHER__" || opt === "Other..."
			);
			const normalCount = options.filter(
				(opt) => opt !== "__OTHER__" && opt !== "Other..."
			).length;
			updated = [
				...options.slice(0, otherIdx),
				`Option ${normalCount + 1}`,
				...options.slice(otherIdx),
			];
			setSelected(otherIdx);
		} else {
			updated = [...options, `Option ${options.length + 1}`];
			setSelected(options.length);
		}

		setValue?.(`items.${index}.options`, updated, { shouldDirty: true });
		onOptionFocus?.();
	};

	const handleAddOther = (e) => {
		e.preventDefault();
		e.stopPropagation();
		if (hasOther) return;

		const updated = [...options, "__OTHER__"];
		setValue?.(`items.${index}.options`, updated, { shouldDirty: true });
		onOptionFocus?.();
	};

	const handleRemoveOption = (e, optIdx) => {
		e.preventDefault();
		e.stopPropagation();
		if (options.length > 1) {
			const updated = options.filter((_, i) => i !== optIdx);
			setValue?.(`items.${index}.options`, updated, { shouldDirty: true });
		}
	};

	return (
		<div className="mt-2 flex flex-col gap-1.5">
			{options.map((optionText, optIdx) => {
				const isOther =
					optionText === "__OTHER__" || optionText === "Other...";

				if (isOther) {
					return (
						<OtherOptionItem
							key={optIdx}
							icon={icon}
							activeElement={activeElement}
							isHover={hoverIdx === optIdx}
							onMouseEnter={() => setHoverIdx(optIdx)}
							onMouseLeave={() => setHoverIdx(null)}
							onRemove={(e) => handleRemoveOption(e, optIdx)}
						/>
					);
				}

				return (
					<OptionItem
						key={optIdx}
						icon={icon}
						optionText={optionText}
						optIdx={optIdx}
						totalOptions={options.length}
						activeElement={activeElement}
						isSelected={selected === optIdx}
						isHover={hoverIdx === optIdx}
						onMouseEnter={() => setHoverIdx(optIdx)}
						onMouseLeave={() => setHoverIdx(null)}
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
						onRemove={(e) => handleRemoveOption(e, optIdx)}
						register={register}
						index={index}
					/>
				);
			})}

			{activeElement && (
				<AddOptionRow
					icon={icon}
					hasOther={hasOther}
					onAddOption={handleAddOption}
					onAddOther={handleAddOther}
				/>
			)}
		</div>
	);
};

RenderOptionWithIcon.propTypes = {
	icon: PropTypes.node.isRequired,
	activeElement: PropTypes.bool,
	control: PropTypes.object,
	register: PropTypes.func,
	setValue: PropTypes.func,
	index: PropTypes.number.isRequired,
	onOptionFocus: PropTypes.func,
};

export default RenderOptionWithIcon;
