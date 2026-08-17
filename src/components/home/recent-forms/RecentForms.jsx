import { useState } from "react";
import { Link } from "react-router-dom";
import { BsThreeDotsVertical, BsTrash } from "react-icons/bs";
import form_logo from "../../../assets/form-logo.png";
import { useGetFormsQuery, useDeleteFormMutation } from "../../../redux/api/formApi";
import useAuth from "../../../hooks/useAuth";

const RecentForms = () => {
	const { isAuthenticated } = useAuth();
	const { data: forms, isLoading, isError } = useGetFormsQuery(undefined, {
		skip: !isAuthenticated,
	});
	const [deleteForm] = useDeleteFormMutation();
	const [activeMenuId, setActiveMenuId] = useState(null);

	const handleDelete = async (e, formId) => {
		e.preventDefault();
		e.stopPropagation();
		if (window.confirm("Are you sure you want to delete this form?")) {
			try {
				await deleteForm(formId).unwrap();
				setActiveMenuId(null);
			} catch (err) {
				console.error("Failed to delete form:", err);
			}
		}
	};

	if (!isAuthenticated) {
		return (
			<section className="mx-4 md:mx-[137px] py-12 text-center">
				<p className="text-lg font-medium text-[#202124] mb-2">
					Recent forms
				</p>
				<p className="text-gray-500 mb-4 text-sm">
					Please sign in to view and manage your forms.
				</p>
				<Link
					to="/login"
					className="inline-block px-5 py-2 bg-[#673ab7] text-white text-sm font-medium rounded-lg hover:bg-[#5a2ea6] transition duration-150"
				>
					Sign In
				</Link>
			</section>
		);
	}

	return (
		<section className="mx-4 md:mx-[137px] pb-16">
			<p className="text-lg font-medium text-[#202124] mt-6 mb-7 ml-3">
				Recent forms
			</p>

			{isLoading ? (
				<div className="flex justify-center items-center py-10">
					<div className="w-8 h-8 border-4 border-[#673ab7] border-t-transparent rounded-full animate-spin"></div>
				</div>
			) : isError ? (
				<div className="text-center py-8 text-red-500 text-sm">
					Failed to load forms. Please refresh the page.
				</div>
			) : forms && forms.length > 0 ? (
				<div className="flex flex-col gap-1">
					{forms.map((form) => (
						<div key={form._id} className="relative">
							<Link
								to={`/create_or_edit?id=${form._id}`}
								className="flex items-center justify-between w-full h-14 rounded-xl cursor-pointer hover:bg-purple-50 px-4 transition duration-150 border border-transparent hover:border-purple-100"
							>
								<div className="flex items-center">
									<img
										src={form_logo}
										alt="form icon"
										className="w-5 h-5 block rounded-sm mr-4"
									/>
									<span className="text-[#202124] font-medium text-sm md:text-base">
										{form.name || form.title || "Untitled form"}
									</span>
								</div>

								<div className="flex items-center gap-4">
									<span className="text-xs md:text-sm font-light text-[#5F6368]">
										{new Date(form.updatedAt).toLocaleDateString(
											undefined,
											{
												month: "short",
												day: "numeric",
												hour: "2-digit",
												minute: "2-digit",
											}
										)}
									</span>

									<button
										type="button"
										onClick={(e) => {
											e.preventDefault();
											e.stopPropagation();
											setActiveMenuId(
												activeMenuId === form._id
													? null
													: form._id
											);
										}}
										className="p-2 rounded-full hover:bg-slate-200 cursor-pointer focus:outline-none"
									>
										<BsThreeDotsVertical
											fontSize="1.2em"
											color="#5f6368"
										/>
									</button>
								</div>
							</Link>

							{activeMenuId === form._id && (
								<div className="absolute right-4 top-12 w-40 bg-white rounded-lg shadow-lg border border-gray-100 py-1 z-30">
									<button
										onClick={(e) => handleDelete(e, form._id)}
										className="flex items-center gap-2 w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50"
									>
										<BsTrash />
										<span>Delete form</span>
									</button>
								</div>
							)}
							<div className="w-full h-px bg-[#f1f3f4]" />
						</div>
					))}
				</div>
			) : (
				<div className="text-center py-12 text-gray-500 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
					<p className="text-base font-medium text-gray-700 mb-1">
						No forms yet
					</p>
					<p className="text-sm text-gray-400">
						Click on &quot;Blank form&quot; above to create your first Google Form!
					</p>
				</div>
			)}
		</section>
	);
};

export default RecentForms;
