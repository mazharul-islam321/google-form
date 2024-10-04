import LeftSideActiveLine from "../LeftSideActiveLine";
import RightSideIconBar from "../RightSideIconBar";
import TextFormattingIcons from "../TextFormattingIcons";

const MainTitleAndDesForm = () => {
	// 	const [activeElement, setActiveElement] = useState("");

	//   const handleClick = (value) => {
	//     if (value === activeElement) {
	//       setActiveElement("");
	//     } else {
	//       setActiveElement(value);
	//     }
	//   };

	return (
		<div className="relative  w-[780px] rounded-lg bg-white border border-[#DADCE0] shadow">
			<div className="w-full h-[10px] bg-[rgb(103,58,183)] rounded-t-lg absolute" />
			<RightSideIconBar />

			<div className="flex pt-0.5">
				{/* Left Side Active Line */}
				<LeftSideActiveLine />

				<div className="pt-7 pb-5 w-full px-5">
					{/* title */}
					<input
						className="outline-none text-3xl mb-3  w-full"
						defaultValue={"Untitled form"}
					/>
					<div className="h-[1.5px] w-full bg-[#4C2B87]" />
					<TextFormattingIcons />

					{/* description */}
					<input
						className="mt-4 outline-none text-sm text-[#5f6368]"
						defaultValue={"Form description"}
					/>
					<div className="h-px w-full bg-[#DADCE0]" />
					<TextFormattingIcons />
				</div>
			</div>
		</div>
	);
};

export default MainTitleAndDesForm;
