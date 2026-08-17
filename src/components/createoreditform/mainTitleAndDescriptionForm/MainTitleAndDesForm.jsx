import { useState, useEffect } from "react";
import LeftSideActiveLine from "../LeftSideActiveLine";
import TextFormattingIcons from "../TextFormattingIcons";
import PropTypes from "prop-types";

const MainTitleAndDesForm = ({ activeElement, register }) => {
	const [selected, setSelected] = useState(0);

	useEffect(() => {
		if (!activeElement) {
			setSelected(null);
		} else if (selected === null) {
			setSelected(0);
		}
	}, [activeElement]);

	return (
		<div
			className={`relative w-[780px] rounded-lg bg-white border ${
				activeElement
					? "border-[#DADCE0] shadow-md"
					: "border-[#e0e0e0] shadow-xs"
			} transition-all duration-150`}
		>
			<div className="w-full h-[10px] bg-[rgb(103,58,183)] rounded-t-lg absolute" />

			<div className="flex pt-0.5">
				{/* Left Side Active Line */}
				<LeftSideActiveLine activeElement={activeElement} />

				<div className="pt-7 pb-5 w-full px-5">
					{/* title */}
					<div
						onClick={() => setSelected(0)}
						className={`w-full ${
							activeElement
								? selected === 0
									? "border-[#4C2B87] border-b-[1.5px]"
									: "border-[#DADCE0] border-b"
								: "border-transparent border-b"
						}`}
					>
						<input
							{...register("title")}
							onFocus={() => setSelected(0)}
							onClick={() => setSelected(0)}
							className={`outline-none text-3xl pb-2 w-full bg-transparent font-normal ${
								!activeElement ? "cursor-pointer" : ""
							}`}
							defaultValue={"Untitled form"}
						/>
					</div>

					{activeElement && selected === 0 && (
						<TextFormattingIcons forDes={false} />
					)}

					{/* description */}
					<div
						onClick={() => setSelected(1)}
						className={`w-full ${
							activeElement
								? selected === 1
									? "border-[#4C2B87] border-b-[1.5px]"
									: "border-[#DADCE0] border-b"
								: "border-transparent border-b"
						}`}
					>
						<input
							{...register("description")}
							onFocus={() => setSelected(1)}
							onClick={() => setSelected(1)}
							className={`pt-3 outline-none text-sm text-[#5f6368] w-full bg-transparent ${
								!activeElement ? "cursor-pointer" : ""
							}`}
							defaultValue={"Form description"}
						/>
					</div>

					{activeElement && selected === 1 && (
						<TextFormattingIcons forDes={true} />
					)}
				</div>
			</div>
		</div>
	);
};

MainTitleAndDesForm.propTypes = {
	activeElement: PropTypes.bool,
	register: PropTypes.func,
};

export default MainTitleAndDesForm;
