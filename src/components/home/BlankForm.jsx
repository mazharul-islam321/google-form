import blank_form from "../../assets/forms-blank-googlecolors.png";

const BlankForm = () => {
	return (
		<section className="flex flex-col justify-center items-center bg-[#e4e7ea] py-8">
			<p className="text-base font-normal text-[#202124]">
				Start a new form
			</p>
			<div className="w-[171px] h-[128px] rounded overflow-hidden border border-slate-300 hover:border-violet-500 cursor-pointer mt-3 mb-1">
				<img
					src={blank_form}
					alt="blank form"
					className="w-full h-full rounded overflow-hidden"
				/>
			</div>
			<p className="text-base font-medium text-[#202124]">Blank form</p>
		</section>
	);
};

export default BlankForm;
