import { useState, useEffect, forwardRef } from "react";
import PropTypes from "prop-types";
import {
	MdOutlineInsertLink,
	MdFormatListBulleted,
	MdFormatListNumbered,
	MdOutlineFormatBold,
	MdOutlineFormatItalic,
	MdOutlineFormatUnderlined,
	MdFormatClear,
} from "react-icons/md";
import { applyInlineFormat } from "../../utils/textFormatting";
import InsertLinkModal from "../modals/InsertLinkModal";

const TextFormattingIcons = forwardRef(
	({ targetRef, onFormat, forDes = false }, ref) => {
		const [isLinkModalOpen, setIsLinkModalOpen] = useState(false);
		const [selectedText, setSelectedText] = useState("");
		const [savedRange, setSavedRange] = useState(null);

		const [activeStates, setActiveStates] = useState({
			bold: false,
			italic: false,
			underline: false,
			orderedList: false,
			unorderedList: false,
		});

		const checkActiveStates = () => {
			try {
				setActiveStates({
					bold: document.queryCommandState("bold"),
					italic: document.queryCommandState("italic"),
					underline: document.queryCommandState("underline"),
					orderedList:
						document.queryCommandState("insertOrderedList"),
					unorderedList:
						document.queryCommandState("insertUnorderedList"),
				});
			} catch {
				// queryCommandState not supported in some edge environments
			}
		};

		useEffect(() => {
			checkActiveStates();
			document.addEventListener("selectionchange", checkActiveStates);
			return () =>
				document.removeEventListener(
					"selectionchange",
					checkActiveStates
				);
		}, []);

		const handleApply = (formatType, payload = {}) => {
			const el = targetRef?.current;
			if (!el) return;

			// If inserting link and we have a saved range, restore it first
			if (formatType === "link" && savedRange) {
				const sel = window.getSelection();
				sel?.removeAllRanges();
				sel?.addRange(savedRange);
			}

			const updatedText = applyInlineFormat(el, formatType, payload);
			if (updatedText !== null) {
				onFormat?.(updatedText);
			}
			checkActiveStates();
		};

		const handleOpenLinkModal = () => {
			const sel = window.getSelection();
			if (sel && sel.rangeCount > 0) {
				const range = sel.getRangeAt(0);
				setSavedRange(range.cloneRange());
				setSelectedText(sel.toString());
			} else {
				setSavedRange(null);
				setSelectedText("");
			}
			setIsLinkModalOpen(true);
		};

		return (
			<>
				<div
					ref={ref}
					className="flex mt-2 gap-1.5 items-center select-none"
					onMouseDown={(e) => e.preventDefault()}
				>
					{/* Bold */}
					<button
						type="button"
						onMouseDown={(e) => e.preventDefault()}
						onClick={() => handleApply("bold")}
						className={`p-1.5 rounded transition cursor-pointer ${
							activeStates.bold
								? "bg-purple-100 text-[#673ab7]"
								: "text-[#5f6368] hover:bg-slate-100 hover:text-[#202124]"
						}`}
						title="Bold"
					>
						<MdOutlineFormatBold fontSize="1.5em" />
					</button>

					{/* Italic */}
					<button
						type="button"
						onMouseDown={(e) => e.preventDefault()}
						onClick={() => handleApply("italic")}
						className={`p-1.5 rounded transition cursor-pointer ${
							activeStates.italic
								? "bg-purple-100 text-[#673ab7]"
								: "text-[#5f6368] hover:bg-slate-100 hover:text-[#202124]"
						}`}
						title="Italic"
					>
						<MdOutlineFormatItalic fontSize="1.5em" />
					</button>

					{/* Underline */}
					<button
						type="button"
						onMouseDown={(e) => e.preventDefault()}
						onClick={() => handleApply("underline")}
						className={`p-1.5 rounded transition cursor-pointer ${
							activeStates.underline
								? "bg-purple-100 text-[#673ab7]"
								: "text-[#5f6368] hover:bg-slate-100 hover:text-[#202124]"
						}`}
						title="Underline"
					>
						<MdOutlineFormatUnderlined fontSize="1.5em" />
					</button>

					{/* Insert Link */}
					<button
						type="button"
						onMouseDown={(e) => e.preventDefault()}
						onClick={handleOpenLinkModal}
						className="p-1.5 rounded hover:bg-slate-100 text-[#5f6368] hover:text-[#202124] transition cursor-pointer"
						title="Insert link"
					>
						<MdOutlineInsertLink fontSize="1.5em" />
					</button>

					{/* Lists for Description */}
					{forDes && (
						<>
							<button
								type="button"
								onMouseDown={(e) => e.preventDefault()}
								onClick={() => handleApply("numberedList")}
								className={`p-1.5 rounded transition cursor-pointer ${
									activeStates.orderedList
										? "bg-purple-100 text-[#673ab7]"
										: "text-[#5f6368] hover:bg-slate-100 hover:text-[#202124]"
								}`}
								title="Numbered list"
							>
								<MdFormatListNumbered fontSize="1.5em" />
							</button>

							<button
								type="button"
								onMouseDown={(e) => e.preventDefault()}
								onClick={() => handleApply("bulletedList")}
								className={`p-1.5 rounded transition cursor-pointer ${
									activeStates.unorderedList
										? "bg-purple-100 text-[#673ab7]"
										: "text-[#5f6368] hover:bg-slate-100 hover:text-[#202124]"
								}`}
								title="Bulleted list"
							>
								<MdFormatListBulleted fontSize="1.5em" />
							</button>
						</>
					)}

					{/* Clear Formatting */}
					<button
						type="button"
						onMouseDown={(e) => e.preventDefault()}
						onClick={() => handleApply("clear")}
						className="p-1.5 rounded hover:bg-slate-100 text-[#5f6368] hover:text-[#202124] transition cursor-pointer"
						title="Remove formatting"
					>
						<MdFormatClear fontSize="1.5em" />
					</button>
				</div>

				<InsertLinkModal
					isOpen={isLinkModalOpen}
					onClose={() => setIsLinkModalOpen(false)}
					initialText={selectedText}
					onSave={(linkData) => handleApply("link", linkData)}
				/>
			</>
		);
	}
);

TextFormattingIcons.displayName = "TextFormattingIcons";

TextFormattingIcons.propTypes = {
	targetRef: PropTypes.object,
	onFormat: PropTypes.func,
	forDes: PropTypes.bool,
};

export default TextFormattingIcons;
