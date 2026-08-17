import { useState, useRef, useEffect } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { useSearchParams } from "react-router-dom";
import FormSectionList from "./sections/FormSectionList";
import FormActionFooter from "./footer/FormActionFooter";
import RightSideIconBar from "./RightSideIconBar";
import AuthPromptModal from "../modals/AuthPromptModal";
import useFloatingSidebar from "../../hooks/useFloatingSidebar";
import useAuth from "../../hooks/useAuth";
import {
	useGetFormByIdQuery,
	useCreateFormMutation,
	useUpdateFormMutation,
} from "../../redux/api/formApi";

const CreateOrEditForm = () => {
	const [searchParams, setSearchParams] = useSearchParams();
	const formId = searchParams.get("id");
	const { isAuthenticated } = useAuth();

	const [activeSection, setActiveSection] = useState(0);
	const sectionRefs = useRef({});
	const mainRef = useRef(null);
	const formContainerRef = useRef(null);
	const [saveMessage, setSaveMessage] = useState("");
	const [showAuthModal, setShowAuthModal] = useState(false);

	const { data: existingForm, isLoading: isFetching } = useGetFormByIdQuery(
		formId,
		{ skip: !formId }
	);

	const [createForm, { isLoading: isCreating }] = useCreateFormMutation();
	const [updateForm, { isLoading: isUpdating }] = useUpdateFormMutation();

	const { control, register, handleSubmit, reset, setValue } = useForm({
		defaultValues: {
			title: "Untitled form",
			description: "Form description",
			items: [
				{
					type: "question",
					questionTitle: "Untitled Question",
					questionType: "multiplechoice",
					options: ["Option 1"],
				},
			],
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
						? existingForm.items.map((item) => ({
								...item,
								options:
									item.options && item.options.length > 0
										? item.options
										: ["Option 1"],
						  }))
						: [
								{
									type: "question",
									questionTitle: "Untitled Question",
									questionType: "multiplechoice",
									options: ["Option 1"],
								},
						  ],
			});
		}
	}, [existingForm, reset]);

	const { fields, append, remove } = useFieldArray({
		control,
		name: "items",
	});

	// Smart floating sidebar positioning hook
	const { sidebarStyle } = useFloatingSidebar({
		activeSection,
		sectionRefs,
		mainRef,
		formContainerRef,
		fieldsLength: fields.length,
	});

	// Dynamic action handlers
	const handleAddQuestion = () => {
		append({
			type: "question",
			questionTitle: "Untitled Question",
			questionType: "multiplechoice",
			options: ["Option 1"],
		});
		setActiveSection(fields.length + 1);
	};

	const handleAddTitle = () => {
		append({
			type: "title",
			questionTitle: "Untitled title",
			description: "Description",
		});
		setActiveSection(fields.length + 1);
	};

	const handleDeleteField = (index) => {
		remove(index);
	};

	// Validate activeSection boundary
	useEffect(() => {
		if (activeSection > fields.length) {
			setActiveSection(fields.length);
		}
	}, [fields.length, activeSection]);

	const onSubmit = async (data) => {
		if (!isAuthenticated) {
			setShowAuthModal(true);
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
				<div className="w-10 h-10 border-4 border-[#673ab7] border-t-transparent rounded-full animate-spin" />
			</div>
		);
	}

	return (
		<main
			ref={mainRef}
			className="w-full h-full flex flex-col items-center pt-28 pb-20 overflow-y-scroll scroll-smooth relative"
		>
			<div ref={formContainerRef} className="w-[780px] relative">
				{/* Viewport-Clamped Floating Sidebar */}
				{sidebarStyle.isReady && (
					<div
						style={{
							position: "fixed",
							top: `${sidebarStyle.top}px`,
							left: `${sidebarStyle.left}px`,
							transition: "top 0.2s ease-out, left 0.15s ease-out",
							zIndex: 10,
						}}
					>
						<RightSideIconBar
							onAddQuestion={handleAddQuestion}
							onAddTitle={handleAddTitle}
						/>
					</div>
				)}

				{/* Section List (Main Title + Dynamic Question/Title Cards) */}
				<FormSectionList
					activeSection={activeSection}
					onSectionClick={setActiveSection}
					sectionRefs={sectionRefs}
					register={register}
					control={control}
					setValue={setValue}
					fields={fields}
					onDeleteField={handleDeleteField}
				/>

				{/* Save Action Footer */}
				<FormActionFooter
					onSave={handleSubmit(onSubmit)}
					isSaving={isSaving}
					isEdit={Boolean(formId)}
					saveMessage={saveMessage}
				/>
			</div>

			<AuthPromptModal
				isOpen={showAuthModal}
				onClose={() => setShowAuthModal(false)}
				title="Sign in to save"
				message="Sign in or create an account to save this form and start collecting responses."
			/>
		</main>
	);
};

export default CreateOrEditForm;
