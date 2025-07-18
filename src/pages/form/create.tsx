import {
  Calendar,
  CheckSquare,
  Circle,
  Eye,
  FileText,
  Hash,
  List,
  Mail,
  Save,
  Settings,
  Type,
} from "lucide-react";
import type React from "react";
import { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { convertApiFieldToConfig } from "../../helpers";
import FormField from "./form-field";
import {
  useCreateForm,
  useCreateFormApproval,
  useGetFormById,
  useGetFormTypes,
  useUpdateForm,
} from "../../api/service";
import type { ApprovalPayload, FieldType, RenderFormField } from "./types";
import FieldEditor from "./field-editor";
import FormApprovalDialog from "@/components/custom/form-approval-dialog";
import { Button } from "@/components/ui/button";

export interface FormMetadata {
  title: string;
  description: string;
}
const FIELD_TYPES = {
  text: Type,
  textarea: FileText,
  select: List,
  radio: Circle,
  number: Hash,
  email: Mail,
  date: Calendar,
  checkbox: CheckSquare,
};

// Generate unique ID
let idCounter = 1;
const generateId = () => `field_${idCounter++}`;

// Default field configuration
const getDefaultFieldConfig = (type: FieldType): RenderFormField => ({
  name: type,
  id: generateId(),
  label: `${type.charAt(0).toUpperCase() + type.slice(1)} Field`,

  options: ["select", "radio", "checkbox"].includes(type)
    ? [
        { id: generateId(), label: "Option 1", value: "option1" },
        { id: generateId(), label: "Option 2", value: "option2" },
      ]
    : [],
  validation: {
    minLength: "",
    maxLength: "",
    min: "",
    max: "",
    pattern: "",
    disabled: false,
    multiple: false,
    placeholder:
      type === "textarea" ? "Enter your text here..." : `Enter ${type}...`,
    defaultValue: "",
    required: false,
  },
});

// Main Form Builder Component
const FormBuilderCanvas: React.FC = () => {
  const [fields, setFields] = useState<RenderFormField[]>([]);
  const [selectedField, setSelectedField] = useState<RenderFormField | null>(
    null
  );
  const [editingField, setEditingField] = useState<RenderFormField | null>(
    null
  );
  const [showPreview, setShowPreview] = useState(false);
  const [formMetadata, setFormMetadata] = useState<FormMetadata>({
    title: "Untitled Form",
    description: "Enter form description here...",
  });

  const { formId } = useParams();

  const { data: formTypesData } = useGetFormTypes();

  const { data: formData } = useGetFormById(formId);

  const { mutateAsync: createFormMutation, isPending: isFormCreateLoading } =
    useCreateForm();

  const { mutateAsync: updateFormMutation, isPending: isUpdateLoading } =
    useUpdateForm(formId || "");

  const { mutateAsync: createFormLevelApproval, isPending: isApprovalLoading } =
    useCreateFormApproval();

  const navigate = useNavigate();

  useEffect(() => {
    if (formId && formData) {
      const convertedFields = formData?.form_fields.map(
        (field) => convertApiFieldToConfig(field) as RenderFormField
      );

      setFields(convertedFields || []);
      setFormMetadata(() => ({
        title: formData?.name || "Untitled Form",
        description: formData?.description || "Enter form description here...",
      }));
    }
  }, [formId, formData]);

  const [formTypes, setFormTypes] = useState({
    types: [],
    constraints: [],
  });

  useEffect(() => {
    if (formTypesData) {
      const formTypeConstraints = {};

      const coreType = formTypesData.map((type) => {
        formTypeConstraints[type.name] = type.constraints;

        return {
          name: type.name,
          icon: FIELD_TYPES[type.name],
        };
      });

      setFormTypes(() => ({
        types: coreType,
        constraints: formTypeConstraints,
      }));
    }
  }, [formTypesData]);

  const addField = useCallback((fieldType: FieldType) => {
    const newField = getDefaultFieldConfig(fieldType);
    setFields((prev) => [...prev, newField]);
    setSelectedField(newField);
  }, []);

  // Update field
  const updateField = useCallback((updatedField: RenderFormField) => {
    setFields((prev) =>
      prev.map((field) => (field.id === updatedField.id ? updatedField : field))
    );
    setSelectedField(updatedField);
  }, []);

  // Delete field
  const deleteField = useCallback(
    (fieldId: number) => {
      setFields((prev) => prev.filter((field) => field.id !== fieldId));
      if (selectedField?.id === fieldId) {
        setSelectedField(null);
      }
    },
    [selectedField]
  );

  const createForm = async (approvalData?: ApprovalPayload) => {
    const schema = {
      metadata: formMetadata,
      fields: fields.map((field) => {
        delete field?.id;
        return field;
      }),
    };

    if (formId) {
      await updateFormMutation(schema);
    } else {
      const { form_id } = await createFormMutation(schema);

      if (approvalData && form_id)
        await createFormLevelApproval({ data: approvalData, formId: form_id });
    }

    navigate("/form/list");
  };

  return (
    <div className="h-screen flex bg-gray-50">
      {/* Sidebar */}
      <div className="w-80 bg-white shadow-lg border-r overflow-y-auto">
        <div className="p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-800">Form Builder</h2>
          <p className="text-sm text-gray-600 mt-1">
            Drag fields to canvas or click to add
          </p>
        </div>

        <div className="p-4">
          <h3 className="text-sm font-medium text-gray-700 mb-3 uppercase tracking-wide">
            Field Types
          </h3>
          <div className="space-y-2">
            {formTypes?.types?.map((fieldType, index) => {
              const Icon = fieldType.icon;
              return (
                <div
                  key={`${fieldType.name}-${index}`}
                  onClick={() => addField(fieldType.name)}
                  className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300 cursor-pointer hover:border-blue-400 hover:bg-blue-50 transition-all duration-200 group"
                >
                  <Icon className="w-5 h-5 text-gray-600 group-hover:text-blue-600" />
                  <span className="text-sm font-medium text-gray-700 group-hover:text-blue-700">
                    {fieldType.name}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Form Statistics */}
        <div className="p-4 border-t mt-4">
          <div className="bg-gray-50 rounded-lg p-3">
            <h4 className="text-sm font-medium text-gray-700 mb-2">
              Form Statistics
            </h4>
            <div className="space-y-1 text-xs text-gray-600">
              <div>Total Fields: {fields.length}</div>
              <div>
                Required Fields:{" "}
                {fields.filter((f) => f.validation.required).length}
              </div>
              <div>
                Optional Fields:{" "}
                {fields.filter((f) => !f.validation.required).length}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Canvas */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="bg-white shadow-sm border-b p-4">
          <div className="flex items-center justify-between">
            <div className="flex-1 max-w-2xl">
              <input
                type="text"
                value={formMetadata.title}
                onChange={(e) =>
                  setFormMetadata((prev) => ({
                    ...prev,
                    title: e.target.value,
                  }))
                }
                className="text-xl font-semibold bg-transparent border-none focus:outline-none focus:ring-0 w-full p-0"
                placeholder="Enter form title..."
              />
              <input
                type="text"
                value={formMetadata.description}
                onChange={(e) =>
                  setFormMetadata((prev) => ({
                    ...prev,
                    description: e.target.value,
                  }))
                }
                className="text-sm text-gray-600 bg-transparent border-none focus:outline-none focus:ring-0 w-full mt-1 p-0"
                placeholder="Enter form description..."
              />
            </div>
            <div className="flex items-center gap-3">
              <Button
                onClick={() => setShowPreview(!showPreview)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                  showPreview
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                <Eye className="w-4 h-4" />
                {showPreview ? "Edit Mode" : "Preview"}
              </Button>
              {formId ? (
                <Button
                  disabled={fields.length === 0}
                  loading={isUpdateLoading}
                  onClick={() => createForm()}
                  className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Save className="w-4 h-4" /> Update form
                </Button>
              ) : (
                <FormApprovalDialog
                  disabled={fields.length === 0}
                  onConfirm={createForm}
                  isLoading={isFormCreateLoading || isApprovalLoading}
                />
              )}
            </div>
          </div>
        </div>

        {/* Canvas Content */}
        <div className="flex-1 overflow-auto">
          {showPreview ? (
            /* Preview Mode */
            <div className="max-w-3xl mx-auto p-8">
              <div className="bg-white rounded-lg shadow-sm border p-8">
                <div className="mb-8">
                  <h1 className="text-3xl font-bold text-gray-900">
                    {formMetadata.title}
                  </h1>
                  {formMetadata.description && (
                    <p className="text-gray-600 mt-3 text-lg">
                      {formMetadata.description}
                    </p>
                  )}
                </div>

                {fields.length === 0 ? (
                  <div className="text-center py-16 text-gray-500">
                    <div className="mb-4">
                      <Settings className="w-16 h-16 mx-auto text-gray-300" />
                    </div>
                    <h3 className="text-xl font-medium mb-2">
                      No fields added yet
                    </h3>
                    <p>Switch to edit mode to start building your form</p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {fields.map((field, index) => (
                      <FormField
                        isPreview
                        key={`${field.id}-${index}`}
                        field={field}
                        isSelected={false}
                        onSelect={() => {}}
                        onDelete={() => {}}
                        onEdit={() => {}}
                      />
                    ))}

                    <div className="pt-6 border-t">
                      <button
                        type="button"
                        className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors font-medium"
                      >
                        Submit Form
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            /* Edit Mode */
            <div className="max-w-4xl mx-auto p-8">
              <div
                className={`min-h-96 bg-white rounded-lg shadow-sm border-2 border-dashed p-8 transition-colors `}
              >
                {fields.length === 0 ? (
                  <div className="text-center py-20 text-gray-500">
                    <div className="mb-6">
                      <Settings className="w-20 h-20 mx-auto text-gray-300" />
                    </div>
                    <h3 className="text-2xl font-medium mb-3">
                      Start Building Your Form
                    </h3>
                    <p className="text-lg mb-4">
                      Drag field types from the sidebar or click them to add to
                      your form
                    </p>
                    <div className="flex justify-center gap-2 text-sm text-gray-400">
                      <span>
                        💡 Tip: Click on any field to edit its properties
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {fields.map((field, index) => (
                      <FormField
                        isPreview={false}
                        key={`${field.id}-${index}`}
                        field={field}
                        isSelected={selectedField?.id === field.id}
                        onSelect={setSelectedField}
                        onDelete={deleteField}
                        onEdit={setEditingField}
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Field Editor Modal */}
      {editingField && formTypes && (
        <FieldEditor
          masterData={editingField}
          selectedFromConstrain={formTypes.constraints}
          onUpdate={updateField}
          onClose={() => setEditingField(null)}
        />
      )}
    </div>
  );
};

export default FormBuilderCanvas;
