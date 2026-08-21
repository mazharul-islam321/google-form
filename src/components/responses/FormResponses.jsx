/* eslint-disable react/prop-types */
import { useState } from "react";
import { Link } from "react-router-dom";
import {
	useGetFormByIdQuery,
	useGetFormResponsesQuery,
} from "../../redux/api/formApi";
import useAuth from "../../hooks/useAuth";
import ResponseCardItem from "./ResponseCardItem";
import ResponsePagination from "./ResponsePagination";

const ITEMS_PER_PAGE = 10;

const FormResponses = ({ formId }) => {
	const { isAuthenticated } = useAuth();
	const [currentPage, setCurrentPage] = useState(1);
	const [expandedId, setExpandedId] = useState(null);

	const { data: form } = useGetFormByIdQuery(formId, {
		skip: !formId || !isAuthenticated,
	});
	const { data: responses, isLoading } = useGetFormResponsesQuery(formId, {
		skip: !formId || !isAuthenticated,
	});

	if (!isAuthenticated) {
		return (
			<main className="w-full h-full flex flex-col items-center pt-28 pb-20 overflow-y-scroll scroll-smooth">
				<div className="w-full max-w-[780px] px-4">
					<div className="bg-white p-8 md:p-12 rounded-2xl shadow-sm border border-gray-200 text-center">
						<div className="w-16 h-16 bg-[#673ab7]/10 text-[#673ab7] rounded-2xl flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
							0
						</div>
						<h3 className="text-xl font-bold text-gray-900 mb-2">
							Sign in to view responses
						</h3>
						<p className="text-sm text-gray-500 max-w-[420px] mx-auto mb-6 leading-relaxed">
							Responses are collected and stored securely for
							registered users. Sign in or create an account to save
							your form and track submissions.
						</p>
						<Link
							to="/login"
							className="inline-flex items-center justify-center px-6 py-2.5 bg-[#673ab7] hover:bg-[#5a2ea6] text-white text-sm font-medium rounded-xl shadow-sm transition duration-150"
						>
							Sign In
						</Link>
					</div>
				</div>
			</main>
		);
	}

	const totalResponses = responses?.length || 0;
	const totalPages = Math.ceil(totalResponses / ITEMS_PER_PAGE) || 1;

	// Calculate paginated slice
	const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
	const currentResponses =
		responses?.slice(startIndex, startIndex + ITEMS_PER_PAGE) || [];

	const handleToggleExpand = (id) => {
		setExpandedId((prev) => (prev === id ? null : id));
	};

	return (
		<main className="w-full h-full flex flex-col items-center pt-28 pb-20 overflow-y-scroll scroll-smooth">
			<div className="w-full max-w-[780px] px-4">
				<div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gray-200">
					{/* Header summary row */}
					<div className="flex items-center justify-between border-b border-gray-100 pb-5 mb-6">
						<div>
							<h2 className="text-2xl font-bold text-gray-900">
								{totalResponses}{" "}
								{totalResponses === 1 ? "Response" : "Responses"}
							</h2>
							<p className="text-xs text-gray-500 mt-1">
								{form?.title || "Form"} responses list
							</p>
						</div>
					</div>

					{/* Loading State */}
					{isLoading ? (
						<div className="text-center py-16">
							<div className="w-8 h-8 border-4 border-[#673ab7] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
							<p className="text-xs text-gray-400">
								Loading responses...
							</p>
						</div>
					) : totalResponses > 0 ? (
						<>
							{/* Expandable Master-Detail List */}
							<div className="flex flex-col gap-3">
								{currentResponses.map((resp, idx) => {
									const actualIndex = startIndex + idx;
									return (
										<ResponseCardItem
											key={resp._id}
											response={resp}
											index={actualIndex}
											form={form}
											isExpanded={expandedId === resp._id}
											onToggle={() =>
												handleToggleExpand(resp._id)
											}
										/>
									);
								})}
							</div>

							{/* Pagination Controls */}
							<ResponsePagination
								currentPage={currentPage}
								totalPages={totalPages}
								totalItems={totalResponses}
								itemsPerPage={ITEMS_PER_PAGE}
								onPageChange={(page) => {
									setCurrentPage(page);
									setExpandedId(null);
								}}
							/>
						</>
					) : (
						/* Empty State */
						<div className="text-center py-16 px-4">
							<div className="w-16 h-16 bg-[#673ab7]/10 text-[#673ab7] rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
								0
							</div>
							<h3 className="text-lg font-medium text-gray-800 mb-1">
								Waiting for responses
							</h3>
							<p className="text-sm text-gray-400 max-w-[360px] mx-auto leading-relaxed">
								No responses have been submitted yet. Share your
								form link to start collecting submissions!
							</p>
						</div>
					)}
				</div>
			</div>
		</main>
	);
};

export default FormResponses;
