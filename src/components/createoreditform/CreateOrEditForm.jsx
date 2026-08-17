import { useState, useRef, useEffect } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { useSearchParams, useNavigate } from "react-router-dom";
import MainTitleAndDesForm from "./mainTitleAndDescriptionForm/MainTitleAndDesForm";
import UserEditForm from "./userEditForm/UserEditForm";
import TitleAndDesForm from "./generalTitleAndDescriptionForm/TitleAndDesForm";
import RightSideIconBar from "./RightSideIconBar";
import {
	useGetFormByIdQuery,
	useCreateFormMutation,
	useUpdateFormMutation,
} from "../../redux/api/formApi";
import useAuth from "../../hooks/useAuth";

const CreateOrEditForm = () => {
	const [searchParams, setSearchParams] = useSearchParams();
	const navigate = useNavigate();
	const formId = searchParams.get("id");
	const { isAuthenticated } = useAuth();

	const [activeSection, setActiveSection] = useState(0); // 0 is MainTitle, 1+ are dynamic fields
	const sectionRefs = useRef({});
	const [sidebarTop, setSidebarTop] = useState(0);
	const [saveMessage, setSaveMessage] = useState("");

	const { data: existingForm, isLoading: isFetching } = useGetFormByIdQuery(
		formId,
		{
			skip: !formId,
		},
	);

	const [createForm, { isLoading: isCreating }] = useCreateFormMutation();
	const [updateForm, { isLoading: isUpdating }] = useUpdateFormMutation();

	const { control, register, handleSubmit, reset } = useForm({
		defaultValues: {
			title: "Untitled form",
			description: "Form description",
			items: [{ type: "question", questionTitle: "Untitled Question" }],
		},
	});

	// Populate form when existing form data is fetched
	useEffect(() => {
		if (existingForm) {
			reset({
				title: existingForm.title || "Untitled form",
				description: existingForm.description || "",
				items:
					existingForm.items && existingForm.items.length > 0
						? existingForm.items
						: [
								{
									type: "question",
									questionTitle: "Untitled Question",
								},
							],
			});
		}
	}, [existingForm, reset]);

	const { fields, append, remove } = useFieldArray({
		control,
		name: "items",
	});

	// Update sidebar position when active section changes
	useEffect(() => {
		const updatePosition = () => {
			const currentRef = sectionRefs.current[activeSection];
			if (currentRef) {
				setSidebarTop(currentRef.offsetTop);
			}
		};

		updatePosition();
		const timeoutId = setTimeout(updatePosition, 100);
		return () => clearTimeout(timeoutId);
	}, [activeSection, fields.length]);

	const handleSectionClick = (index) => {
		setActiveSection(index);
	};

	const handleAddQuestion = () => {
		append({ type: "question", questionTitle: "Untitled Question" });
		setActiveSection(fields.length + 1);
	};

	const handleAddTitle = () => {
		append({ type: "title", title: "" });
		setActiveSection(fields.length + 1);
	};

	// Validate activeSection when fields change
	useEffect(() => {
		if (activeSection > fields.length) {
			setActiveSection(fields.length);
		}
	}, [fields.length, activeSection]);

	const handleDelete = (index) => {
		remove(index);
	};

	const onSubmit = async (data) => {
		if (!isAuthenticated) {
			alert("Please sign in to save your form.");
			navigate("/login");
			return;
		}

		try {
			if (formId) {
				await updateForm({ id: formId, ...data }).unwrap();
				setSaveMessage("Form updated successfully!");
			} else {
				const res = await createForm(data).unwrap();
				setSearchParams({ id: res._id });
				setSaveMessage("Form created successfully!");
			}
			setTimeout(() => setSaveMessage(""), 3000);
		} catch (err) {
			console.error("Save form error:", err);
			setSaveMessage("Error saving form. Please try again.");
			setTimeout(() => setSaveMessage(""), 4000);
		}
	};

	const isSaving = isCreating || isUpdating;

	if (formId && isFetching) {
		return (
			<div className="w-full h-full flex items-center justify-center pt-28">
				<div className="w-10 h-10 border-4 border-[#673ab7] border-t-transparent rounded-full animate-spin"></div>
			</div>
		);
	}

	return (
		<main className="w-full h-full flex flex-col items-center pt-28 pb-20 overflow-y-scroll scroll-smooth relative">
			<div className="w-[780px] relative">
				{/* Sidebar */}
				<div
					style={{
						position: "absolute",
						top: `${sidebarTop ? sidebarTop + 12 : 0}px`,
						right: "-60px",
						transition: "top 0.3s ease-in-out",
						zIndex: 10,
					}}
				>
					<RightSideIconBar
						onAddQuestion={handleAddQuestion}
						onAddTitle={handleAddTitle}
					/>
				</div>

				<div className="flex flex-col gap-1">
					{/* Main Title Form - Always present, Index 0 */}
					<div
						ref={(el) => (sectionRefs.current[0] = el)}
						onClick={() => handleSectionClick(0)}
					>
						<MainTitleAndDesForm
							activeElement={activeSection === 0}
							register={register}
						/>
					</div>

					{/* Dynamic Fields */}
					{fields.map((field, index) => {
						const realIndex = index + 1;
						return (
							<div
								key={field.id}
								ref={(el) =>
									(sectionRefs.current[realIndex] = el)
								}
								onClick={() => handleSectionClick(realIndex)}
							>
								{field.type === "question" && (
									<UserEditForm
										activeElement={
											activeSection === realIndex
										}
										onDelete={() => handleDelete(index)}
										register={register}
										index={index}
									/>
								)}

								{field.type === "title" && (
									<TitleAndDesForm
										activeElement={
											activeSection === realIndex
										}
										onDelete={() => handleDelete(index)}
										register={register}
										index={index}
									/>
								)}
							</div>
						);
					})}
				</div>

				<div className="flex items-center gap-4 mt-6">
					<button
						onClick={handleSubmit(onSubmit)}
						disabled={isSaving}
						className="bg-[#673ab7] hover:bg-[#5a2ea6] text-white px-8 py-2.5 rounded-lg shadow-md font-medium transition duration-150 disabled:opacity-50 flex items-center gap-2"
					>
						{isSaving && (
							<div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
						)}
						<span>
							{isSaving
								? "Saving..."
								: formId
									? "Update Form"
									: "Save Form"}
						</span>
					</button>

					{saveMessage && (
						<span
							className={`text-sm font-medium ${
								saveMessage.includes("Error")
									? "text-red-500"
									: "text-green-600"
							} animate-fadeIn`}
						>
							{saveMessage}
						</span>
					)}
				</div>
			</div>
		</main>
	);
};

export default CreateOrEditForm;
