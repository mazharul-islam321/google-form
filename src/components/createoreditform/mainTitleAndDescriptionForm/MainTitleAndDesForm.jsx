import { useState } from "react";
import LeftSideActiveLine from "../LeftSideActiveLine";
import TextFormattingIcons from "../TextFormattingIcons";
import PropTypes from "prop-types";

const MainTitleAndDesForm = ({ activeElement, register }) => {
	const [selected, setSelected] = useState(null);

	return (
		<div
			onBlur={() => setSelected(null)}
			className="relative  w-[780px] rounded-lg bg-white border border-[#DADCE0] shadow"
		>
			<div className="w-full h-[10px] bg-[rgb(103,58,183)] rounded-t-lg absolute" />

			<div className="flex pt-0.5">
				{/* Left Side Active Line */}
				<LeftSideActiveLine activeElement={activeElement} />

				<div className="pt-7 pb-5 w-full px-5">
					{/* title */}
					<div
						className={`w-full ${
							selected === 0
								? "border-[#4C2B87] border-b-[1.5px]"
								: "border-[#DADCE0] border-b"
						}`}
					>
						<input
							{...register("title")}
							onFocus={() => setSelected(0)}
							className="outline-none text-3xl pb-3 w-full"
							defaultValue={"Untitled form"}
						/>
					</div>

					{selected === 0 && <TextFormattingIcons forDes={false} />}

					{/* description */}

					<div
						className={`w-full ${
							selected === 1
								? "border-[#4C2B87] border-b-[1.5px]"
								: "border-[#DADCE0] border-b"
						}`}
					>
						<input
							{...register("description")}
							onFocus={() => setSelected(1)}
							className="pt-4 outline-none text-sm text-[#5f6368] w-full"
							defaultValue={"Form description"}
						/>
					</div>

					{selected === 1 && <TextFormattingIcons forDes={true} />}
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
