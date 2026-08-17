/* eslint-disable react/prop-types */
import LogoImage from "../../logo/LogoImage";
import Profile from "../Profile";
import { Link } from "react-router-dom";
import { useState, useRef, useLayoutEffect, useEffect } from "react";
import StarButton from "./StarButton";
import HeaderIcons from "./HeaderIcons";
import TabNavigation from "./TabNavigation";
import { BsCloudCheck, BsCloudUpload, BsCloudSlash } from "react-icons/bs";

const CreateOrEditHeader = ({
	formName = "Untitled form",
	onNameSave,
	selectedBtn = 0,
	setSelectedBtn,
	saveStatus = "idle",
}) => {
	const [star, setStar] = useState(false);
	const [localName, setLocalName] = useState(formName);
	const spanRef = useRef(null);
	const [inputWidth, setInputWidth] = useState(115);

	// Sync localName when external formName updates from server
	useEffect(() => {
		setLocalName(formName || "Untitled form");
	}, [formName]);

	// Synchronously measure exact text width
	useLayoutEffect(() => {
		if (spanRef.current) {
			const textWidth = spanRef.current.offsetWidth;
			setInputWidth(Math.min(350, Math.max(textWidth + 6, 20)));
		}
	}, [localName]);

	const handleBlur = () => {
		const finalName = localName.trim() || "Untitled form";
		setLocalName(finalName);
		if (finalName !== formName) {
			onNameSave?.(finalName);
		}
	};

	const handleKeyDown = (e) => {
		if (e.key === "Enter") {
			e.preventDefault();
			e.target.blur();
		}
	};

	const renderSaveStatus = () => {
		switch (saveStatus) {
			case "saving":
				return (
					<div
						className="flex items-center gap-1.5 text-xs text-gray-500 font-medium ml-2 animate-pulse"
						title="Saving changes to database..."
					>
						<BsCloudUpload className="text-base text-[#673ab7]" />
						<span className="hidden sm:inline">Saving...</span>
					</div>
				);
			case "saved":
				return (
					<div
						className="flex items-center gap-1.5 text-xs text-gray-500 font-normal ml-2"
						title="All changes saved in Database"
					>
						<BsCloudCheck className="text-base text-gray-500" />
						<span className="hidden md:inline">
							All changes saved in Database
						</span>
					</div>
				);
			case "draft":
				return (
					<div
						className="flex items-center gap-1.5 text-xs text-gray-400 font-normal ml-2"
						title="Saved locally on this device"
					>
						<BsCloudCheck className="text-base text-gray-400" />
						<span className="hidden md:inline">Saved to draft</span>
					</div>
				);
			case "error":
				return (
					<div
						className="flex items-center gap-1.5 text-xs text-red-500 font-medium ml-2"
						title="Failed to auto-save"
					>
						<BsCloudSlash className="text-base text-red-500" />
						<span className="hidden sm:inline">Save error</span>
					</div>
				);
			default:
				return null;
		}
	};

	return (
		<header className="border-b border-[#DADCE0] w-full fixed z-40 bg-white shadow-sm">
			<div className="flex items-center justify-between px-5 py-2">
				<div className="flex items-center">
					<Link to="/">
						<LogoImage />
					</Link>

					{/* Invisible measurement element to calculate pixel-perfect text width */}
					<span
						ref={spanRef}
						aria-hidden="true"
						className="absolute -left-[9999px] -top-[9999px] invisible whitespace-pre font-normal text-lg md:text-xl px-1"
					>
						{localName || "Untitled form"}
					</span>

					{/* Exact-width input - saves only on defocus / blur */}
					<input
						type="text"
						value={localName}
						onChange={(e) => setLocalName(e.target.value)}
						onBlur={handleBlur}
						onKeyDown={handleKeyDown}
						style={{ width: `${inputWidth}px` }}
						className="font-normal text-[#1f1f1f] text-lg md:text-xl ml-4 mr-2 bg-transparent outline-none border-b-2 border-transparent hover:border-gray-300 focus:border-[#673ab7] px-1 py-0.5 rounded transition-[border-color] duration-150 truncate"
						placeholder="Untitled form"
						title="Rename form"
					/>

					<StarButton star={star} setStar={setStar} />

					{renderSaveStatus()}
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
