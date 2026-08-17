/* eslint-disable react/prop-types */
import {
	useGetFormByIdQuery,
	useGetFormResponsesQuery,
} from "../../redux/api/formApi";

const FormResponses = ({ formId }) => {
	const { data: form } = useGetFormByIdQuery(formId, { skip: !formId });
	const { data: responses, isLoading } = useGetFormResponsesQuery(formId, {
		skip: !formId,
	});

	return (
		<main className="w-full h-full flex flex-col items-center pt-28 pb-20 overflow-y-scroll scroll-smooth">
			<div className="w-full max-w-[780px] px-4">
				<div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gray-200">
					<div className="flex items-center justify-between border-b border-gray-100 pb-5 mb-6">
						<div>
							<h2 className="text-2xl font-bold text-gray-900">
								{responses?.length || 0}{" "}
								{responses?.length === 1
									? "Response"
									: "Responses"}
							</h2>
							<p className="text-xs text-gray-500 mt-1">
								{form?.title || "Form"} responses summary
							</p>
						</div>
					</div>

					{isLoading ? (
						<div className="text-center py-16">
							<div className="w-8 h-8 border-4 border-[#673ab7] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
							<p className="text-xs text-gray-400">
								Loading responses...
							</p>
						</div>
					) : responses && responses.length > 0 ? (
						<div className="flex flex-col gap-4">
							{responses.map((resp, idx) => (
								<div
									key={resp._id}
									className="p-5 rounded-xl bg-[#fafafa] border border-gray-200 text-sm hover:border-[#673ab7]/30 transition duration-150"
								>
									<div className="flex justify-between items-center mb-3 pb-2 border-b border-gray-200/60 font-medium text-gray-700">
										<span className="font-semibold text-[#673ab7]">
											Response #{idx + 1}
										</span>
										<span className="text-xs text-gray-400 font-normal">
											{new Date(
												resp.createdAt,
											).toLocaleString(undefined, {
												month: "short",
												day: "numeric",
												year: "numeric",
												hour: "2-digit",
												minute: "2-digit",
											})}
										</span>
									</div>
									<div className="flex flex-col gap-2.5">
										{resp.answers?.map((ans, aIdx) => (
											<div
												key={aIdx}
												className="bg-white p-3 rounded-lg border border-gray-100 shadow-sm"
											>
												<p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
													{form?.items?.[
														ans.itemIndex
													]?.questionTitle ||
														`Question ${
															ans.itemIndex + 1
														}`}
												</p>
												<p className="text-gray-900 font-medium mt-1">
													{Array.isArray(ans.value)
														? ans.value.join(", ")
														: String(ans.value)}
												</p>
											</div>
										))}
									</div>
								</div>
							))}
						</div>
					) : (
						<div className="text-center py-16 px-4">
							<div className="w-16 h-16 bg-[#673ab7]/10 text-[#673ab7] rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
								0
							</div>
							<h3 className="text-lg font-medium text-gray-800 mb-1">
								Waiting for responses
							</h3>
							<p className="text-sm text-gray-400 max-w-[360px] mx-auto">
								No responses have been submitted yet. Share your
								form link to collect responses!
							</p>
						</div>
					)}
				</div>
			</div>
		</main>
	);
};

export default FormResponses;
