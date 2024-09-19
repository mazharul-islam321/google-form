import profile from "../../assets/profile.jpg";

const Profile = () => {
	return (
		<div className="p-1 hover:bg-slate-100 rounded-full cursor-pointer">
			<img
				src={profile}
				alt=""
				className="w-8 h-8 rounded-full block object-cover"
			/>
		</div>
	);
};

export default Profile;
