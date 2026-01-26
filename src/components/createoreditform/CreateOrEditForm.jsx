import { useState, useRef, useEffect } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import MainTitleAndDesForm from "./mainTitleAndDescriptionForm/MainTitleAndDesForm";
import UserEditForm from "./userEditForm/UserEditForm";
import TitleAndDesForm from "./generalTitleAndDescriptionForm/TitleAndDesForm";
import RightSideIconBar from "./RightSideIconBar";

const CreateOrEditForm = () => {
	const [activeSection, setActiveSection] = useState(0); // 0 is MainTitle, 1+ are dynamic fields
	const sectionRefs = useRef({});
	const [sidebarTop, setSidebarTop] = useState(0);

	const { control, register, handleSubmit } = useForm({
		defaultValues: {
			title: "Untitled form",
			description: "Form description",
			items: [{ type: "question", questionTitle: "Untitled Question" }],
		},
	});

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

		// Run immediately and after a short delay to account for render/animation
		updatePosition();
		const timeoutId = setTimeout(updatePosition, 100);
		return () => clearTimeout(timeoutId);
	}, [activeSection, fields.length]); // depend on fields length to re-calc when items added/removed

	const handleSectionClick = (index) => {
		setActiveSection(index);
	};

	const handleAddQuestion = () => {
		append({ type: "question", questionTitle: "Untitled Question" });
		setActiveSection(fields.length + 1); // Set focus to the new item (MainTitle(0) + existing fields + 1)
	};

	const handleAddTitle = () => {
		append({ type: "title", title: "" });
		setActiveSection(fields.length + 1);
	};

	// Validate activeSection when fields change
	useEffect(() => {
		// activeSection 0 is MainTitle.
		// fields indices map to 1..fields.length.
		// Max valid activeSection is fields.length.
		if (activeSection > fields.length) {
			setActiveSection(fields.length);
		}
	}, [fields.length, activeSection]);

	const handleDelete = (index) => {
		remove(index);
	};

	const onSubmit = (data) => {
		console.log("Form Data:", data);
	};

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

				<button
					onClick={handleSubmit(onSubmit)}
					className="mt-4 bg-[#673ab7] text-white px-6 py-2 rounded shadow-lg"
				>
					Save
				</button>
			</div>
		</main>
	);
};

export default CreateOrEditForm;
