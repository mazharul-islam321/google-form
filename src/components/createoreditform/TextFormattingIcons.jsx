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
import LinkPreviewPopover from "../common/LinkPreviewPopover";

const TextFormattingIcons = forwardRef(
	({ targetRef, onFormat, forDes = false }, ref) => {
		const [isLinkModalOpen, setIsLinkModalOpen] = useState(false);
		const [selectedText, setSelectedText] = useState("");
		const [initialUrl, setInitialUrl] = useState("");
		const [savedRange, setSavedRange] = useState(null);
		const [editingAnchor, setEditingAnchor] = useState(null);

		const [activeStates, setActiveStates] = useState({
			bold: false,
			italic: false,
			underline: false,
			link: false,
			orderedList: false,
			unorderedList: false,
		});

		const checkActiveStates = () => {
			try {
				const sel = window.getSelection();
				const isInsideLink = Boolean(
					sel?.anchorNode?.nodeType === Node.ELEMENT_NODE
						? sel.anchorNode.closest("a")
						: sel?.anchorNode?.parentElement?.closest("a")
				);

				setActiveStates({
					bold: document.queryCommandState("bold"),
					italic: document.queryCommandState("italic"),
					underline: document.queryCommandState("underline"),
					link: isInsideLink,
					orderedList:
						document.queryCommandState("insertOrderedList"),
					unorderedList:
						document.queryCommandState("insertUnorderedList"),
				});
			} catch {
				// queryCommandState edge cases
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

			// If updating an existing link
			if (formatType === "link" && editingAnchor) {
				editingAnchor.setAttribute("href", payload.url);
				editingAnchor.innerText = payload.text || payload.url;
				setEditingAnchor(null);
				const updatedHTML = el.innerHTML;
				el.dispatchEvent(new Event("input", { bubbles: true }));
				onFormat?.(updatedHTML);
				checkActiveStates();
				return;
			}

			// If inserting a new link with saved selection range
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
			const anchor =
				sel?.anchorNode?.nodeType === Node.ELEMENT_NODE
					? sel.anchorNode.closest("a")
					: sel?.anchorNode?.parentElement?.closest("a");

			// If currently inside a link, clicking link icon toggles it OFF (removes the link)
			if (activeStates.link || (anchor && anchor.isContentEditable)) {
				if (anchor) {
					handleRemoveExistingLink(anchor);
					return;
				}
				document.execCommand("unlink", false, null);
				const el = targetRef?.current;
				if (el) {
					const updatedHTML = el.innerHTML;
					el.dispatchEvent(new Event("input", { bubbles: true }));
					onFormat?.(updatedHTML);
				}
				checkActiveStates();
				return;
			}

			if (sel && sel.rangeCount > 0) {
				const range = sel.getRangeAt(0);
				setSavedRange(range.cloneRange());
				setSelectedText(sel.toString());
			} else {
				setSavedRange(null);
				setSelectedText("");
			}
			setInitialUrl("");
			setEditingAnchor(null);
			setIsLinkModalOpen(true);
		};

		const handleEditExistingLink = (anchor) => {
			setEditingAnchor(anchor);
			setSelectedText(anchor.innerText || "");
			setInitialUrl(anchor.getAttribute("href") || "");
			setIsLinkModalOpen(true);
		};

		const handleRemoveExistingLink = (anchor) => {
			const el = targetRef?.current;
			if (!anchor || !el) return;

			// Replace anchor with its plain text contents
			const textNode = document.createTextNode(anchor.innerText);
			anchor.parentNode?.replaceChild(textNode, anchor);

			const updatedHTML = el.innerHTML;
			el.dispatchEvent(new Event("input", { bubbles: true }));
			onFormat?.(updatedHTML);
			checkActiveStates();
		};

		return (
			<>
				<div
					ref={ref}
					className="flex mt-2 gap-1 items-center select-none"
					onMouseDown={(e) => e.preventDefault()}
				>
					{/* Bold */}
					<button
						type="button"
						onMouseDown={(e) => e.preventDefault()}
						onClick={() => handleApply("bold")}
						className={`p-1.5 rounded-md transition cursor-pointer ${
							activeStates.bold
								? "bg-[#e8eaed] text-[#202124] font-bold"
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
						className={`p-1.5 rounded-md transition cursor-pointer ${
							activeStates.italic
								? "bg-[#e8eaed] text-[#202124]"
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
						className={`p-1.5 rounded-md transition cursor-pointer ${
							activeStates.underline
								? "bg-[#e8eaed] text-[#202124]"
								: "text-[#5f6368] hover:bg-slate-100 hover:text-[#202124]"
						}`}
						title="Underline"
					>
						<MdOutlineFormatUnderlined fontSize="1.5em" />
					</button>

					{/* Insert/Remove Link (Toggle) */}
					<button
						type="button"
						onMouseDown={(e) => e.preventDefault()}
						onClick={handleOpenLinkModal}
						className={`p-1.5 rounded-md transition cursor-pointer ${
							activeStates.link
								? "bg-[#e8eaed] text-[#202124]"
								: "text-[#5f6368] hover:bg-slate-100 hover:text-[#202124]"
						}`}
						title={activeStates.link ? "Remove link" : "Insert link"}
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
								className={`p-1.5 rounded-md transition cursor-pointer ${
									activeStates.orderedList
										? "bg-[#e8eaed] text-[#202124]"
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
								className={`p-1.5 rounded-md transition cursor-pointer ${
									activeStates.unorderedList
										? "bg-[#e8eaed] text-[#202124]"
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
						className="p-1.5 rounded-md text-[#5f6368] hover:bg-slate-100 hover:text-[#202124] transition cursor-pointer"
						title="Remove formatting"
					>
						<MdFormatClear fontSize="1.5em" />
					</button>
				</div>

				{/* Floating Link Tooltip Popover (Edit & Unlink) */}
				<LinkPreviewPopover
					onEditLink={handleEditExistingLink}
					onRemoveLink={handleRemoveExistingLink}
					isModalOpen={isLinkModalOpen}
				/>

				<InsertLinkModal
					isOpen={isLinkModalOpen}
					onClose={() => {
						setIsLinkModalOpen(false);
						setEditingAnchor(null);
					}}
					initialText={selectedText}
					initialUrl={initialUrl}
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
