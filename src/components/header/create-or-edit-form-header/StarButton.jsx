/* eslint-disable react/prop-types */
import { IoMdStar, IoMdStarOutline } from "react-icons/io";

const StarButton = ({ star, setStar }) => {
	return (
		<>
			{star ? (
				<div className="p-1 rounded-full hover:bg-slate-100 cursor-pointer">
					<IoMdStar
						onClick={() => setStar(false)}
						color="#5f6368"
						fontSize="1.5em"
					/>
				</div>
			) : (
				<div className="p-1 rounded-full hover:bg-slate-100 cursor-pointer">
					<IoMdStarOutline
						onClick={() => setStar(true)}
						className="cursor-pointer"
						color="#5f6368"
						fontSize="1.5em"
					/>
				</div>
			)}
		</>
	);
};

export default StarButton;
