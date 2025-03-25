import LogoImage from "../../logo/LogoImage";
import Profile from "../Profile";
import { Link } from "react-router-dom";
import { useState } from "react";
import StarButton from "./StarButton";
import HeaderIcons from "./HeaderIcons";
import TabNavigation from "./TabNavigation";

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

					<StarButton star={star} setStar={setStar} />
				</div>

				<div className="flex items-center">
					<HeaderIcons />
					<Profile />
				</div>
			</div>

			<TabNavigation
				selectedBtn={selectedBtn}
				setSelectedBtn={setSelectedBtn}
			/>
		</header>
	);
};

export default CreateOrEditHeader;
