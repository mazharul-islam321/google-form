import { BsThreeDotsVertical } from "react-icons/bs";
import form_logo from "../../../assets/form-logo.png";

const RecentForms = () => {
	return (
		<section className="mx-[137px]">
			<p className="text-lg font-medium text-[#202124] mt-6 mb-7 ml-3">
				Recent forms
			</p>

			<>
				<div className="flex items-center justify-between w-full h-12 rounded-full cursor-pointer hover:bg-purple-100 px-2 ">
					<div className="flex items-center ml-3">
						<img
							src={form_logo}
							alt=""
							className="w-5 h-5 block rounded-sm mr-8"
						/>
						<p className="text-[#202124]">form name</p>
					</div>
					<p className="text-sm font-light text-[#5F6368]">
						4:34 PM. Last opened
					</p>
					<div className="p-2 rounded-[50%] hover:bg-slate-300 cursor-pointer">
						<BsThreeDotsVertical
							className="w-5 h-5"
							color="#444746"
						/>
					</div>
				</div>
				<div className="w-full h-px bg-[#e3e3e3]" />
			</>
		</section>
	);
};

export default RecentForms;
