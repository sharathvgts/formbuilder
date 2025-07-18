import {
	useCreateDynamicFormV2,
	useGetDynamicForm2,
	useUpdateDynamicForm2,
} from "@/api/service";
import { Button } from "@/components/ui/button";
import {
	FormBuilder,
	FormEdit,
	type FormType,
	FormioProvider,
} from "@formio/react";
import { Save } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import "@formio/js/dist/formio.full.min.css";
// import "bootstrap/dist/css/bootstrap.css";
import { useParams } from "react-router";

const FormIoBuilder = () => {
	const [schema, setSchema] = useState<FormType>({
		display: "form",
		components: [],
	});

	const { formId } = useParams();

	const { data, isLoading, isError } = useGetDynamicForm2(formId); // Added isLoading, isError

	const [formMetaData, setFormMetaData] = useState({
		name: "Untitled form",
		description: "Enter sample description",
	});

	// State to control when FormBuilder is ready to mount
	const [isFormBuilderReady, setIsFormBuilderReady] = useState(false);

	useEffect(() => {
		if (data) {
			console.log("Loading form data:", data);
			// Formio's `onChange` gives you the full schema, so assume `data` is the full schema too.
			setSchema(data);
			setFormMetaData({
				name: data.name || "Untitled form",
				description: data.description || "Enter sample description",
			});
			setIsFormBuilderReady(true); // Data is loaded, FormBuilder can now be rendered
		} else if (!formId) {
			// If it's a new form (no formId), initialize with an empty schema and make it ready
			setSchema({
				display: "form",
				components: [],
				// Add other common default properties if your API doesn't return them for new forms
				// e.g., type: "form", properties: {}, settings: {}, etc.
			});
			setIsFormBuilderReady(true);
		}
	}, [data, formId]); // Add formId to dependency array for new form initialization

	console.log("Current schema state:", schema);

	const { mutateAsync, isPending } = useCreateDynamicFormV2();

	const { mutateAsync: updateForm, isPending: updateLoading } =
		useUpdateDynamicForm2(formId);

	const onFormChange = (newSchema: FormType) => {
		setSchema(newSchema);
	};

	const handleFormSubmit = async () => {
		try {
			console.log("Submitting form:", schema);
			const payload = {
				...schema, // Use the complete current schema state
				name: formMetaData.name,
				description: formMetaData.description,
				// Ensure consistency if Formio's schema uses 'title' for display name
				title: formMetaData.name,
			};
			if (formId) {
				await updateForm(payload);
			} else {
				await mutateAsync(payload);
			}
		} catch (error) {
			console.error("Error submitting form:", error); // Use console.error for errors
		}
	};

	const handleSaveFormEdit = useCallback(
		async (formJson: FormType) => {
			try {
				console.log("Form JSON captured from FormEdit:", formJson);

				// FormEdit's saveFormFn provides the most up-to-date schema,
				// so use formJson directly.
				// You might want to merge your formMetaData with it if your backend
				// expects 'name' and 'description' to be top-level properties not part of the schema.
				const payload = {
					...formJson, // This contains all Formio's properties (components, display, etc.)
					name: formMetaData.name, // Override with current metadata name
					title: formMetaData.name, // Often 'title' is used as the display name
					description: formMetaData.description, // Override with current metadata description
				};

				if (formId) {
					await updateForm(payload);
				} else {
					await mutateAsync(payload);
				}
				console.log("Form saved successfully!");
				// You can add navigation or a success toast here
			} catch (error) {
				console.error("Error saving form from FormEdit:", error);
				// Handle error (e.g., show error message)
			}
		},
		[formId, formMetaData, mutateAsync, updateForm],
	);

	if (isLoading) {
		return <div>Loading form...</div>;
	}

	if (isError) {
		return <div>Error loading form.</div>;
	}
	return (
		<div className="flex-1 flex flex-col">
			<div className="p-4">
				{isFormBuilderReady && (
					<FormioProvider>
						<FormEdit
							saveFormFn={handleSaveFormEdit}
							onSaveForm={(values) => console.log(values)}
							initialForm={schema}
						/>
					</FormioProvider>
				)}
			</div>
		</div>
	);
};

export default FormIoBuilder;
