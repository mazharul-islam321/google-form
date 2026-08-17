import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import CreateOrEditForm from "../components/createoreditform/CreateOrEditForm";
import CreateOrEditHeader from "../components/header/create-or-edit-form-header/CreateOrEditHeader";
import {
	useGetFormByIdQuery,
	useGetFormResponsesQuery,
} from "../redux/api/formApi";

const CreateOrEditFormPage = () => {
	const [searchParams] = useSearchParams();
	const formId = searchParams.get("id");
	const [selectedTab, setSelectedTab] = useState(0);

	const { data: form } = useGetFormByIdQuery(formId, { skip: !formId });
	const { data: responses, isLoading: isRespLoading } =
		useGetFormResponsesQuery(formId, {
			skip: !formId || selectedTab !== 1,
		});

	return (
		<div className="w-full h-screen bg-[#F0EBF8] overflow-hidden">
			<CreateOrEditHeader
				formTitle={form?.title || "Untitled form"}
				selectedBtn={selectedTab}
				setSelectedBtn={setSelectedTab}
			/>

			{selectedTab === 0 ? (
				<CreateOrEditForm />
			) : (
				<main className="w-full h-full flex flex-col items-center pt-28 pb-20 overflow-y-scroll">
					<div className="w-[780px] bg-white p-8 rounded-xl shadow border border-gray-200">
						<div className="flex items-center justify-between border-b pb-4 mb-6">
							<h2 className="text-2xl font-bold text-gray-800">
								{responses?.length || 0} Responses
							</h2>
						</div>

						{isRespLoading ? (
							<div className="text-center py-8">
								<div className="w-8 h-8 border-4 border-[#673ab7] border-t-transparent rounded-full animate-spin mx-auto" />
							</div>
						) : responses && responses.length > 0 ? (
							<div className="flex flex-col gap-4">
								{responses.map((resp, idx) => (
									<div
										key={resp._id}
										className="p-4 rounded-lg bg-gray-50 border border-gray-200 text-sm"
									>
										<div className="flex justify-between items-center mb-2 font-medium text-gray-700">
											<span>Response #{idx + 1}</span>
											<span className="text-xs text-gray-500 font-normal">
												{new Date(
													resp.createdAt
												).toLocaleString()}
											</span>
										</div>
										<div className="flex flex-col gap-2 mt-2">
											{resp.answers?.map((ans, aIdx) => (
												<div
													key={aIdx}
													className="bg-white p-2.5 rounded border border-gray-100"
												>
													<p className="text-xs text-gray-500 font-medium">
														{form?.items?.[
															ans.itemIndex
														]?.questionTitle ||
															`Question ${
																ans.itemIndex + 1
															}`}
													</p>
													<p className="text-gray-900 font-medium mt-0.5">
														{Array.isArray(
															ans.value
														)
															? ans.value.join(
																	", "
															  )
															: String(
																	ans.value
															  )}
													</p>
												</div>
											))}
										</div>
									</div>
								))}
							</div>
						) : (
							<p className="text-gray-500 text-center py-10">
								Waiting for responses. Share your form to start collecting responses!
							</p>
						)}
					</div>
				</main>
			)}
		</div>
	);
};

export default CreateOrEditFormPage;
