import { useState, useRef, useEffect } from "react";
import PropTypes from "prop-types";
import { MdOutlineImage, MdOutlineClose } from "react-icons/md";
import MainTitleAndDesForm from "../mainTitleAndDescriptionForm/MainTitleAndDesForm";
import UserEditForm from "../userEditForm/UserEditForm";
import TitleAndDesForm from "../generalTitleAndDescriptionForm/TitleAndDesForm";
import ImageSectionForm from "../imageSectionForm/ImageSectionForm";
import ImagePickerModal from "../../modals/ImagePickerModal";

const FormSectionList = ({
	activeSection,
	onSectionClick,
	sectionRefs,
	register,
	control,
	setValue,
	fields,
	headerImage,
	onHeaderImageChange,
	onDeleteField,
	onDuplicateField,
	onMoveField,
}) => {
	const [isBannerModalOpen, setIsBannerModalOpen] = useState(false);

	const [dragCardState, setDragCardState] = useState({
		isDragging: false,
		dragIdx: null,
		dragY: 0,
		targetIdx: null,
		draggedHeight: 0,
	});

	const dragCardStateRef = useRef(dragCardState);
	dragCardStateRef.current = dragCardState;

	const startYRef = useRef(0);
	const cardLayoutsRef = useRef([]);
	const rafIdRef = useRef(null);
	const latestPointerYRef = useRef(0);

	const handlePointerDownCardDrag = (e, fieldIdx) => {
		e.preventDefault();
		e.stopPropagation();

		startYRef.current = e.clientY;
		latestPointerYRef.current = e.clientY;
		const draggedEl = sectionRefs.current[fieldIdx + 1];
		const cardHeight = draggedEl ? draggedEl.offsetHeight : 160;

		// Pre-measure static card layouts ONCE at dragstart to avoid transform feedback loops
		const initialLayouts = fields.map((_, idx) => {
			const el = sectionRefs.current[idx + 1];
			if (!el) return { top: 0, bottom: 0, height: 160, center: 0 };
			const rect = el.getBoundingClientRect();
			return {
				top: rect.top,
				bottom: rect.bottom,
				height: rect.height,
				center: rect.top + rect.height / 2,
			};
		});

		cardLayoutsRef.current = initialLayouts;

		setDragCardState({
			isDragging: true,
			dragIdx: fieldIdx,
			dragY: 0,
			targetIdx: fieldIdx,
			draggedHeight: cardHeight,
		});

		const grabOffset = draggedEl
			? e.clientY - draggedEl.getBoundingClientRect().top
			: 10;

		const updateDragFrame = () => {
			const currentY = latestPointerYRef.current;
			const deltaY = currentY - startYRef.current;
			const layouts = cardLayoutsRef.current;

			// Exact edges of the dragged card
			const draggedCardTop = currentY - grabOffset;
			const draggedCardBottom = draggedCardTop + cardHeight;

			let newTarget = fieldIdx;

			if (layouts && layouts.length > 0) {
				// Moving downward: triggers when bottom of dragged card reaches bottom of target card
				for (let i = fieldIdx + 1; i < layouts.length; i++) {
					if (layouts[i] && draggedCardBottom > layouts[i].bottom - 10) {
						newTarget = i;
					}
				}
				// Moving upward: triggers when top of dragged card reaches top of target card
				for (let i = fieldIdx - 1; i >= 0; i--) {
					if (layouts[i] && draggedCardTop < layouts[i].top + 10) {
						newTarget = i;
					}
				}
			}

			setDragCardState((prev) => ({
				...prev,
				dragY: deltaY,
				targetIdx: newTarget,
			}));

			rafIdRef.current = null;
		};

		const handlePointerMove = (moveEvent) => {
			latestPointerYRef.current = moveEvent.clientY;
			if (!rafIdRef.current) {
				rafIdRef.current = requestAnimationFrame(updateDragFrame);
			}
		};

		const handlePointerUp = () => {
			if (rafIdRef.current) {
				cancelAnimationFrame(rafIdRef.current);
				rafIdRef.current = null;
			}
			window.removeEventListener("pointermove", handlePointerMove);
			window.removeEventListener("pointerup", handlePointerUp);

			const current = dragCardStateRef.current;
			if (
				current.isDragging &&
				current.targetIdx !== null &&
				current.dragIdx !== null
			) {
				if (current.targetIdx !== current.dragIdx) {
					onMoveField?.(current.dragIdx, current.targetIdx);
				} else {
					onSectionClick?.(current.dragIdx + 1);
				}
			}

			setDragCardState({
				isDragging: false,
				dragIdx: null,
				dragY: 0,
				targetIdx: null,
				draggedHeight: 0,
			});
			cardLayoutsRef.current = [];
		};

		window.addEventListener("pointermove", handlePointerMove, {
			passive: true,
		});
		window.addEventListener("pointerup", handlePointerUp);
	};

	useEffect(() => {
		return () => {
			if (rafIdRef.current) {
				cancelAnimationFrame(rafIdRef.current);
			}
			setDragCardState({
				isDragging: false,
				dragIdx: null,
				dragY: 0,
				targetIdx: null,
				draggedHeight: 0,
			});
		};
	}, []);

	return (
		<div className="flex flex-col gap-3">
			{/* Standalone Separated Header Banner Card if present */}
			{headerImage && (
				<div className="w-[780px] h-[160px] md:h-[180px] rounded-lg overflow-hidden bg-white border border-[#DADCE0] shadow-xs relative group">
					<img
						src={headerImage}
						alt="Form header banner"
						className="w-full h-full object-cover"
					/>
					<div className="absolute top-3 right-3 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition duration-150">
						<button
							type="button"
							onClick={() => setIsBannerModalOpen(true)}
							className="bg-white/90 hover:bg-white text-[#202124] text-xs font-medium px-3 py-1.5 rounded-md shadow-md backdrop-blur-xs transition cursor-pointer flex items-center gap-1.5"
						>
							<MdOutlineImage className="text-base text-[#673ab7]" />
							<span>Change banner</span>
						</button>

						<button
							type="button"
							onClick={() => onHeaderImageChange?.("")}
							className="bg-white/90 hover:bg-white text-red-600 p-1.5 rounded-md shadow-md backdrop-blur-xs transition cursor-pointer"
							title="Remove banner"
						>
							<MdOutlineClose className="text-base" />
						</button>
					</div>
				</div>
			)}

			{/* Main Title Form - Always present, Index 0 */}
			<div
				ref={(el) => (sectionRefs.current[0] = el)}
				onClick={() => onSectionClick(0)}
				onFocusCapture={() => onSectionClick(0)}
			>
				<MainTitleAndDesForm
					activeElement={activeSection === 0}
					register={register}
					control={control}
					setValue={setValue}
				/>
			</div>

			{/* Dynamic Question / Title / Image Fields */}
			{fields.map((field, index) => {
				const realIndex = index + 1;
				const isCurrentDragged =
					dragCardState.isDragging &&
					dragCardState.dragIdx === index;

				let cardStyle = {};
				if (isCurrentDragged) {
					cardStyle = {
						transform: `translate3d(0, ${dragCardState.dragY}px, 0)`,
						zIndex: 50,
						transition: "none",
						willChange: "transform",
					};
				} else if (dragCardState.isDragging) {
					const { dragIdx, targetIdx, draggedHeight } =
						dragCardState;
					const offset = (draggedHeight || 160) + 12;

					if (
						dragIdx < targetIdx &&
						index > dragIdx &&
						index <= targetIdx
					) {
						cardStyle = {
							transform: `translate3d(0, -${offset}px, 0)`,
							transition:
								"transform 220ms cubic-bezier(0.2, 1, 0.3, 1)",
							willChange: "transform",
						};
					} else if (
						dragIdx > targetIdx &&
						index < dragIdx &&
						index >= targetIdx
					) {
						cardStyle = {
							transform: `translate3d(0, ${offset}px, 0)`,
							transition:
								"transform 220ms cubic-bezier(0.2, 1, 0.3, 1)",
							willChange: "transform",
						};
					} else {
						cardStyle = {
							transform: "translate3d(0, 0px, 0)",
							transition:
								"transform 220ms cubic-bezier(0.2, 1, 0.3, 1)",
							willChange: "transform",
						};
					}
				}

				return (
					<div
						key={field.id}
						ref={(el) => (sectionRefs.current[realIndex] = el)}
						onClick={() => onSectionClick(realIndex)}
						onFocusCapture={() => onSectionClick(realIndex)}
						style={cardStyle}
						className={`relative transition-shadow duration-200 ${
							isCurrentDragged
								? "shadow-[0_16px_36px_rgba(0,0,0,0.14),0_4px_10px_rgba(0,0,0,0.06)] z-50 rounded-lg scale-[1.015] border-purple-200"
								: ""
						}`}
					>
						{field.type === "question" && (
							<UserEditForm
								activeElement={activeSection === realIndex}
								onDelete={() => onDeleteField(index)}
								onDuplicate={() => onDuplicateField?.(index)}
								onPointerDownDrag={(e) =>
									handlePointerDownCardDrag(e, index)
								}
								register={register}
								control={control}
								setValue={setValue}
								index={index}
								questionType={field.questionType}
							/>
						)}

						{field.type === "title" && (
							<TitleAndDesForm
								activeElement={activeSection === realIndex}
								onDelete={() => onDeleteField(index)}
								onDuplicate={() => onDuplicateField?.(index)}
								onPointerDownDrag={(e) =>
									handlePointerDownCardDrag(e, index)
								}
								register={register}
								control={control}
								setValue={setValue}
								index={index}
							/>
						)}

						{field.type === "image" && (
							<ImageSectionForm
								activeElement={activeSection === realIndex}
								onDelete={() => onDeleteField(index)}
								onDuplicate={() => onDuplicateField?.(index)}
								onPointerDownDrag={(e) =>
									handlePointerDownCardDrag(e, index)
								}
								register={register}
								control={control}
								setValue={setValue}
								index={index}
							/>
						)}
					</div>
				);
			})}

			<ImagePickerModal
				isOpen={isBannerModalOpen}
				onClose={() => setIsBannerModalOpen(false)}
				currentImage={headerImage}
				title="Add Header Banner"
				removeLabel="Remove banner"
				onSave={(url) => onHeaderImageChange?.(url)}
			/>
		</div>
	);
};

FormSectionList.propTypes = {
	activeSection: PropTypes.number.isRequired,
	onSectionClick: PropTypes.func.isRequired,
	sectionRefs: PropTypes.object.isRequired,
	register: PropTypes.func.isRequired,
	control: PropTypes.object.isRequired,
	setValue: PropTypes.func.isRequired,
	fields: PropTypes.array.isRequired,
	headerImage: PropTypes.string,
	onHeaderImageChange: PropTypes.func,
	onDeleteField: PropTypes.func.isRequired,
	onDuplicateField: PropTypes.func,
	onMoveField: PropTypes.func,
};

export default FormSectionList;
