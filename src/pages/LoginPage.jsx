import SubTitle from "../components/auth/SubTitle";
import Title from "../components/auth/Title";
import LoginButton from "../components/auth/LoginButton";
import Divider from "../components/auth/Divider";
import LoginForm from "../components/auth/LoginForm";

const LoginPage = () => {
	return (
		<section className="bg-gradient-to-br from-[#FFFFFF]/40 to-[#FFFFFF]/10 pb-[88px]">
			{/* title of the login screen */}
			<div className="text-center mt-[30px]">
				<Title text="Sign In" />
				<div className="w-2/3 mx-auto mt-[10px]">
					<SubTitle text="Welcome back, you've been missed!" />
				</div>
			</div>

			{/* sign-in card */}
			<div className="w-[327px] md:w-[580px] h-[380px]  md:h-[522px] py-6 px-5 md:p-10 mx-auto shadow-[0_5px_20px_-15px_rgba(0,0,0,0.3)] bg-white  mt-7 rounded-[20px]">
				{/* google and apple sign-in button */}
				<LoginButton />

				{/* horizontal line or divider */}
				<Divider />

				{/* sign-in form */}
				<LoginForm />

				<div className="flex items-center justify-center text-center roboto-medium text-xs md:text-base">
					<p className="text-[#4E5D78] ">
						{"You haven't any account?"}
					</p>
					<p className="text-[#377DFF] hover:underline ml-[6px] md:ml-[19px]">
						Sign Up
					</p>
				</div>
			</div>
		</section>
	);
};

export default LoginPage;
