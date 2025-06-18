import type { Formfield, RenderFormField } from "./pages/form/types";

type FieldTypeName =
	| "text"
	| "textarea"
	| "select"
	| "radio"
	| "checkbox"
	| "number"
	| "email"
	| "date";

export const convertApiFieldToConfig = (
	apiField: Formfield,
): RenderFormField => {
	const type = apiField.field_type.name as FieldTypeName;

	// Find placeholder if exists
	const placeholderConstraint = apiField.fieldconstraintvalue.find(
		(fcv) => fcv.constraint.name === "placeholder",
	);
	const defaultConstraint = apiField.fieldconstraintvalue.find(
		(fcv) => fcv.constraint.name === "defaultValue",
	);

	// Find required constraint if exists
	const requiredConstraint = apiField.fieldconstraintvalue.find(
		(fcv) => fcv.constraint.name === "required",
	);

	// Find min/max constraints if they exist
	const minConstraint = apiField.fieldconstraintvalue.find(
		(fcv) => fcv.constraint.name === "min",
	);
	const maxConstraint = apiField.fieldconstraintvalue.find(
		(fcv) => fcv.constraint.name === "max",
	);
	const minLengthConstraint = apiField.fieldconstraintvalue.find(
		(fcv) => fcv.constraint.name === "minLength",
	);
	const maxLengthConstraint = apiField.fieldconstraintvalue.find(
		(fcv) => fcv.constraint.name === "maxLength",
	);
	const patternConstraint = apiField.fieldconstraintvalue.find(
		(fcv) => fcv.constraint.name === "pattern",
	);

	const multipleConstraint = apiField.fieldconstraintvalue.find(
		(fcv) => fcv.constraint.name === "multiple",
	);

	const disabledConstraint = apiField.fieldconstraintvalue.find(
		(fcv) => fcv.constraint.name === "disabled",
	);

	// Convert field options if they exist
	const options = apiField.fieldoption.map((option) => ({
		id: String(option.id),
		label: option.label,
		value: option.value,
	}));

	return {
		id: apiField?.id || null,
		name: type,
		label: apiField.label,
	
		options: options.length > 0 ? options : [],
		validation: {
			minLength: minLengthConstraint?.value || "",
			maxLength: maxLengthConstraint?.value || "",
			min: minConstraint?.value || "",
			max: maxConstraint?.value || "",
			pattern: patternConstraint?.value || "",
			disabled: disabledConstraint ? disabledConstraint.value === "True" : false,
			multiple: multipleConstraint ? multipleConstraint.value === "True" :  false,
			placeholder: placeholderConstraint
			? placeholderConstraint.value
			: type === "textarea"
				? "Enter your text here..."
				: `Enter ${type}...`,
				defaultValue: defaultConstraint ? defaultConstraint.value : "",

			required: requiredConstraint ? requiredConstraint.value === "True" : false,

		},
	};
};
