import { useState } from "react";
import PropTypes from "prop-types";
import PreviewQuestionCard from "./PreviewQuestionCard";
import { useSubmitResponseMutation } from "../../redux/api/formApi";

const PreviewFormCanvas = ({ form, mode = "preview" }) => {
	const [answers, setAnswers] = useState({});
	const [errors, setErrors] = useState({});
	const [isSubmitted, setIsSubmitted] = useState(false);

	const [submitResponse, { isLoading: isSubmitting }] =
		useSubmitResponseMutation();

	const items = form?.items || [];
	const isViewMode = mode === "view";

	const handleAnswerChange = (index, value) => {
		setAnswers((prev) => ({ ...prev, [index]: value }));
		if (errors[index]) {
			setErrors((prev) => ({ ...prev, [index]: false }));
		}
	};

	const handleClearForm = () => {
		if (window.confirm("Clear all your answers?")) {
			setAnswers({});
			setErrors({});
		}
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		if (!isViewMode || !form?._id) return;

		// Validate required questions
		const newErrors = {};
		let hasValidationFailure = false;

		items.forEach((item, index) => {
			if (item.type === "question" && item.required) {
				const val = answers[index];
				const isEmpty =
					val === undefined ||
					val === "" ||
					(Array.isArray(val) && val.length === 0);
				if (isEmpty) {
					newErrors[index] = true;
					hasValidationFailure = true;
				}
			}
		});

		if (hasValidationFailure) {
			setErrors(newErrors);
			return;
		}

		// Format payload for backend: [{ itemIndex, value }]
		const formattedAnswers = Object.keys(answers)
			.filter((idx) => {
				const val = answers[idx];
				return (
					val !== undefined &&
					val !== "" &&
					(!Array.isArray(val) || val.length > 0)
				);
			})
			.map((idx) => ({
				itemIndex: Number(idx),
				value: answers[idx],
			}));

		try {
			await submitResponse({
				formId: form._id,
				answers: formattedAnswers,
			}).unwrap();
			setIsSubmitted(true);
		} catch (err) {
			console.error("Failed to submit form:", err);
			alert("Failed to submit form. Please try again.");
		}
	};

	// Submitted Confirmation Screen
	if (isSubmitted) {
		return (
			<div className="w-full max-w-[770px] mx-auto px-4 py-8">
				<div className="w-full bg-white rounded-lg border border-[#dadce0] border-t-8 border-t-[#673ab7] p-8 shadow-sm">
					<h1 className="text-2xl md:text-3xl font-normal text-[#202124] mb-3">
						{form?.title || "Untitled form"}
					</h1>
					<p className="text-base text-[#202124] mb-6">
						Your response has been recorded.
					</p>

					<button
						type="button"
						onClick={() => {
							setAnswers({});
							setErrors({});
							setIsSubmitted(false);
						}}
						className="text-sm text-[#673ab7] hover:underline font-medium cursor-pointer"
					>
						Submit another response
					</button>
				</div>

				<div className="text-center mt-10 text-xs text-gray-400">
					<p>This form was created inside Google Form Clone.</p>
				</div>
			</div>
		);
	}

	return (
		<form
			onSubmit={handleSubmit}
			className="w-full max-w-[770px] mx-auto px-4 py-8"
		>
			{/* Top Banner / Form Title Card */}
			<div className="w-full bg-white rounded-lg border border-[#dadce0] border-t-8 border-t-[#673ab7] p-6 shadow-sm mb-4">
				<h1 className="text-2xl md:text-3xl font-normal text-[#202124] mb-3 break-words">
					{form?.title || "Untitled form"}
				</h1>

				{form?.description && (
					<p className="text-sm text-[#202124] whitespace-pre-wrap break-words mb-4 leading-relaxed">
						{form.description}
					</p>
				)}

				<div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between text-xs text-red-500">
					<span>* Indicates required question</span>
				</div>
			</div>

			{/* Question List */}
			{items.map((item, index) => (
				<PreviewQuestionCard
					key={item._id || index}
					item={item}
					value={answers[index]}
					onChange={
						isViewMode
							? (val) => handleAnswerChange(index, val)
							: undefined
					}
					hasError={errors[index]}
				/>
			))}

			{/* Bottom Action Footer */}
			<div className="flex items-center justify-between mt-6 px-1">
				<div className="flex items-center gap-4">
					{isViewMode ? (
						<button
							type="submit"
							disabled={isSubmitting}
							className="px-6 py-2 bg-[#673ab7] hover:bg-[#5a2ea6] text-white text-sm font-medium rounded shadow-sm transition duration-150 cursor-pointer disabled:opacity-50"
						>
							{isSubmitting ? "Submitting..." : "Submit"}
						</button>
					) : (
						<button
							type="button"
							disabled
							className="px-6 py-2 bg-[#673ab7] text-white text-sm font-medium rounded opacity-50 cursor-not-allowed shadow-none"
							title="Submit is disabled in Preview mode"
						>
							Submit
						</button>
					)}

					<button
						type="button"
						onClick={handleClearForm}
						className="text-sm text-[#673ab7] hover:bg-purple-50 px-3 py-1.5 rounded transition duration-150 cursor-pointer"
					>
						Clear form
					</button>
				</div>

				{!isViewMode && (
					<span className="text-xs text-gray-400 italic">
						Submit is disabled in Preview mode
					</span>
				)}
			</div>

			{/* Google Forms Disclaimer Footer */}
			<div className="text-center mt-10 text-xs text-gray-400">
				<p>This form was created inside Google Form Clone.</p>
			</div>
		</form>
	);
};

PreviewFormCanvas.propTypes = {
	form: PropTypes.shape({
		_id: PropTypes.string,
		title: PropTypes.string,
		description: PropTypes.string,
		items: PropTypes.arrayOf(PropTypes.object),
	}),
	mode: PropTypes.oneOf(["preview", "view"]),
};

export default PreviewFormCanvas;
