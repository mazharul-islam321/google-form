import { useState, useRef, useEffect } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { useSearchParams } from "react-router-dom";
import PropTypes from "prop-types";
import FormSectionList from "./sections/FormSectionList";
import FormActionFooter from "./footer/FormActionFooter";
import RightSideIconBar from "./RightSideIconBar";
import AuthPromptModal from "../modals/AuthPromptModal";
import useFloatingSidebar from "../../hooks/useFloatingSidebar";
import useAutoSave from "../../hooks/useAutoSave";
import useAuth from "../../hooks/useAuth";
import {
	useGetFormByIdQuery,
	useCreateFormMutation,
	useUpdateFormMutation,
} from "../../redux/api/formApi";

const CreateOrEditForm = ({
	nameSaveTrigger,
	onNameChange,
	onSaveStatusChange,
}) => {
	const [searchParams, setSearchParams] = useSearchParams();
	const formId = searchParams.get("id");
	const { isAuthenticated } = useAuth();

	const [activeSection, setActiveSection] = useState(0);
	const [autoSaveResetKey, setAutoSaveResetKey] = useState(0);
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

	const { control, register, handleSubmit, reset, setValue, getValues } =
		useForm({
			defaultValues: {
				name: "Untitled form",
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

	// Save document name immediately when triggered by header blur
	useEffect(() => {
		if (nameSaveTrigger !== null && nameSaveTrigger !== undefined) {
			setValue("name", nameSaveTrigger, { shouldDirty: true });
			const fullData = getValues();
			fullData.name = nameSaveTrigger;

			if (isAuthenticated) {
				onSaveStatusChange?.("saving");
				if (formId) {
					updateForm({ id: formId, ...fullData })
						.unwrap()
						.then(() => {
							onSaveStatusChange?.("saved");
						})
						.catch((err) => {
							console.error("Header name save error:", err);
							onSaveStatusChange?.("error");
						});
				} else {
					createForm(fullData)
						.unwrap()
						.then((res) => {
							const newId = res?._id || res?.data?._id;
							if (newId) {
								setSearchParams(
									{ id: newId },
									{ replace: true }
								);
							}
							onSaveStatusChange?.("saved");
						})
						.catch((err) => {
							console.error("Header name create error:", err);
							onSaveStatusChange?.("error");
						});
				}
			} else {
				try {
					localStorage.setItem(
						"google_form_draft",
						JSON.stringify(fullData)
					);
					onSaveStatusChange?.("draft");
				} catch (e) {
					console.error("Draft save error:", e);
				}
			}
		}
	}, [
		nameSaveTrigger,
		formId,
		isAuthenticated,
		createForm,
		updateForm,
		setValue,
		getValues,
		onSaveStatusChange,
		setSearchParams,
	]);

	// Populate form when existing form data is fetched or restore from local draft for guests
	useEffect(() => {
		if (existingForm) {
			reset({
				name: existingForm.name || "Untitled form",
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
			if (existingForm.name && onNameChange) {
				onNameChange(existingForm.name);
			}
			// Reset auto-save baseline AFTER server data is populated
			setAutoSaveResetKey((k) => k + 1);
			onSaveStatusChange?.("saved");
		} else if (!formId) {
			try {
				const localDraft = localStorage.getItem("google_form_draft");
				if (localDraft) {
					const parsed = JSON.parse(localDraft);
					if (parsed && typeof parsed === "object") {
						reset(parsed);
						if (parsed.name && onNameChange) {
							onNameChange(parsed.name);
						}
						onSaveStatusChange?.(
							isAuthenticated ? "idle" : "draft"
						);
					}
				}
			} catch (e) {
				console.error("Failed to load local draft:", e);
			}
		}
	}, [existingForm, formId, reset, isAuthenticated, onSaveStatusChange, onNameChange]);

	const { fields, append, remove } = useFieldArray({
		control,
		name: "items",
	});

	// Canvas Debounced Auto-Save
	useAutoSave({
		control,
		delay: 700,
		enabled: true,
		resetKey: autoSaveResetKey,
		onSavingStart: () => onSaveStatusChange?.("saving"),
		onSavingEnd: (success) => {
			if (!isAuthenticated) {
				onSaveStatusChange?.("draft");
			} else {
				onSaveStatusChange?.(success ? "saved" : "error");
			}
		},
		onSave: async (formData) => {
			if (isAuthenticated) {
				if (formId) {
					await updateForm({ id: formId, ...formData }).unwrap();
				} else {
					const res = await createForm(formData).unwrap();
					const newId = res?._id || res?.data?._id;
					if (newId) {
						setSearchParams({ id: newId }, { replace: true });
					}
				}
			} else {
				// Guest / Demo mode: save to local storage
				try {
					localStorage.setItem(
						"google_form_draft",
						JSON.stringify(formData)
					);
				} catch (e) {
					console.error("Local draft save error:", e);
				}
			}
		},
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
			onSaveStatusChange?.("saving");
			if (formId) {
				await updateForm({ id: formId, ...data }).unwrap();
				setSaveMessage("Form updated successfully!");
			} else {
				const res = await createForm(data).unwrap();
				const newId = res?._id || res?.data?._id;
				if (newId) {
					setSearchParams({ id: newId }, { replace: true });
				}
				setSaveMessage("Form created successfully!");
			}
			onSaveStatusChange?.("saved");
			setTimeout(() => setSaveMessage(""), 3000);
		} catch (err) {
			console.error("Save form error:", err);
			onSaveStatusChange?.("error");
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

CreateOrEditForm.propTypes = {
	nameSaveTrigger: PropTypes.string,
	onNameChange: PropTypes.func,
	onSaveStatusChange: PropTypes.func,
};

export default CreateOrEditForm;
