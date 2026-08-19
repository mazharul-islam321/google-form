import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import {
	useGetFormsQuery,
	useDeleteFormMutation,
	useUpdateFormNameMutation,
} from "../../../redux/api/formApi";
import useAuth from "../../../hooks/useAuth";
import FormCard from "./FormCard";
import FormCardMenu from "./FormCardMenu";
import RenameFormModal from "./RenameFormModal";

const RecentForms = () => {
	const { isAuthenticated } = useAuth();
	const { data: forms, isLoading, isError } = useGetFormsQuery(undefined, {
		skip: !isAuthenticated,
	});
	const [deleteForm] = useDeleteFormMutation();
	const [updateFormName] = useUpdateFormNameMutation();

	const [activeMenuId, setActiveMenuId] = useState(null);
	const [renameModal, setRenameModal] = useState({ open: false, form: null });
	const menuRef = useRef(null);

	// Close dropdown when clicking outside
	useEffect(() => {
		const handleClickOutside = (e) => {
			if (menuRef.current && !menuRef.current.contains(e.target)) {
				setActiveMenuId(null);
			}
		};
		if (activeMenuId) {
			document.addEventListener("mousedown", handleClickOutside);
		}
		return () => document.removeEventListener("mousedown", handleClickOutside);
	}, [activeMenuId]);

	const handleMenuToggle = (formId) => {
		setActiveMenuId((prev) => (prev === formId ? null : formId));
	};

	const handleRenameOpen = (e, form) => {
		e.preventDefault();
		e.stopPropagation();
		setActiveMenuId(null);
		setRenameModal({ open: true, form });
	};

	const handleRenameConfirm = async (newName) => {
		if (!renameModal.form) return;
		try {
			await updateFormName({ id: renameModal.form._id, name: newName }).unwrap();
		} catch (err) {
			console.error("Failed to rename form:", err);
		}
	};

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

	if (!isAuthenticated) return <SignInPrompt />;

	return (
		<section className="mx-4 md:mx-[137px] pb-16">
			<p className="text-lg font-medium text-[#202124] mt-6 mb-7 ml-3">
				Recent forms
			</p>

			{isLoading && <LoadingSpinner />}
			{isError && <ErrorMessage />}

			{!isLoading && !isError && forms && forms.length > 0 && (
				<div className="flex flex-col gap-1">
					{forms.map((form) => (
						<div key={form._id}>
							<div className="relative">
								<FormCard
									form={form}
									isMenuOpen={activeMenuId === form._id}
									onMenuToggle={handleMenuToggle}
								/>

								{activeMenuId === form._id && (
									<div ref={menuRef}>
										<FormCardMenu
											onRename={(e) => handleRenameOpen(e, form)}
											onDelete={(e) => handleDelete(e, form._id)}
										/>
									</div>
								)}
							</div>
							<div className="w-full h-px bg-[#f1f3f4]" />
						</div>
					))}
				</div>
			)}

			{!isLoading && !isError && (!forms || forms.length === 0) && (
				<EmptyState />
			)}

			<RenameFormModal
				isOpen={renameModal.open}
				currentName={
					renameModal.form?.name ||
					renameModal.form?.title ||
					"Untitled form"
				}
				onConfirm={handleRenameConfirm}
				onClose={() => setRenameModal({ open: false, form: null })}
			/>
		</section>
	);
};

// ── Small inline sub-views ───────────────────────────────────────────────────

const SignInPrompt = () => (
	<section className="mx-4 md:mx-[137px] py-12 text-center">
		<p className="text-lg font-medium text-[#202124] mb-2">Recent forms</p>
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

const LoadingSpinner = () => (
	<div className="flex justify-center items-center py-10">
		<div className="w-8 h-8 border-4 border-[#673ab7] border-t-transparent rounded-full animate-spin" />
	</div>
);

const ErrorMessage = () => (
	<div className="text-center py-8 text-red-500 text-sm">
		Failed to load forms. Please refresh the page.
	</div>
);

const EmptyState = () => (
	<div className="text-center py-12 text-gray-500 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
		<p className="text-base font-medium text-gray-700 mb-1">No forms yet</p>
		<p className="text-sm text-gray-400">
			Click on &quot;Blank form&quot; above to create your first Google Form!
		</p>
	</div>
);

export default RecentForms;
