import { useState, useRef, useEffect, useCallback } from "react";
import { useForm, useFieldArray, useWatch } from "react-hook-form";
import { useParams, useSearchParams, useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import FormSectionList from "./sections/FormSectionList";
import RightSideIconBar from "./RightSideIconBar";
import AuthPromptModal from "../modals/AuthPromptModal";
import AIQuestionModal from "../modals/AIQuestionModal";
import AIPromptModal from "../modals/AIPromptModal";
import useFloatingSidebar from "../../hooks/useFloatingSidebar";
import useAutoSave from "../../hooks/useAutoSave";
import useAuth from "../../hooks/useAuth";
import useFormHistory from "../../hooks/useFormHistory";
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
	onHistoryChange,
	onRegisterUndoRedo,
}) => {
	const { id: paramId } = useParams();
	const [searchParams] = useSearchParams();
	const navigate = useNavigate();
	const formId = propFormId || paramId || searchParams.get("id");
	const { isAuthenticated } = useAuth();

	const [activeSection, setActiveSection] = useState(0);
	const [autoSaveResetKey, setAutoSaveResetKey] = useState(0);
	const [isAIPromptModalOpen, setIsAIPromptModalOpen] = useState(
		searchParams.get("ai") === "true"
	);
	const isCreatingFormRef = useRef(false);
	const loadedFormIdRef = useRef(null);
	const sectionRefs = useRef({});
	const mainRef = useRef(null);
	const formContainerRef = useRef(null);
	const [showAuthModal, setShowAuthModal] = useState(false);

	const history = useFormHistory();
	const historyTimerRef = useRef(null);

	useEffect(() => {
		if (searchParams.get("ai") === "true") {
			setIsAIPromptModalOpen(true);
		}
	}, [searchParams]);

	useEffect(() => {
		const handleOpenModal = () => setIsAIPromptModalOpen(true);
		window.addEventListener("open-ai-prompt-modal", handleOpenModal);
		return () =>
			window.removeEventListener("open-ai-prompt-modal", handleOpenModal);
	}, []);

	const { data: existingForm, isLoading: isFetching } = useGetFormByIdQuery(
		formId,
		{ skip: !formId }
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

	const watchedFormData = useWatch({ control });

	// Sync external propHeaderImage if provided
	useEffect(() => {
		if (propHeaderImage !== undefined) {
			setValue("headerImage", propHeaderImage, { shouldDirty: false });
		}
	}, [propHeaderImage, setValue]);

	// Sync history flags to parent header
	useEffect(() => {
		onHistoryChange?.({
			canUndo: history.canUndo,
			canRedo: history.canRedo,
		});
	}, [history.canUndo, history.canRedo, onHistoryChange]);

	// Record debounced history snapshot on user typing / edits
	useEffect(() => {
		if (!watchedFormData || !watchedFormData.items) return;
		if (history.isApplyingHistory()) return;

		if (historyTimerRef.current) {
			clearTimeout(historyTimerRef.current);
		}

		historyTimerRef.current = setTimeout(() => {
			history.record(watchedFormData);
		}, 400);

		return () => {
			if (historyTimerRef.current) {
				clearTimeout(historyTimerRef.current);
			}
		};
	}, [watchedFormData, history]);

	// Execute Undo with live-state checking to guarantee 1-click execution
	const executeUndo = useCallback(() => {
		if (historyTimerRef.current) {
			clearTimeout(historyTimerRef.current);
		}
		const currentValues = getValues();
		const prev = history.undo(currentValues);
		if (prev) {
			reset(prev);
			setAutoSaveResetKey((k) => k + 1);
			if (prev.name && onNameChange) {
				onNameChange(prev.name);
			}
			if (prev.headerImage !== undefined && onHeaderImageChange) {
				onHeaderImageChange(prev.headerImage);
			}
		}
	}, [history, reset, getValues, onNameChange, onHeaderImageChange]);

	// Execute Redo with live-state checking to guarantee 1-click execution
	const executeRedo = useCallback(() => {
		if (historyTimerRef.current) {
			clearTimeout(historyTimerRef.current);
		}
		const currentValues = getValues();
		const next = history.redo(currentValues);
		if (next) {
			reset(next);
			setAutoSaveResetKey((k) => k + 1);
			if (next.name && onNameChange) {
				onNameChange(next.name);
			}
			if (next.headerImage !== undefined && onHeaderImageChange) {
				onHeaderImageChange(next.headerImage);
			}
		}
	}, [history, reset, getValues, onNameChange, onHeaderImageChange]);

	// Register Undo / Redo callers with parent page
	useEffect(() => {
		onRegisterUndoRedo?.(executeUndo, executeRedo);
	}, [onRegisterUndoRedo, executeUndo, executeRedo]);

	// Keyboard shortcut listener for Undo (Cmd+Z / Ctrl+Z) and Redo (Cmd+Shift+Z / Cmd+Y / Ctrl+Y)
	useEffect(() => {
		const handleKeyDown = (e) => {
			const isMac = navigator.platform.toUpperCase().indexOf("MAC") >= 0;
			const isModifier = isMac ? e.metaKey : e.ctrlKey;

			if (!isModifier) return;

			// Redo: Cmd+Shift+Z, Cmd+Y, or Ctrl+Y
			if (
				(e.shiftKey && (e.key === "z" || e.key === "Z")) ||
				e.key === "y" ||
				e.key === "Y"
			) {
				if (history.canRedo) {
					e.preventDefault();
					executeRedo();
				}
			}
			// Undo: Cmd+Z or Ctrl+Z
			else if (e.key === "z" || e.key === "Z") {
				if (history.canUndo) {
					e.preventDefault();
					executeUndo();
				}
			}
		};

		window.addEventListener("keydown", handleKeyDown);
		return () => window.removeEventListener("keydown", handleKeyDown);
	}, [history.canUndo, history.canRedo, executeUndo, executeRedo]);

	// Populate form ONLY once when data is fetched, not on background auto-save cache updates
	useEffect(() => {
		const currentFormKey = existingForm?._id || formId;

		if (existingForm && loadedFormIdRef.current !== currentFormKey) {
			loadedFormIdRef.current = currentFormKey;
			const initialData = {
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
			};

			reset(initialData);
			history.setInitial(initialData);

			if (onNameChange) {
				onNameChange(
					existingForm.name || existingForm.title || "Untitled form"
				);
			}
			if (onHeaderImageChange && existingForm.headerImage) {
				onHeaderImageChange(existingForm.headerImage);
			}
			// Reset auto-save baseline AFTER server data is populated
			setAutoSaveResetKey((k) => k + 1);
			onSaveStatusChange?.("saved");
		} else if (!formId && !loadedFormIdRef.current) {
			loadedFormIdRef.current = "guest_draft";
			try {
				const localDraft = localStorage.getItem("google_form_draft");
				if (localDraft) {
					const parsed = JSON.parse(localDraft);
					if (parsed && typeof parsed === "object") {
						reset(parsed);
						history.setInitial(parsed);
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
										"google_form_draft"
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
										err
									);
									onSaveStatusChange?.("error");
								})
								.finally(() => {
									isCreatingFormRef.current = false;
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
		history,
	]);

	const { fields, insert, remove, move } = useFieldArray({
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
						JSON.stringify(formData)
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

	const [isAIQuestionModalOpen, setIsAIQuestionModalOpen] = useState(false);

	const currentItems = getValues("items") || [];
	const activeItemIndex = activeSection > 0 ? activeSection - 1 : null;
	const activeItem =
		activeItemIndex !== null
			? currentItems[activeItemIndex] || fields[activeItemIndex]
			: null;

	const activeContext =
		activeSection === 0
			? {
					isHeader: true,
					title: getValues("title") || "Untitled form",
					description: getValues("description") || "",
			  }
			: activeItem;

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

	// Insert one or multiple questions generated by Gemini AI sequentially below active section
	const handleInsertAIQuestions = (questions) => {
		if (!Array.isArray(questions) || questions.length === 0) return;
		const targetIndex = activeSection === 0 ? 0 : activeSection;

		questions.forEach((q, idx) => {
			insert(targetIndex + idx, q);
		});

		setActiveSection(targetIndex + questions.length);
	};

	// Update active question with AI-generated question
	const handleUpdateAIQuestion = (updatedQuestion) => {
		if (!updatedQuestion || activeItemIndex === null) return;
		setValue(`items.${activeItemIndex}`, updatedQuestion, {
			shouldDirty: true,
		});
	};

	// Update form header with AI-generated title & description
	const handleUpdateAIHeader = (updatedHeader) => {
		if (!updatedHeader) return;
		if (updatedHeader.title) {
			setValue("title", updatedHeader.title, { shouldDirty: true });
		}
		if (updatedHeader.description !== undefined) {
			setValue("description", updatedHeader.description, {
				shouldDirty: true,
			});
		}
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

	// Insert standalone image section immediately below the active section
	const handleAddImage = () => {
		const targetIndex = activeSection === 0 ? 0 : activeSection;
		insert(targetIndex, {
			type: "image",
			title: "Image title",
			image: "",
			imageAlignment: "center",
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

	const handleMoveField = (fromIndex, toIndex) => {
		if (fromIndex === toIndex) return;
		move(fromIndex, toIndex);
		setActiveSection(toIndex + 1);
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

	const handleAISuccess = async (generatedData) => {
		if (!generatedData) return;
		const formName = generatedData.name || "Untitled form";
		const formTitle = generatedData.title || "Untitled form";
		const formDescription = generatedData.description || "";
		const formItems = generatedData.items || [];
		const formHeaderImage = generatedData.headerImage || "";

		setIsAIPromptModalOpen(false);

		const formPayload = {
			name: formName,
			title: formTitle,
			description: formDescription,
			headerImage: formHeaderImage,
			items: formItems,
		};

		if (formId && isAuthenticated) {
			// Updating an existing form in the editor
			setValue("name", formName, { shouldDirty: true });
			setValue("title", formTitle, { shouldDirty: true });
			setValue("description", formDescription, { shouldDirty: true });
			setValue("items", formItems, { shouldDirty: true });
			if (formHeaderImage) {
				setValue("headerImage", formHeaderImage, { shouldDirty: true });
			}
			onNameChange?.(formName);
			onSaveStatusChange?.("saving");
			try {
				await updateForm({ id: formId, ...formPayload }).unwrap();
				setAutoSaveResetKey((k) => k + 1);
				onSaveStatusChange?.("saved");
			} catch (err) {
				console.error("Failed to update form with AI:", err);
				onSaveStatusChange?.("error");
			}
		} else if (isAuthenticated) {
			// Creating a new form from /forms/create
			onSaveStatusChange?.("saving");
			try {
				const res = await createForm(formPayload).unwrap();
				const newId = res?._id || res?.data?._id;
				localStorage.removeItem("google_form_draft");
				onSaveStatusChange?.("saved");
				if (newId) {
					navigate(`/forms/${newId}/edit`, { replace: true });
				}
			} catch (err) {
				console.error("Failed to create form with AI:", err);
				onSaveStatusChange?.("error");
			}
		} else {
			// Guest user
			setValue("name", formName, { shouldDirty: true });
			setValue("title", formTitle, { shouldDirty: true });
			setValue("description", formDescription, { shouldDirty: true });
			setValue("items", formItems, { shouldDirty: true });
			if (formHeaderImage) {
				setValue("headerImage", formHeaderImage, { shouldDirty: true });
			}
			onNameChange?.(formName);
			localStorage.setItem("google_form_draft", JSON.stringify(formPayload));
			setAutoSaveResetKey((k) => k + 1);
			onSaveStatusChange?.("draft");
			if (searchParams.get("ai")) {
				navigate(window.location.pathname, { replace: true });
			}
		}
	};

	const handleCloseAIPromptModal = () => {
		setIsAIPromptModalOpen(false);
		if (searchParams.get("ai")) {
			navigate(window.location.pathname, { replace: true });
		}
	};

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
							onAddAIQuestion={() => setIsAIQuestionModalOpen(true)}
							onAddTitle={handleAddTitle}
							onAddImage={handleAddImage}
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
					onMoveField={handleMoveField}
				/>
			</div>

			{/* Modal prompting guests to sign in or register to persist forms */}
			<AuthPromptModal
				isOpen={showAuthModal}
				onClose={() => setShowAuthModal(false)}
				title="Sign in to save"
				message="Sign in or create an account to save this form and start collecting responses."
			/>

			{/* Full Form AI Generator Modal */}
			<AIPromptModal
				isOpen={isAIPromptModalOpen}
				onClose={handleCloseAIPromptModal}
				onSuccess={handleAISuccess}
			/>

			{/* Dual-Mode Modal for adding or editing questions with Gemini AI */}
			<AIQuestionModal
				isOpen={isAIQuestionModalOpen}
				onClose={() => setIsAIQuestionModalOpen(false)}
				onInsertQuestions={handleInsertAIQuestions}
				onUpdateQuestion={handleUpdateAIQuestion}
				onUpdateHeader={handleUpdateAIHeader}
				activeContext={activeContext}
				formTitle={getValues("title") || ""}
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
	onHistoryChange: PropTypes.func,
	onRegisterUndoRedo: PropTypes.func,
};

export default CreateOrEditForm;
