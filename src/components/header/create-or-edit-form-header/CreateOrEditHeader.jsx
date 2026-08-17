/* eslint-disable react/prop-types */
import LogoImage from "../../logo/LogoImage";
import Profile from "../Profile";
import { Link } from "react-router-dom";
import { useState } from "react";
import StarButton from "./StarButton";
import HeaderIcons from "./HeaderIcons";
import TabNavigation from "./TabNavigation";

const CreateOrEditHeader = ({
	formTitle = "Untitled form",
	selectedBtn = 0,
	setSelectedBtn,
}) => {
	const [star, setStar] = useState(false);

	return (
		<header className="border-b border-[#DADCE0] w-full fixed z-40 bg-white shadow-sm">
			<div className="flex items-center justify-between px-5 py-2">
				<div className="flex items-center">
					<Link to="/">
						<LogoImage />
					</Link>

					<span className="font-normal text-[#1f1f1f] text-lg md:text-xl ml-4 mr-3 max-w-[200px] md:max-w-[400px] truncate">
						{formTitle}
					</span>

					<StarButton star={star} setStar={setStar} />
				</div>

				<div className="flex items-center gap-3">
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
