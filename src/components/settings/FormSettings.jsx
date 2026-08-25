import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import {
	MdExpandMore,
	MdOutlineEmail,
	MdOutlineSchedule,
	MdOutlineDescription,
	MdCheck,
} from "react-icons/md";
import {
	useGetFormByIdQuery,
	useUpdateFormMutation,
} from "../../redux/api/formApi";

const FormSettings = ({ formId }) => {
	const { data: form, isLoading } = useGetFormByIdQuery(formId, {
		skip: !formId,
	});
	const [updateForm] = useUpdateFormMutation();

	// Local settings state
	const [settings, setSettings] = useState({
		collectEmail: "none",
		limitOneResponse: false,
		deadline: "",
		isAcceptingResponses: true,
		closedFormMessage: "This form is no longer accepting responses.",
		confirmationMessage: "Your response has been recorded.",
		showSubmitAnotherLink: true,
	});

	// Expanded sections
	const [expanded, setExpanded] = useState({
		responses: true,
		deadlines: true,
		presentation: true,
	});

	const [saveFeedback, setSaveFeedback] = useState(false);

	useEffect(() => {
		if (form?.settings) {
			let formattedDeadline = "";
			if (form.settings.deadline) {
				const d = new Date(form.settings.deadline);
				if (!isNaN(d.getTime())) {
					// Format to YYYY-MM-DDTHH:MM for datetime-local input
					const offset = d.getTimezoneOffset() * 60000;
					formattedDeadline = new Date(d.getTime() - offset)
						.toISOString()
						.slice(0, 16);
				}
			}

			setSettings({
				collectEmail: form.settings.collectEmail || "none",
				limitOneResponse: form.settings.limitOneResponse || false,
				deadline: formattedDeadline,
				isAcceptingResponses:
					form.settings.isAcceptingResponses !== false,
				closedFormMessage:
					form.settings.closedFormMessage ||
					"This form is no longer accepting responses.",
				confirmationMessage:
					form.settings.confirmationMessage ||
					"Your response has been recorded.",
				showSubmitAnotherLink:
					form.settings.showSubmitAnotherLink !== false,
			});
		}
	}, [form]);

	const toggleSection = (key) => {
		setExpanded((prev) => ({ ...prev, [key]: !prev[key] }));
	};

	const handleSettingChange = async (key, value) => {
		const updated = { ...settings, [key]: value };
		setSettings(updated);

		if (!formId) return;

		try {
			const payloadDeadline = updated.deadline
				? new Date(updated.deadline).toISOString()
				: null;

			await updateForm({
				id: formId,
				settings: {
					...updated,
					deadline: payloadDeadline,
				},
			}).unwrap();

			setSaveFeedback(true);
			setTimeout(() => setSaveFeedback(false), 2000);
		} catch (err) {
			console.error("Failed to update form settings:", err);
		}
	};

	if (isLoading) {
		return (
			<div className="w-full h-full flex items-center justify-center pt-32">
				<div className="w-10 h-10 border-4 border-[#673ab7] border-t-transparent rounded-full animate-spin" />
			</div>
		);
	}

	return (
		<main className="w-full h-full flex flex-col items-center pt-28 pb-24 overflow-y-scroll scroll-smooth">
			<div className="w-[780px] flex flex-col gap-4">
				{/* Settings Header Alert Toast */}
				{saveFeedback && (
					<div className="fixed bottom-6 left-6 z-50 bg-[#202124] text-white text-xs py-2 px-4 rounded shadow-lg flex items-center gap-2 animate-fade-in">
						<MdCheck className="text-green-400 text-base" />
						<span>Settings saved</span>
					</div>
				)}

				{/* 1. RESPONSES SETTINGS CARD */}
				<div className="w-full bg-white rounded-lg border border-[#DADCE0] shadow-sm overflow-hidden">
					<div
						onClick={() => toggleSection("responses")}
						className="flex items-center justify-between p-5 cursor-pointer hover:bg-slate-50 transition duration-150 select-none"
					>
						<div className="flex items-center gap-3">
							<MdOutlineEmail className="text-xl text-[#5f6368]" />
							<div>
								<h2 className="text-base font-medium text-[#202124]">
									Responses
								</h2>
								<p className="text-xs text-[#5f6368]">
									Manage how responses are collected and protected
								</p>
							</div>
						</div>
						<MdExpandMore
							className={`text-2xl text-[#5f6368] transition-transform duration-200 ${
								expanded.responses ? "rotate-180" : ""
							}`}
						/>
					</div>

					{expanded.responses && (
						<div className="border-t border-[#DADCE0] px-6 py-4 flex flex-col gap-6">
							{/* Collect Email Addresses */}
							<div className="flex items-center justify-between">
								<div>
									<p className="text-sm font-normal text-[#202124]">
										Collect email addresses
									</p>
									<p className="text-xs text-[#5f6368] mt-0.5">
										Ask respondents for their email address on the form
									</p>
								</div>

								<select
									value={settings.collectEmail}
									onChange={(e) =>
										handleSettingChange(
											"collectEmail",
											e.target.value
										)
									}
									className="text-sm border border-[#dadce0] rounded px-3 py-1.5 bg-white text-[#202124] focus:outline-none focus:border-[#673ab7] cursor-pointer"
								>
									<option value="none">Do not collect</option>
									<option value="responder_input">
										Responder input (Required)
									</option>
									<option value="verified">
										Verified account
									</option>
								</select>
							</div>

							<hr className="border-t border-[#f1f3f4]" />

							{/* Limit to 1 Response */}
							<div className="flex items-center justify-between">
								<div>
									<p className="text-sm font-normal text-[#202124]">
										Limit to 1 response
									</p>
									<p className="text-xs text-[#5f6368] mt-0.5">
										Requires respondents to sign in with an account
									</p>
								</div>

								<label className="relative inline-flex items-center cursor-pointer">
									<input
										type="checkbox"
										checked={settings.limitOneResponse}
										onChange={(e) =>
											handleSettingChange(
												"limitOneResponse",
												e.target.checked
											)
										}
										className="sr-only peer"
									/>
									<div className="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#673ab7]"></div>
								</label>
							</div>
						</div>
					)}
				</div>

				{/* 2. DEADLINES & FORM STATUS CARD */}
				<div className="w-full bg-white rounded-lg border border-[#DADCE0] shadow-sm overflow-hidden">
					<div
						onClick={() => toggleSection("deadlines")}
						className="flex items-center justify-between p-5 cursor-pointer hover:bg-slate-50 transition duration-150 select-none"
					>
						<div className="flex items-center gap-3">
							<MdOutlineSchedule className="text-xl text-[#5f6368]" />
							<div>
								<h2 className="text-base font-medium text-[#202124]">
									Submission Deadlines & Status
								</h2>
								<p className="text-xs text-[#5f6368]">
									Control form availability and expiration schedules
								</p>
							</div>
						</div>
						<MdExpandMore
							className={`text-2xl text-[#5f6368] transition-transform duration-200 ${
								expanded.deadlines ? "rotate-180" : ""
							}`}
						/>
					</div>

					{expanded.deadlines && (
						<div className="border-t border-[#DADCE0] px-6 py-4 flex flex-col gap-6">
							{/* Accepting Responses Master Toggle */}
							<div className="flex items-center justify-between">
								<div>
									<p className="text-sm font-normal text-[#202124]">
										Accepting responses
									</p>
									<p className="text-xs text-[#5f6368] mt-0.5">
										Turn off to manually close submissions immediately
									</p>
								</div>

								<label className="relative inline-flex items-center cursor-pointer">
									<input
										type="checkbox"
										checked={settings.isAcceptingResponses}
										onChange={(e) =>
											handleSettingChange(
												"isAcceptingResponses",
												e.target.checked
											)
										}
										className="sr-only peer"
									/>
									<div className="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#673ab7]"></div>
								</label>
							</div>

							<hr className="border-t border-[#f1f3f4]" />

							{/* Submission Deadline */}
							<div className="flex items-start justify-between">
								<div>
									<p className="text-sm font-normal text-[#202124]">
										Submission deadline
									</p>
									<p className="text-xs text-[#5f6368] mt-0.5">
										Automatically stop accepting responses at a specific date and time
									</p>
								</div>

								<div className="flex items-center gap-2">
									<input
										type="datetime-local"
										value={settings.deadline}
										onChange={(e) =>
											handleSettingChange(
												"deadline",
												e.target.value
											)
										}
										className="text-sm border border-[#dadce0] rounded px-3 py-1.5 bg-white text-[#202124] focus:outline-none focus:border-[#673ab7] cursor-pointer"
									/>
									{settings.deadline && (
										<button
											type="button"
											onClick={() =>
												handleSettingChange("deadline", "")
											}
											className="text-xs text-red-600 hover:bg-red-50 px-2 py-1.5 rounded transition"
										>
											Clear
										</button>
									)}
								</div>
							</div>

							<hr className="border-t border-[#f1f3f4]" />

							{/* Message for closed form */}
							<div>
								<p className="text-sm font-normal text-[#202124] mb-1">
									Message for respondents when closed
								</p>
								<input
									type="text"
									value={settings.closedFormMessage}
									onChange={(e) =>
										handleSettingChange(
											"closedFormMessage",
											e.target.value
										)
									}
									className="w-full text-sm border-b border-[#dadce0] focus:border-b-2 focus:border-[#673ab7] outline-none py-1.5 bg-transparent text-[#202124]"
									placeholder="This form is no longer accepting responses."
								/>
							</div>
						</div>
					)}
				</div>

				{/* 3. PRESENTATION CARD */}
				<div className="w-full bg-white rounded-lg border border-[#DADCE0] shadow-sm overflow-hidden">
					<div
						onClick={() => toggleSection("presentation")}
						className="flex items-center justify-between p-5 cursor-pointer hover:bg-slate-50 transition duration-150 select-none"
					>
						<div className="flex items-center gap-3">
							<MdOutlineDescription className="text-xl text-[#5f6368]" />
							<div>
								<h2 className="text-base font-medium text-[#202124]">
									Presentation
								</h2>
								<p className="text-xs text-[#5f6368]">
									Manage post-submission experience
								</p>
							</div>
						</div>
						<MdExpandMore
							className={`text-2xl text-[#5f6368] transition-transform duration-200 ${
								expanded.presentation ? "rotate-180" : ""
							}`}
						/>
					</div>

					{expanded.presentation && (
						<div className="border-t border-[#DADCE0] px-6 py-4 flex flex-col gap-6">
							{/* Confirmation Message */}
							<div>
								<p className="text-sm font-normal text-[#202124] mb-1">
									Confirmation message
								</p>
								<input
									type="text"
									value={settings.confirmationMessage}
									onChange={(e) =>
										handleSettingChange(
											"confirmationMessage",
											e.target.value
										)
									}
									className="w-full text-sm border-b border-[#dadce0] focus:border-b-2 focus:border-[#673ab7] outline-none py-1.5 bg-transparent text-[#202124]"
									placeholder="Your response has been recorded."
								/>
							</div>

							<hr className="border-t border-[#f1f3f4]" />

							{/* Show link to submit another response */}
							<div className="flex items-center justify-between">
								<div>
									<p className="text-sm font-normal text-[#202124]">
										Show link to submit another response
									</p>
									<p className="text-xs text-[#5f6368] mt-0.5">
										Allow respondents to click &quot;Submit another response&quot;
									</p>
								</div>

								<label className="relative inline-flex items-center cursor-pointer">
									<input
										type="checkbox"
										checked={settings.showSubmitAnotherLink}
										onChange={(e) =>
											handleSettingChange(
												"showSubmitAnotherLink",
												e.target.checked
											)
										}
										className="sr-only peer"
									/>
									<div className="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#673ab7]"></div>
								</label>
							</div>
						</div>
					)}
				</div>
			</div>
		</main>
	);
};

FormSettings.propTypes = {
	formId: PropTypes.string,
};

export default FormSettings;
