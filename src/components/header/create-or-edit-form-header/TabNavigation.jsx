/* eslint-disable react/prop-types */
const TabNavigation = ({ selectedBtn, setSelectedBtn }) => {
	return (
		<div className="flex items-end justify-center gap-4 pt-3">
			<div className="text-center" onClick={() => setSelectedBtn(0)}>
				<p
					className={`font-normal ${
						selectedBtn === 0 ? "text-[#4C2B87] " : "text-[#1f1f1f]"
					} text-sm mb-1`}
				>
					Questions
				</p>
				<div
					className={`w-[87px] h-[3px] ${
						selectedBtn === 0 ? "bg-[#4C2B87]" : "bg-white"
					}  rounded-t-[3px]`}
				/>
			</div>

			<div className="text-center" onClick={() => setSelectedBtn(1)}>
				<p
					className={`font-normal ${
						selectedBtn === 1 ? "text-[#4C2B87] " : "text-[#1f1f1f]"
					} text-sm mb-1`}
				>
					Responses
				</p>
				<div
					className={`w-[87px] h-[3px] ${
						selectedBtn === 1 ? "bg-[#4C2B87]" : "bg-white"
					}  rounded-t-[3px]`}
				/>
			</div>
		</div>
	);
};

export default TabNavigation;
