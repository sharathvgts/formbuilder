// import { GripVertical, Settings, Trash2 } from "lucide-react";

import { GripVertical, Settings, Trash2 } from "lucide-react";
import type { RenderFormField } from "./types";

// // Updated type definitions to match your data structure
// interface Constraint {
// 	id: number;
// 	name: string;
// 	default_value: string | null;
// 	value: string;
// }

// interface FieldConstraintValue {
// 	id: number;
// 	value: string;
// 	form_field: number;
// 	constraint: Constraint;
// 	status: boolean;
// }

// interface FieldType {
// 	id: number;
// 	name: string;
// 	label: string;
// }

// interface Formfield {
// 	id: number;
// 	label: string;
// 	field_type_id: number;
// 	field_type: FieldType;
// 	fieldconstraintvalue: FieldConstraintValue[];
// 	fieldoption: { id: number; label: string; value: string }[];
// 	status: boolean;
// }

// interface FormFieldProps {
// 	field: Formfield;
// 	isSelected: boolean;
// 	onSelect: (field: Formfield) => void;
// 	onDelete: (fieldId: string) => void;
// 	onEdit: (field: Formfield) => void;
// 	isPreview: boolean;
// }

// const FormField: React.FC<FormFieldProps> = ({
// 	field,
// 	isSelected,
// 	onSelect,
// 	onDelete,
// 	onEdit,
// 	isPreview,
// }) => {
// 	// Helper function to get constraint value by name
// 	const getConstraintValue = (constraintName: string): string => {
// 		const constraint = field.fieldconstraintvalue.find(
// 			(fcv) => fcv.constraint.name === constraintName && fcv.status,
// 		);
// 		return constraint?.value || "";
// 	};

// 	// Helper function to check if field is required
// 	const isRequired = (): boolean => {
// 		const requiredConstraint = field.fieldconstraintvalue.find(
// 			(fcv) => fcv.constraint.name === "required" && fcv.status,
// 		);
// 		return requiredConstraint?.value === "true";
// 	};

// 	// Helper function to get placeholder text
// 	const getPlaceholder = (): string => {
// 		return getConstraintValue("placeholder");
// 	};

// 	// Helper function to get default value
// 	const getDefaultValue = (): string => {
// 		return getConstraintValue("defaultValue") || getConstraintValue("default");
// 	};

// 	// Helper function to get min/max values for number inputs
// 	const getMinValue = (): string => {
// 		return getConstraintValue("min");
// 	};

// 	const getMaxValue = (): string => {
// 		return getConstraintValue("max");
// 	};

// 	const renderFieldPreview = () => {
// 		const placeholder = getPlaceholder();
// 		const defaultValue = getDefaultValue();
// 		const minValue = getMinValue();
// 		const maxValue = getMaxValue();

// 		switch (field.field_type.name) {
// 			case "text":
// 				return (
// 					<input
// 						type="text"
// 						placeholder={placeholder}
// 						defaultValue={defaultValue}
// 						className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
// 						readOnly={!isPreview}
// 					/>
// 				);

// 			case "email":
// 				return (
// 					<input
// 						type="email"
// 						placeholder={placeholder}
// 						defaultValue={defaultValue}
// 						className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
// 						readOnly={!isPreview}
// 					/>
// 				);

// 			case "textarea":
// 				return (
// 					<textarea
// 						placeholder={placeholder}
// 						defaultValue={defaultValue}
// 						rows={3}
// 						className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
// 						readOnly={!isPreview}
// 					/>
// 				);

// 			case "number":
// 				return (
// 					<input
// 						type="number"
// 						placeholder={placeholder}
// 						defaultValue={defaultValue}
// 						min={minValue || undefined}
// 						max={maxValue || undefined}
// 						className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
// 						readOnly={!isPreview}
// 					/>
// 				);

// 			case "select":
// 				return (
// 					<select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
// 						{field?.fieldoption.map((option) => (
// 							<option key={option.id} value={option.value}>
// 								{option.label}
// 							</option>
// 						))}
// 					</select>
// 				);

// 			case "radio":
// 				return (
// 					<div className="space-y-2">
// 						{field.fieldoption.map((option) => (
// 							<label key={option.id} className="flex items-center gap-2">
// 								<input
// 									type="radio"
// 									name={`preview_${option.id}`}
// 									value={option.value}
// 									className="text-blue-600 focus:ring-blue-500"
// 								/>
// 								<span>{option.label}</span>
// 							</label>
// 						))}
// 					</div>
// 				);

// 			case "checkbox":
// 				return (
// 					<div className="space-y-2">
// 						{field.fieldoption.map((option) => (
// 							<label key={option.id} className="flex items-center gap-2">
// 								<input
// 									type="checkbox"
// 									value={option.value}
// 									className="text-blue-600 focus:ring-blue-500"
// 								/>
// 								<span>{option.label}</span>
// 							</label>
// 						))}
// 					</div>
// 				);

// 			case "date":
// 				return (
// 					<input
// 						type="date"
// 						defaultValue={defaultValue}
// 						className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
// 						readOnly={!isPreview}
// 					/>
// 				);

// 			default:
// 				return <div className="text-gray-500">Unknown field type</div>;
// 		}
// 	};

// 	return (
// 		<div
// 			className={`group relative p-4 border-2 rounded-lg cursor-pointer transition-all ${
// 				isSelected
// 					? "border-blue-500 bg-blue-50"
// 					: "border-gray-200 hover:border-gray-300 bg-white"
// 			}`}
// 			onClick={() => onSelect(field)}
// 		>
// 			<div className="space-y-2">
// 				<div className="flex items-center justify-between">
// 					<label className="block text-sm font-medium text-gray-700">
// 						{field.label}
// 						{isRequired() && <span className="text-red-500 ml-1">*</span>}
// 					</label>
// 					<div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
// 						<button
// 							onClick={(e) => {
// 								e.stopPropagation();
// 								onEdit(field);
// 							}}
// 							className="p-1 text-gray-400 hover:text-blue-600 rounded"
// 							title="Edit field"
// 						>
// 							<Settings className="w-4 h-4" />
// 						</button>
// 						<button
// 							onClick={(e) => {
// 								e.stopPropagation();
// 								onDelete(field.id.toString());
// 							}}
// 							className="p-1 text-gray-400 hover:text-red-600 rounded"
// 							title="Delete field"
// 						>
// 							<Trash2 className="w-4 h-4" />
// 						</button>
// 						<div
// 							className="p-1 text-gray-400 cursor-grab"
// 							title="Drag to reorder"
// 						>
// 							<GripVertical className="w-4 h-4" />
// 						</div>
// 					</div>
// 				</div>
// 				{renderFieldPreview()}
// 			</div>
// 		</div>
// 	);
// };

// export default FormField;

interface FormFieldProps {
  field: RenderFormField;
  isSelected: boolean;
  onSelect: (field: RenderFormField) => void;
  onDelete: (fieldId: string) => void;
  onEdit: (field: RenderFormField) => void;
  isPreview: boolean;
}

const FormField: React.FC<FormFieldProps> = ({
  field,
  isSelected,
  onSelect,
  onDelete,
  onEdit,
  isPreview,
}) => {
  const renderFieldPreview = () => {
    switch (field.name) {
      case "text":
      case "email":
        return (
          <input
            type={field.name}
            placeholder={field.validation.placeholder}
            defaultValue={field.validation.defaultValue}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            readOnly={!isPreview}
          />
        );

      case "textarea":
        return (
          <textarea
            placeholder={field.validation.placeholder}
            defaultValue={field.validation.defaultValue}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            readOnly={!isPreview}
          />
        );

      case "number":
        return (
          <input
            type="number"
            placeholder={field.validation.placeholder}
            defaultValue={field.validation.defaultValue}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            readOnly={!isPreview}
          />
        );

      case "select":
        return (
          <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option value="">Select an option...</option>
            {field.options.map((option) => (
              <option key={option.id} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        );

      case "radio":
        return (
          <div className="space-y-2">
            {field.options.map((option) => (
              <label key={option.id} className="flex items-center gap-2">
                <input
                  type="radio"
                  name={`preview_${field.label}`}
                  value={option.value}
                  className="text-blue-600 focus:ring-blue-500"
                />
                <span>{option.label}</span>
              </label>
            ))}
          </div>
        );

      case "checkbox":
        return (
          <div className="space-y-2">
            {field.options.map((option) => (
              <label key={option.id} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  value={option.value}
                  className="text-blue-600 focus:ring-blue-500"
                />
                <span>{option.label}</span>
              </label>
            ))}
          </div>
        );

      case "date":
        return (
          <input
            type="date"
            placeholder={field.validation.placeholder}
            defaultValue={field.validation.defaultValue}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            readOnly
          />
        );

      default:
        return <div className="text-gray-500">Unknown field type</div>;
    }
  };

  return (
    <div
      className={`group relative p-4 border-2 rounded-lg cursor-pointer transition-all ${
        isSelected
          ? "border-blue-500 bg-blue-50"
          : "border-gray-200 hover:border-gray-300 bg-white"
      }`}
      onClick={() => onSelect(field)}
    >
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="block text-sm font-medium text-gray-700">
            {field.label}
            {field.validation.required && (
              <span className="text-red-500 ml-1">*</span>
            )}
          </label>
          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onEdit(field);
              }}
              className="p-1 text-gray-400 hover:text-blue-600 rounded"
              title="Edit field"
            >
              <Settings className="w-4 h-4" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete(field.id);
              }}
              className="p-1 text-gray-400 hover:text-red-600 rounded"
              title="Delete field"
            >
              <Trash2 className="w-4 h-4" />
            </button>
            <div
              className="p-1 text-gray-400 cursor-grab"
              title="Drag to reorder"
            >
              <GripVertical className="w-4 h-4" />
            </div>
          </div>
        </div>
        {renderFieldPreview()}
      </div>
    </div>
  );
};

export default FormField;
