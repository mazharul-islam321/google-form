import { Link } from "react-router-dom";
import Divider from "../components/auth/Divider";
import LoginButton from "../components/auth/LoginButton";
import SubTitle from "../components/auth/SubTitle";
import Title from "../components/auth/Title";
import RegisterForm from "../components/auth/RegisterForm";

const RegistrationPage = () => {
	return (
		<section className="bg-gradient-to-br from-[#FFFFFF]/40 to-[#FFFFFF]/10 pb-[88px]">
			{/* title of the sign-up screen */}

			<div className="text-center mt-[30px]">
				<Title text="Getting Started" />
				<div className="w-2/3 mx-auto mt-[10px]">
					<SubTitle text="Create an account to continue" />
				</div>
			</div>

			{/* sign-up card */}
			<div className="w-[327px] md:w-[580px]  py-6 px-5 md:p-10 mx-auto shadow-[0_5px_20px_-15px_rgba(0,0,0,0.3)] bg-white  mt-7 rounded-[20px]">
				{/* google and apple sign-up button */}

				<LoginButton />

				{/* horizontal line or divider */}
				<Divider />

				{/* sign-up form */}
				<RegisterForm />

				<div className="flex items-center justify-center text-center roboto-medium text-xs md:text-base">
					<p className="text-[#4E5D78] ">Already have an account?</p>
					<Link
						to="/login"
						className="text-[#377DFF] hover:underline ml-[6px] md:ml-[19px]"
					>
						Sign In
					</Link>
				</div>
			</div>
		</section>
	);
};

export default RegistrationPage;
