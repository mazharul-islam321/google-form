import PropTypes from "prop-types";

/**
 * Safely renders rich formatted text supporting both HTML (WYSIWYG) and Markdown legacy strings.
 */
const FormattedText = ({ text = "", className = "" }) => {
	if (!text) return null;

	let cleanHTML = String(text);

	// Convert legacy markdown syntax if present
	if (
		cleanHTML.includes("**") ||
		cleanHTML.includes("*") ||
		cleanHTML.includes("[")
	) {
		cleanHTML = cleanHTML
			.replace(/\*\*(.*?)\*\*/g, "<b>$1</b>")
			.replace(/\*(.*?)\*/g, "<i>$1</i>")
			.replace(
				/\[(.*?)\]\((.*?)\)/g,
				'<a href="$2" target="_blank" rel="noopener noreferrer" class="text-[#673ab7] underline hover:text-[#512da8]">$1</a>'
			);
	}

	return (
		<span
			className={`inline-block [&_ol]:list-decimal [&_ol]:pl-6 [&_ul]:list-disc [&_ul]:pl-6 [&_li]:my-0.5 [&_a]:text-[#673ab7] [&_a]:underline ${className}`}
			dangerouslySetInnerHTML={{ __html: cleanHTML }}
		/>
	);
};

FormattedText.propTypes = {
	text: PropTypes.string,
	className: PropTypes.string,
};

export default FormattedText;
