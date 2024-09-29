import { Link } from "react-router-dom";
import LogoImage from "../logo/LogoImage";
import { IoMdStar, IoMdStarOutline } from "react-icons/io";
import { LuEye } from "react-icons/lu";
import { GrRedo, GrUndo } from "react-icons/gr";
import Profile from "./Profile";
import { useState } from "react";

const CreateOrEditHeader = () => {
	const [star, setStar] = useState(false);
	const [selectedBtn, setSelectedBtn] = useState(0);

	return (
		<header className="border-b border-[#DADCE0]  w-full fixed z-20 bg-white">
			<div className="flex items-center justify-between px-5 py-2">
				<div className="flex items-center">
					<Link to="/">
						<LogoImage />
					</Link>

					<span className="font-normal text-[#1f1f1f] text-xl ml-4 mr-3">
						Form Name
					</span>

					{star ? (
						<div className="p-1 rounded-full hover:bg-slate-100 cursor-pointer">
							<IoMdStar
								onClick={() => setStar(false)}
								color="#5f6368"
								fontSize="1.5em"
							/>
						</div>
					) : (
						<div className="p-1 rounded-full hover:bg-slate-100 cursor-pointer">
							<IoMdStarOutline
								onClick={() => setStar(true)}
								className="cursor-pointer"
								color="#5f6368"
								fontSize="1.5em"
							/>
						</div>
					)}
				</div>

				<div className="flex items-center">
					<div className="p-3 rounded-full hover:bg-slate-100 cursor-pointer">
						<LuEye fontSize="1.5em" color="#5f6368" />
					</div>
					<div className="p-3 rounded-full hover:bg-slate-100 cursor-pointer mx-1">
						<GrUndo color="#5f6368" fontSize="1.5em" />
					</div>
					<div className="p-3 rounded-full hover:bg-slate-100 cursor-pointer">
						<GrRedo color="#5f6368" fontSize="1.5em" />
					</div>
					<button className="py-1.5 px-4 rounded bg-[#673ab7] mx-5 cursor-pointer">
						<span className="text-white">share</span>
					</button>

					<Profile />
				</div>
			</div>

			<div className="flex items-end justify-center gap-4 pt-3">
				<div className="text-center" onClick={() => setSelectedBtn(0)}>
					<p
						className={`font-normal ${
							selectedBtn === 0
								? "text-[#4C2B87] "
								: "text-[#1f1f1f]"
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
							selectedBtn === 1
								? "text-[#4C2B87] "
								: "text-[#1f1f1f]"
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
		</header>
	);
};

export default CreateOrEditHeader;
