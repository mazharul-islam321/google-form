import { Link } from "react-router-dom";
import LogoImage from "./LogoImage";

const Logo = () => {
	return (
		<Link to="/" className="flex items-center">
			<LogoImage />

			<span className="roboto-bold text-[#1f1f1f] text-xl ml-1 hover:underline">
				Forms
			</span>
		</Link>
	);
};

export default Logo;
