import { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth";

const Profile = () => {
	const { user, isAuthenticated, signOut } = useAuth();
	const [isOpen, setIsOpen] = useState(false);
	const dropdownRef = useRef(null);
	const navigate = useNavigate();

	useEffect(() => {
		const handleClickOutside = (event) => {
			if (
				dropdownRef.current &&
				!dropdownRef.current.contains(event.target)
			) {
				setIsOpen(false);
			}
		};
		document.addEventListener("mousedown", handleClickOutside);
		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
		};
	}, []);

	const handleLogout = () => {
		signOut();
		setIsOpen(false);
		navigate("/login");
	};

	if (!isAuthenticated) {
		return (
			<Link
				to="/login"
				className="px-4 py-1.5 bg-[#673ab7] text-white rounded-md text-sm font-medium hover:bg-[#5a2ea6] transition duration-150 shadow-sm"
			>
				Sign In
			</Link>
		);
	}

	const displayName =
		user?.name && user.name.trim() !== ""
			? user.name
			: user?.email
			? user.email.split("@")[0]
			: "User";

	const initial = displayName.charAt(0).toUpperCase();

	return (
		<div className="relative" ref={dropdownRef}>
			<button
				type="button"
				onClick={() => setIsOpen(!isOpen)}
				className="p-1 hover:bg-slate-100 rounded-full cursor-pointer flex items-center gap-2 focus:outline-none"
			>
				<div className="w-8 h-8 rounded-full bg-[#673ab7] text-white font-semibold flex items-center justify-center text-sm shadow-sm transition duration-150 hover:opacity-90">
					{initial}
				</div>
			</button>

			{isOpen && (
				<div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-gray-100 py-3 px-4 z-50 animate-fadeIn">
					<div className="flex items-center gap-3 pb-3 border-b border-gray-100">
						<div className="w-10 h-10 rounded-full bg-[#673ab7] text-white font-bold flex items-center justify-center text-base shadow-sm">
							{initial}
						</div>
						<div className="overflow-hidden">
							<p className="text-sm font-semibold text-gray-900 truncate">
								{displayName}
							</p>
							<p className="text-xs text-gray-500 truncate">
								{user?.email}
							</p>
						</div>
					</div>

					<div className="pt-2">
						<button
							onClick={handleLogout}
							className="w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition duration-150 font-medium flex items-center gap-2"
						>
							<span>Sign Out</span>
						</button>
					</div>
				</div>
			)}
		</div>
	);
};

export default Profile;
