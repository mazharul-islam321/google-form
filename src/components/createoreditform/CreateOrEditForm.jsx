import { useState, useRef, useEffect } from "react";
import { useForm, useFieldArray, useWatch } from "react-hook-form";
import { useParams, useSearchParams, useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import FormSectionList from "./sections/FormSectionList";
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
	formId: propFormId,
	headerImage: propHeaderImage = "",
	onHeaderImageChange,
	onNameChange,
	onSaveStatusChange,
}) => {
	const { id: paramId } = useParams();
	const [searchParams] = useSearchParams();
	const navigate = useNavigate();
	const formId = propFormId || paramId || searchParams.get("id");
	const { isAuthenticated } = useAuth();

	const [activeSection, setActiveSection] = useState(0);
	const [autoSaveResetKey, setAutoSaveResetKey] = useState(0);
	const isCreatingFormRef = useRef(false);
	const sectionRefs = useRef({});
	const mainRef = useRef(null);
	const formContainerRef = useRef(null);
	const [showAuthModal, setShowAuthModal] = useState(false);

	const { data: existingForm, isLoading: isFetching } = useGetFormByIdQuery(
		formId,
		{ skip: !formId },
	);

	const [createForm] = useCreateFormMutation();
	const [updateForm] = useUpdateFormMutation();

	const { control, register, reset, setValue, getValues } = useForm({
		defaultValues: {
			name: "Untitled form",
			title: "Untitled form",
			description: "Form description",
			headerImage: propHeaderImage || "",
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

	const watchedHeaderImage = useWatch({
		control,
		name: "headerImage",
		defaultValue: propHeaderImage || "",
	});

	// Sync external propHeaderImage if provided
	useEffect(() => {
		if (propHeaderImage !== undefined) {
			setValue("headerImage", propHeaderImage, { shouldDirty: false });
		}
	}, [propHeaderImage, setValue]);

	// Populate form when existing form data is fetched or restore from local draft for guests
	useEffect(() => {
		if (existingForm) {
			reset({
				name: existingForm.name || "Untitled form",
				title: existingForm.title || "Untitled form",
				description: existingForm.description || "",
				headerImage: existingForm.headerImage || "",
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
			if (onNameChange) {
				onNameChange(
					existingForm.name || existingForm.title || "Untitled form",
				);
			}
			if (onHeaderImageChange && existingForm.headerImage) {
				onHeaderImageChange(existingForm.headerImage);
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
						if (parsed.headerImage && onHeaderImageChange) {
							onHeaderImageChange(parsed.headerImage);
						}
						setAutoSaveResetKey((k) => k + 1);

						// If the user is now authenticated, auto-save the guest draft immediately to MongoDB ONCE
						if (isAuthenticated && !isCreatingFormRef.current) {
							isCreatingFormRef.current = true;
							onSaveStatusChange?.("saving");
							createForm(parsed)
								.unwrap()
								.then((res) => {
									const newId = res?._id || res?.data?._id;
									localStorage.removeItem(
										"google_form_draft",
									);
									onSaveStatusChange?.("saved");
									if (newId) {
										navigate(`/forms/${newId}/edit`, {
											replace: true,
										});
									}
								})
								.catch((err) => {
									console.error(
										"Draft migration save error:",
										err,
									);
									isCreatingFormRef.current = false;
									onSaveStatusChange?.("error");
								});
						} else {
							onSaveStatusChange?.("draft");
						}
					}
				}
			} catch (e) {
				console.error("Failed to load local draft:", e);
			}
		}
	}, [
		existingForm,
		formId,
		reset,
		isAuthenticated,
		onSaveStatusChange,
		onNameChange,
		onHeaderImageChange,
		createForm,
		navigate,
	]);

	const { fields, insert, remove } = useFieldArray({
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
				} else if (!isCreatingFormRef.current) {
					isCreatingFormRef.current = true;
					try {
						const res = await createForm(formData).unwrap();
						const newId = res?._id || res?.data?._id;
						localStorage.removeItem("google_form_draft");
						if (newId) {
							navigate(`/forms/${newId}/edit`, { replace: true });
						}
					} catch (err) {
						isCreatingFormRef.current = false;
						throw err;
					}
				}
			} else {
				try {
					localStorage.setItem(
						"google_form_draft",
						JSON.stringify(formData),
					);
				} catch (e) {
					console.error("Local draft save error:", e);
				}
			}
		},
	});

	const effectiveHeaderImage =
		propHeaderImage !== null && propHeaderImage !== undefined
			? propHeaderImage
			: (watchedHeaderImage ?? existingForm?.headerImage ?? "");

	// Smart floating sidebar positioning hook
	const { sidebarStyle } = useFloatingSidebar({
		activeSection,
		sectionRefs,
		mainRef,
		formContainerRef,
		fieldsLength: fields.length,
		headerImage: effectiveHeaderImage,
	});

	// Insert question immediately below the active section
	const handleAddQuestion = () => {
		const targetIndex = activeSection === 0 ? 0 : activeSection;
		insert(targetIndex, {
			type: "question",
			questionTitle: "Untitled Question",
			questionType: "multiplechoice",
			options: ["Option 1"],
		});
		setActiveSection(targetIndex + 1);
	};

	// Insert title section immediately below the active section
	const handleAddTitle = () => {
		const targetIndex = activeSection === 0 ? 0 : activeSection;
		insert(targetIndex, {
			type: "title",
			questionTitle: "Untitled title",
			description: "Description",
		});
		setActiveSection(targetIndex + 1);
	};

	// Duplicate an existing question/title card and insert immediately below it
	const handleDuplicateField = (index) => {
		const currentItems = getValues("items") || [];
		const sourceItem = currentItems[index] || fields[index];
		if (!sourceItem) return;

		const clonedItem = JSON.parse(JSON.stringify(sourceItem));
		delete clonedItem._id;
		delete clonedItem.id;

		insert(index + 1, clonedItem);
		setActiveSection(index + 2);
	};

	const handleDeleteField = (index) => {
		remove(index);
	};

	const handleHeaderImageChange = async (newUrl) => {
		setValue("headerImage", newUrl, { shouldDirty: true });
		onHeaderImageChange?.(newUrl);
		if (formId && isAuthenticated) {
			try {
				await updateForm({ id: formId, headerImage: newUrl }).unwrap();
			} catch (err) {
				console.error("Failed to update banner image:", err);
			}
		}
	};

	useEffect(() => {
		if (activeSection > fields.length) {
			setActiveSection(fields.length);
		}
	}, [fields.length, activeSection]);

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
			className="w-full h-full flex flex-col items-center pt-28 pb-24 overflow-y-scroll scroll-smooth relative"
		>
			<div ref={formContainerRef} className="w-[780px] relative">
				{sidebarStyle.isReady && (
					<div
						style={{
							position: "fixed",
							top: `${sidebarStyle.top}px`,
							left: `${sidebarStyle.left}px`,
							transition:
								"top 0.2s ease-out, left 0.15s ease-out",
							zIndex: 10,
						}}
					>
						<RightSideIconBar
							onAddQuestion={handleAddQuestion}
							onAddTitle={handleAddTitle}
						/>
					</div>
				)}

				<FormSectionList
					activeSection={activeSection}
					onSectionClick={setActiveSection}
					sectionRefs={sectionRefs}
					register={register}
					control={control}
					setValue={setValue}
					fields={fields}
					headerImage={effectiveHeaderImage}
					onHeaderImageChange={handleHeaderImageChange}
					onDeleteField={handleDeleteField}
					onDuplicateField={handleDuplicateField}
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
	formId: PropTypes.string,
	headerImage: PropTypes.string,
	onHeaderImageChange: PropTypes.func,
	onNameChange: PropTypes.func,
	onSaveStatusChange: PropTypes.func,
};

export default CreateOrEditForm;
