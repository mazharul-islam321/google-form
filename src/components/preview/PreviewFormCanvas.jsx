import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { useLocation, useNavigate } from "react-router-dom";
import FormattedText from "../common/FormattedText";
import {
	MdErrorOutline,
	MdOutlineCloudQueue,
	MdCheckBox,
	MdCheckBoxOutlineBlank,
} from "react-icons/md";
import PreviewQuestionCard from "./PreviewQuestionCard";
import AuthPromptModal from "../modals/AuthPromptModal";
import useAuth from "../../hooks/useAuth";
import { useSubmitResponseMutation } from "../../redux/api/formApi";

const PreviewFormCanvas = ({ form, mode = "preview" }) => {
	const location = useLocation();
	const navigate = useNavigate();
	const { user, signOut, isLoading: isAuthLoading } = useAuth();

	const [answers, setAnswers] = useState({});
	const [respondentEmail, setRespondentEmail] = useState("");
	const [recordEmailChecked, setRecordEmailChecked] = useState(true);
	const [emailError, setEmailError] = useState(false);
	const [errors, setErrors] = useState({});
	const [isSubmitted, setIsSubmitted] = useState(false);
	const [serverError, setServerError] = useState("");

	const [submitResponse, { isLoading: isSubmitting }] =
		useSubmitResponseMutation();

	const items = form?.items || [];
	const settings = form?.settings || {};
	const headerImage = form?.headerImage;
	const isViewMode = mode === "view";

	// Check if form requires authentication
	const requiresAuth =
		settings.collectEmail === "verified" ||
		settings.limitOneResponse === true;

	const [showAuthModal, setShowAuthModal] = useState(false);

	useEffect(() => {
		if (isViewMode && requiresAuth && !isAuthLoading && !user) {
			setShowAuthModal(true);
		} else {
			setShowAuthModal(false);
		}
	}, [isViewMode, requiresAuth, isAuthLoading, user]);

	// Pre-fill email if user is logged in
	useEffect(() => {
		if (user?.email && !respondentEmail) {
			setRespondentEmail(user.email);
		}
	}, [user, respondentEmail]);

	// Check if form is closed or past deadline
	const isManuallyClosed = settings.isAcceptingResponses === false;
	const isPastDeadline =
		settings.deadline &&
		!isNaN(new Date(settings.deadline).getTime()) &&
		new Date() > new Date(settings.deadline);
	const isClosed = isManuallyClosed || isPastDeadline;

	const handleSwitchAccount = async () => {
		try {
			await signOut();
		} catch (err) {
			console.error("Sign out error:", err);
		}
		const currentUrl = location.pathname + location.search;
		navigate(`/login?redirect=${encodeURIComponent(currentUrl)}`);
	};

	const handleAnswerChange = (index, value) => {
		setAnswers((prev) => ({ ...prev, [index]: value }));
		if (errors[index]) {
			setErrors((prev) => ({ ...prev, [index]: false }));
		}
	};

	const handleClearForm = () => {
		if (window.confirm("Clear all your answers?")) {
			setAnswers({});
			setRespondentEmail(user?.email || "");
			setRecordEmailChecked(true);
			setErrors({});
			setEmailError(false);
			setServerError("");
		}
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		if (!isViewMode || !form?._id) return;
		setServerError("");

		// If form requires auth and user is not logged in, block and show modal
		if (requiresAuth && !user) {
			setShowAuthModal(true);
			return;
		}

		// Validate email based on settings mode
		let hasEmailError = false;

		if (settings.collectEmail === "verified") {
			if (!recordEmailChecked) {
				setEmailError(true);
				hasEmailError = true;
			} else {
				setEmailError(false);
			}
		} else if (settings.collectEmail === "responder_input") {
			const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
			if (!respondentEmail || !emailRegex.test(respondentEmail)) {
				setEmailError(true);
				hasEmailError = true;
			} else {
				setEmailError(false);
			}
		}

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

		if (hasValidationFailure || hasEmailError) {
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
				respondentEmail:
					settings.collectEmail === "verified"
						? user?.email
						: settings.collectEmail === "responder_input"
						? respondentEmail
						: undefined,
				answers: formattedAnswers,
			}).unwrap();
			setIsSubmitted(true);
		} catch (err) {
			console.error("Failed to submit form:", err);
			setServerError(
				err?.data?.message ||
					"Failed to submit form. Please check your responses and try again."
			);
		}
	};

	const redirectParam = encodeURIComponent(
		location.pathname + location.search
	);

	// 1. Closed / Expired Form View
	if (isClosed && isViewMode) {
		return (
			<div className="w-full max-w-[770px] mx-auto px-4 py-8">
				{headerImage && (
					<div className="w-full h-[160px] md:h-[200px] rounded-lg overflow-hidden bg-white border border-[#dadce0] shadow-sm mb-4">
						<img
							src={headerImage}
							alt="Form header"
							className="w-full h-full object-cover"
						/>
					</div>
				)}

				<div className="w-full bg-white rounded-lg border border-[#dadce0] border-t-8 border-t-[#673ab7] p-8 shadow-sm">
					<h1 className="text-2xl md:text-3xl font-normal text-[#202124] mb-3">
						{form?.title || "Untitled form"}
					</h1>
					<p className="text-base text-[#202124] mb-6">
						{settings.closedFormMessage ||
							"This form is no longer accepting responses."}
					</p>
					<p className="text-xs text-[#5f6368]">
						Try contacting the owner of the form if you think this is a mistake.
					</p>
				</div>

				<div className="text-center mt-10 text-xs text-gray-400">
					<p>This form was created inside Google Form Clone.</p>
				</div>
			</div>
		);
	}

	// 2. Submitted Confirmation Screen
	if (isSubmitted) {
		return (
			<div className="w-full max-w-[770px] mx-auto px-4 py-8">
				{headerImage && (
					<div className="w-full h-[160px] md:h-[200px] rounded-lg overflow-hidden bg-white border border-[#dadce0] shadow-sm mb-4">
						<img
							src={headerImage}
							alt="Form header"
							className="w-full h-full object-cover"
						/>
					</div>
				)}

				<div className="w-full bg-white rounded-lg border border-[#dadce0] border-t-8 border-t-[#673ab7] p-8 shadow-sm">
					<h1 className="text-2xl md:text-3xl font-normal text-[#202124] mb-3">
						{form?.title || "Untitled form"}
					</h1>
					<p className="text-base text-[#202124] mb-6">
						{settings.confirmationMessage ||
							"Your response has been recorded."}
					</p>

					{settings.showSubmitAnotherLink !== false &&
						!settings.limitOneResponse && (
							<button
								type="button"
								onClick={() => {
									setAnswers({});
									setRespondentEmail(user?.email || "");
									setRecordEmailChecked(true);
									setErrors({});
									setEmailError(false);
									setServerError("");
									setIsSubmitted(false);
								}}
								className="text-sm text-[#673ab7] hover:underline font-medium cursor-pointer"
							>
								Submit another response
							</button>
						)}
				</div>

				<div className="text-center mt-10 text-xs text-gray-400">
					<p>This form was created inside Google Form Clone.</p>
				</div>
			</div>
		);
	}

	return (
		<>
			<form
				onSubmit={handleSubmit}
				className="w-full max-w-[770px] mx-auto px-4 py-8"
			>
				{/* Standalone Header Banner if present */}
				{headerImage && (
					<div className="w-full h-[160px] md:h-[200px] rounded-lg overflow-hidden bg-white border border-[#dadce0] shadow-sm mb-3">
						<img
							src={headerImage}
							alt="Form header banner"
							className="w-full h-full object-cover"
						/>
					</div>
				)}

				{/* Top Form Title Card */}
				<div className="w-full bg-white rounded-lg border border-[#dadce0] border-t-8 border-t-[#673ab7] p-6 shadow-sm mb-4">
					<h1 className="text-2xl md:text-3xl font-normal text-[#202124] mb-3 break-words">
						<FormattedText text={form?.title || "Untitled form"} />
					</h1>

					{form?.description && (
						<p className="text-sm text-[#202124] whitespace-pre-wrap break-words mb-4 leading-relaxed">
							<FormattedText text={form.description} />
						</p>
					)}

					{/* Logged in User Account OR "Sign in to Google to save your progress" on the same position */}
					{user ? (
						<div className="mt-4 pt-3 border-t border-gray-200 text-sm text-[#202124] flex items-center justify-between flex-wrap gap-2">
							<div className="flex items-center gap-2">
								<span className="font-semibold text-slate-800">
									{user.email}
								</span>
								<button
									type="button"
									onClick={handleSwitchAccount}
									className="text-[#1a73e8] hover:underline font-normal text-sm cursor-pointer"
								>
									Switch account
								</button>
							</div>
						</div>
					) : (
						<div className="mt-4 pt-3 border-t border-gray-200 text-xs text-[#5f6368] flex items-center justify-between flex-wrap gap-2">
							<div className="flex items-center gap-1.5">
								<MdOutlineCloudQueue className="text-base text-[#5f6368] shrink-0" />
								<span>Sign in to submit this form with your account.</span>
							</div>

							<button
								type="button"
								onClick={() =>
									navigate(`/login?redirect=${redirectParam}`)
								}
								className="text-xs text-[#1a73e8] border border-[#dadce0] hover:bg-blue-50/50 font-medium px-3.5 py-1.5 rounded cursor-pointer transition shrink-0"
							>
								Sign in
							</button>
						</div>
					)}

					{/* Required Indicator */}
					<div className="mt-2.5 text-xs text-red-600">
						<span>* Indicates required question</span>
					</div>
				</div>

				{/* 1. Verified Account Consent Card with Form-styled Checkbox */}
				{settings.collectEmail === "verified" && (
					<div
						className={`w-full bg-white rounded-lg border p-6 shadow-sm mb-4 transition duration-150 ${
							emailError ? "border-red-500" : "border-[#dadce0]"
						}`}
					>
						<div className="mb-3">
							<p className="text-base font-normal text-[#202124]">
								Email <span className="text-red-500">*</span>
							</p>
						</div>

						<div
							onClick={() => {
								setRecordEmailChecked((prev) => !prev);
								if (emailError) setEmailError(false);
							}}
							className="flex items-start gap-3 cursor-pointer text-sm text-[#202124] select-none group py-0.5"
						>
							<div className="flex-shrink-0 transition duration-150 mt-0.5">
								{recordEmailChecked ? (
									<MdCheckBox
										fontSize="1.7em"
										className="text-[#673ab7]"
									/>
								) : (
									<MdCheckBoxOutlineBlank
										fontSize="1.7em"
										className="text-[#5f6368] group-hover:text-[#202124]"
									/>
								)}
							</div>
							<span className="leading-snug">
								Record{" "}
								<strong className="font-semibold text-slate-900">
									{user?.email || "your email"}
								</strong>{" "}
								as the email to be included with my response
							</span>
						</div>

						{emailError && (
							<div className="flex items-center gap-1.5 text-red-500 text-xs mt-3">
								<MdErrorOutline fontSize="1.2em" />
								<span>
									You must consent to record your email address to submit this form
								</span>
							</div>
						)}
					</div>
				)}

				{/* 2. Responder Input Manual Email Collection Card */}
				{settings.collectEmail === "responder_input" && (
					<div
						className={`w-full bg-white rounded-lg border p-6 shadow-sm mb-4 transition duration-150 ${
							emailError ? "border-red-500" : "border-[#dadce0]"
						}`}
					>
						<div className="mb-4">
							<p className="text-base font-normal text-[#202124]">
								Email <span className="text-red-500">*</span>
							</p>
						</div>

						<div className="w-full max-w-sm">
							<input
								type="email"
								value={respondentEmail}
								onChange={(e) => {
									setRespondentEmail(e.target.value);
									if (emailError) setEmailError(false);
								}}
								placeholder="Your email"
								className="w-full border-b border-[#dadce0] focus:border-b-2 focus:border-[#673ab7] outline-none text-sm text-[#202124] placeholder-[#70757a] pb-1.5 bg-transparent transition-colors duration-150"
							/>
						</div>

						{emailError && (
							<div className="flex items-center gap-1.5 text-red-500 text-xs mt-3">
								<MdErrorOutline fontSize="1.2em" />
								<span>Must be a valid email address</span>
							</div>
						)}
					</div>
				)}

				{/* Server Error Alert Banner */}
				{serverError && (
					<div className="w-full bg-red-50 border border-red-200 text-red-700 text-sm p-4 rounded-lg mb-4 flex items-center gap-2">
						<MdErrorOutline className="text-lg flex-shrink-0" />
						<span>{serverError}</span>
					</div>
				)}

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

			{/* Gatekeeper Sign-in Required Modal */}
			<AuthPromptModal
				isOpen={showAuthModal}
				onClose={() => setShowAuthModal(false)}
				title="Sign in to continue"
				message={
					settings.limitOneResponse
						? "This form requires you to sign in with an account because responses are limited to 1 per person."
						: "This form requires you to sign in with an account to view and submit your verified email."
				}
				redirectUrl={`/login?redirect=${redirectParam}`}
			/>
		</>
	);
};

PreviewFormCanvas.propTypes = {
	form: PropTypes.shape({
		_id: PropTypes.string,
		title: PropTypes.string,
		description: PropTypes.string,
		headerImage: PropTypes.string,
		settings: PropTypes.object,
		items: PropTypes.arrayOf(PropTypes.object),
	}),
	mode: PropTypes.oneOf(["preview", "view"]),
};

export default PreviewFormCanvas;
