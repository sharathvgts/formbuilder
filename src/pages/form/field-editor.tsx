import { X, Trash2, Plus, Save, Coins } from "lucide-react";
import { useMemo, useState } from "react";
import type { RenderFormField } from "./types";

interface FieldEditorProps {
  masterData: RenderFormField;
  onUpdate: (field: RenderFormField) => void;
  onClose: () => void;
  selectedFromConstrain: any;
}

let idCounter = 1;
const generateId = () => `field_${idCounter++}`;

const FieldEditor: React.FC<FieldEditorProps> = ({
  masterData,
  onUpdate,
  onClose,
  selectedFromConstrain,
}) => {
  const [field, setLocalField] = useState({ ...masterData });

  const localField = useMemo(() => {
    return selectedFromConstrain[field.name];
  }, [field.name, selectedFromConstrain]);

  const updateField = (key: keyof RenderFormField, value: any) => {
    const updated = { ...field, [key]: value };
    setLocalField(updated);
  };

  const updateValidation = (
    key: keyof RenderFormField["validation"],
    value: string
  ) => {
    const updated = {
      ...field,
      validation: { ...field.validation, [key]: value },
    };
    setLocalField(updated);
  };

  const addOption = () => {
    const newOption = {
      id: generateId(),
      label: `Option ${field.options.length + 1}`,
      value: `option${field.options.length + 1}`,
    };
    updateField("options", [...field.options, newOption]);
  };

  const updateOption = (
    index: number,
    key: "value" | "label",
    value: string
  ) => {
    const newOptions = [...field.options];
    newOptions[index] = { ...newOptions[index], [key]: value };
    updateField("options", newOptions);
  };

  const removeOption = (index: number) => {
    if (field.options.length > 1) {
      const newOptions = field.options.filter((_, i) => i !== index);
      updateField("options", newOptions);
    }
  };

  const handleSave = () => {
    onUpdate(field);
    onClose();
  };

  const hasOptions = ["select", "radio", "checkbox"].includes(field.name);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b">
          <h3 className="text-lg font-semibold">Edit {field.name} Field</h3>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
          <div className="space-y-6">
            {/* Basic Settings */}
            <div>
              <h4 className="text-md font-medium mb-4 text-gray-800">
                Basic Settings
              </h4>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Field Label *
                  </label>
                  <input
                    type="text"
                    value={field.label}
                    onChange={(e) => updateField("label", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter field label"
                  />
                </div>

                {localField &&
                  localField.map((item) => {
                    return (
                      <>
                        {item.name === "placeholder" && (
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Placeholder Text
                            </label>
                            <input
                              type="text"
                              value={field?.validation.placeholder}
                              onChange={(e) =>
                                updateValidation("placeholder", e.target.value)
                              }
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                              placeholder="Enter placeholder text"
                            />
                          </div>
                        )}
                        {item.name === "defaultValue" && (
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Default Value
                            </label>
                            <input
                              type="text"
                              value={field?.validation.defaultValue}
                              onChange={(e) =>
                                updateValidation("defaultValue", e.target.value)
                              }
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                              placeholder="Enter default value"
                            />
                          </div>
                        )}
                        {item.name === "required" && (
                          <div className="flex items-center">
                            <input
                              type="checkbox"
                              id="required"
                              checked={field?.validation.required}
                              onChange={(e) =>
                                updateValidation("required", e.target.checked)
                              }
                              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                            />
                            <label
                              htmlFor="required"
                              className="ml-2 text-sm text-gray-700"
                            >
                              This field is required
                            </label>
                          </div>
                        )}
                        {item.name === "disabled" && (
                          <div className="flex items-center">
                            <input
                              type="checkbox"
                              id="required"
                              checked={field?.validation.disabled}
                              onChange={(e) =>
                                updateValidation("disabled", e.target.checked)
                              }
                              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                            />
                            <label
                              htmlFor="required"
                              className="ml-2 text-sm text-gray-700"
                            >
                              This field is disabled
                            </label>
                          </div>
                        )}
                        {item.name === "minLength" && (
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Minimum Length
                            </label>
                            <input
                              type="number"
                              value={field?.validation?.minLength}
                              onChange={(e) =>
                                updateValidation("minLength", e.target.value)
                              }
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                              min="0"
                            />
                          </div>
                        )}
                        {item.name === "maxLength" && (
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Maximum Length
                            </label>
                            <input
                              type="number"
                              value={field?.validation?.maxLength}
                              onChange={(e) =>
                                updateValidation("maxLength", e.target.value)
                              }
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                              min="0"
                            />
                          </div>
                        )}
                        {item.name === "pattern" && (
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Pattern (RegEx)
                            </label>
                            <input
                              type="text"
                              value={field?.validation?.pattern}
                              onChange={(e) =>
                                updateValidation("pattern", e.target.value)
                              }
                              placeholder="e.g., [A-Za-z0-9]+"
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                          </div>
                        )}
                        {item.name === "min" && (
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Minimum Value
                            </label>
                            <input
                              type={field.name}
                              value={field?.validation?.min}
                              onChange={(e) =>
                                updateValidation("min", e.target.value)
                              }
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                          </div>
                        )}
                        {item.name === "max" && (
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Maximum Value
                            </label>
                            <input
                              type={field.name}
                              value={field?.validation?.max}
                              onChange={(e) =>
                                updateValidation("max", e.target.value)
                              }
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                          </div>
                        )}
                        {item.name === "multiple" && (
                          <div className="flex items-center">
                            <input
                              type="checkbox"
                              id="required"
                              checked={field?.validation.multiple}
                              onChange={(e) =>
                                updateValidation("multiple", e.target.value)
                              }
                              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                            />
                            <label
                              htmlFor="required"
                              className="ml-2 text-sm text-gray-700"
                            >
                              Can select multiple values
                            </label>
                          </div>
                        )}
                      </>
                    );
                  })}
                {hasOptions && (
                  <div>
                    <h4 className="text-md font-medium mb-4 text-gray-800">
                      Options
                    </h4>
                    <div className="space-y-3">
                      {field.options.map((option, index) => (
                        <div
                          key={`${option.id}-${index}`}
                          className="flex gap-2"
                        >
                          <input
                            type="text"
                            placeholder="Option Label"
                            value={option.label}
                            onChange={(e) =>
                              updateOption(index, "label", e.target.value)
                            }
                            className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                          <input
                            type="text"
                            placeholder="Option Value"
                            value={option.value}
                            onChange={(e) =>
                              updateOption(index, "value", e.target.value)
                            }
                            className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                          <button
                            onClick={() => removeOption(index)}
                            disabled={field.options.length <= 1}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                      <button
                        onClick={addOption}
                        className="flex items-center gap-2 px-3 py-2 text-blue-600 hover:bg-blue-50 rounded-md border border-blue-200"
                      >
                        <Plus className="w-4 h-4" />
                        Add Option
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3 p-6 border-t">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-md"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            <Save className="w-4 h-4" />
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

export default FieldEditor;
