import React, { useState, useCallback } from 'react';
import {
  Type,
  List,
  CheckSquare,
  Circle,
  Calendar,
  Hash,
  Mail,
  FileText,
  Upload,
  Trash2,
  Settings,
  Eye,
  Plus,
  GripVertical,
  X,
  Save
} from 'lucide-react';

// Type definitions
type FieldType = 'text' | 'textarea' | 'select' | 'radio' | 'checkbox' | 'number' | 'email' | 'date' | 'file';

interface FieldOption {
  id: string;
  label: string;
  value: string;
}

interface FieldValidation {
  minLength: string;
  maxLength: string;
  min: string;
  max: string;
  pattern: string;
}

interface FormField {
  id: string;
  type: FieldType;
  label: string;
  placeholder: string;
  defaultValue: string;
  required: boolean;
  options: FieldOption[];
  validation: FieldValidation;
}

interface FormMetadata {
  title: string;
  description: string;
}

interface DraggedItem {
  type: 'fieldType';
  fieldType: FieldType;
}

// Field type definitions with icons
const FIELD_TYPES = [
  { type: 'text' as FieldType, label: 'Text Input', icon: Type },
  { type: 'textarea' as FieldType, label: 'Text Area', icon: FileText },
  { type: 'select' as FieldType, label: 'Select Dropdown', icon: List },
  { type: 'radio' as FieldType, label: 'Radio Buttons', icon: Circle },
  { type: 'checkbox' as FieldType, label: 'Checkbox Group', icon: CheckSquare },
  { type: 'number' as FieldType, label: 'Number Input', icon: Hash },
  { type: 'email' as FieldType, label: 'Email Input', icon: Mail },
  { type: 'date' as FieldType, label: 'Date Picker', icon: Calendar },
  { type: 'file' as FieldType, label: 'File Upload', icon: Upload },
];

// Generate unique ID
let idCounter = 1;
const generateId = () => `field_${idCounter++}`;

// Default field configuration
const getDefaultFieldConfig = (type: FieldType): FormField => ({
  id: generateId(),
  type,
  label: `${type.charAt(0).toUpperCase() + type.slice(1)} Field`,
  placeholder: type === 'textarea' ? 'Enter your text here...' : `Enter ${type}...`,
  defaultValue: '',
  required: false,
  options: ['select', 'radio', 'checkbox'].includes(type) ? [
    { id: generateId(), label: 'Option 1', value: 'option1' },
    { id: generateId(), label: 'Option 2', value: 'option2' }
  ] : [],
  validation: {
    minLength: '',
    maxLength: '',
    min: '',
    max: '',
    pattern: ''
  }
});

// Individual Field Component
interface FormFieldProps {
  field: FormField;
  isSelected: boolean;
  onSelect: (field: FormField) => void;
  onDelete: (fieldId: string) => void;
  onEdit: (field: FormField) => void;
}

const FormField: React.FC<FormFieldProps> = ({ field, isSelected, onSelect, onDelete, onEdit }) => {
  const renderFieldPreview = () => {
    switch (field.type) {
      case 'text':
      case 'email':
        return (
          <input
            type={field.type}
            placeholder={field.placeholder}
            defaultValue={field.defaultValue}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            readOnly
          />
        );

      case 'textarea':
        return (
          <textarea
            placeholder={field.placeholder}
            defaultValue={field.defaultValue}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            readOnly
          />
        );

      case 'number':
        return (
          <input
            type="number"
            placeholder={field.placeholder}
            defaultValue={field.defaultValue}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            readOnly
          />
        );

      case 'select':
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

      case 'radio':
        return (
          <div className="space-y-2">
            {field.options.map((option) => (
              <label key={option.id} className="flex items-center gap-2">
                <input
                  type="radio"
                  name={`preview_${field.id}`}
                  value={option.value}
                  className="text-blue-600 focus:ring-blue-500"
                />
                <span>{option.label}</span>
              </label>
            ))}
          </div>
        );

      case 'checkbox':
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

      case 'date':
        return (
          <input
            type="date"
            defaultValue={field.defaultValue}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            readOnly
          />
        );

      case 'file':
        return (
          <input
            type="file"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        );

      default:
        return <div className="text-gray-500">Unknown field type</div>;
    }
  };

  return (
    <div
      className={`group relative p-4 border-2 rounded-lg cursor-pointer transition-all ${isSelected
        ? 'border-blue-500 bg-blue-50'
        : 'border-gray-200 hover:border-gray-300 bg-white'
        }`}
      onClick={() => onSelect(field)}
    >
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="block text-sm font-medium text-gray-700">
            {field.label}
            {field.required && <span className="text-red-500 ml-1">*</span>}
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
            <div className="p-1 text-gray-400 cursor-grab" title="Drag to reorder">
              <GripVertical className="w-4 h-4" />
            </div>
          </div>
        </div>
        {renderFieldPreview()}
      </div>
    </div>
  );
};

// Field Editor Modal
interface FieldEditorProps {
  field: FormField;
  onUpdate: (field: FormField) => void;
  onClose: () => void;
}

const FieldEditor: React.FC<FieldEditorProps> = ({ field, onUpdate, onClose }) => {
  const [localField, setLocalField] = useState<FormField>({ ...field });

  const updateField = (key: keyof FormField, value: any) => {
    const updated = { ...localField, [key]: value };
    setLocalField(updated);
  };

  const updateValidation = (key: keyof FieldValidation, value: string) => {
    const updated = {
      ...localField,
      validation: { ...localField.validation, [key]: value }
    };
    setLocalField(updated);
  };

  const addOption = () => {
    const newOption = { id: generateId(), label: `Option ${localField.options.length + 1}`, value: `option${localField.options.length + 1}` };
    updateField('options', [...localField.options, newOption]);
  };

  const updateOption = (index: number, key: keyof FieldOption, value: string) => {
    const newOptions = [...localField.options];
    newOptions[index] = { ...newOptions[index], [key]: value };
    updateField('options', newOptions);
  };

  const removeOption = (index: number) => {
    if (localField.options.length > 1) {
      const newOptions = localField.options.filter((_, i) => i !== index);
      updateField('options', newOptions);
    }
  };

  const handleSave = () => {
    onUpdate(localField);
    onClose();
  };

  const hasOptions = ['select', 'radio', 'checkbox'].includes(localField.type);
  const hasStringValidation = ['text', 'textarea', 'email'].includes(localField.type);
  const hasNumberValidation = localField.type === 'number';

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b">
          <h3 className="text-lg font-semibold">Edit {localField.type} Field</h3>
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
              <h4 className="text-md font-medium mb-4 text-gray-800">Basic Settings</h4>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Field Label *
                  </label>
                  <input
                    type="text"
                    value={localField.label}
                    onChange={(e) => updateField('label', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter field label"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Placeholder Text
                  </label>
                  <input
                    type="text"
                    value={localField.placeholder}
                    onChange={(e) => updateField('placeholder', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter placeholder text"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Default Value
                  </label>
                  <input
                    type="text"
                    value={localField.defaultValue}
                    onChange={(e) => updateField('defaultValue', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter default value"
                  />
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="required"
                    checked={localField.required}
                    onChange={(e) => updateField('required', e.target.checked)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="required" className="ml-2 text-sm text-gray-700">
                    This field is required
                  </label>
                </div>
              </div>
            </div>

            {/* Options for select, radio, checkbox */}
            {hasOptions && (
              <div>
                <h4 className="text-md font-medium mb-4 text-gray-800">Options</h4>
                <div className="space-y-3">
                  {localField.options.map((option, index) => (
                    <div key={option.id} className="flex gap-2">
                      <input
                        type="text"
                        placeholder="Option Label"
                        value={option.label}
                        onChange={(e) => updateOption(index, 'label', e.target.value)}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <input
                        type="text"
                        placeholder="Option Value"
                        value={option.value}
                        onChange={(e) => updateOption(index, 'value', e.target.value)}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <button
                        onClick={() => removeOption(index)}
                        disabled={localField.options.length <= 1}
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

            {/* Validation Rules */}
            {(hasStringValidation || hasNumberValidation) && (
              <div>
                <h4 className="text-md font-medium mb-4 text-gray-800">Validation Rules</h4>
                <div className="space-y-4">
                  {hasStringValidation && (
                    <>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Minimum Length
                          </label>
                          <input
                            type="number"
                            value={localField.validation.minLength}
                            onChange={(e) => updateValidation('minLength', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            min="0"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Maximum Length
                          </label>
                          <input
                            type="number"
                            value={localField.validation.maxLength}
                            onChange={(e) => updateValidation('maxLength', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            min="0"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Pattern (RegEx)
                        </label>
                        <input
                          type="text"
                          value={localField.validation.pattern}
                          onChange={(e) => updateValidation('pattern', e.target.value)}
                          placeholder="e.g., [A-Za-z0-9]+"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    </>
                  )}

                  {hasNumberValidation && (
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Minimum Value
                        </label>
                        <input
                          type="number"
                          value={localField.validation.min}
                          onChange={(e) => updateValidation('min', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Maximum Value
                        </label>
                        <input
                          type="number"
                          value={localField.validation.max}
                          onChange={(e) => updateValidation('max', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
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

// Main Form Builder Component
const FormBuilderCanvas: React.FC = () => {
  const [fields, setFields] = useState<FormField[]>([]);
  const [selectedField, setSelectedField] = useState<FormField | null>(null);
  const [editingField, setEditingField] = useState<FormField | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  const [draggedItem, setDraggedItem] = useState<DraggedItem | null>(null);
  const [formMetadata, setFormMetadata] = useState<FormMetadata>({
    title: 'Untitled Form',
    description: 'Enter form description here...'
  });

  // Add field from sidebar
  const addField = useCallback((fieldType: FieldType) => {
    const newField = getDefaultFieldConfig(fieldType);
    setFields(prev => [...prev, newField]);
    setSelectedField(newField);
  }, []);

  // Update field
  const updateField = useCallback((updatedField: FormField) => {
    setFields(prev => prev.map(field =>
      field.id === updatedField.id ? updatedField : field
    ));
    setSelectedField(updatedField);
  }, []);

  // Delete field
  const deleteField = useCallback((fieldId: string) => {
    setFields(prev => prev.filter(field => field.id !== fieldId));
    if (selectedField?.id === fieldId) {
      setSelectedField(null);
    }
  }, [selectedField]);

  // Handle drag start
  const handleDragStart = (e: React.DragEvent, fieldType: FieldType) => {
    setDraggedItem({ type: 'fieldType', fieldType });
    e.dataTransfer.effectAllowed = 'copy';
  };

  // Handle drop
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (draggedItem?.type === 'fieldType') {
      addField(draggedItem.fieldType);
    }
    setDraggedItem(null);
  };

  // Handle drag over
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
  };

  // // Move field up/down
  // const moveField = (fieldId: string, direction: 'up' | 'down') => {
  //   const index = fields.findIndex(f => f.id === fieldId);
  //   if (
  //     (direction === 'up' && index > 0) ||
  //     (direction === 'down' && index < fields.length - 1)
  //   ) {
  //     const newFields = [...fields];
  //     const newIndex = direction === 'up' ? index - 1 : index + 1;
  //     [newFields[index], newFields[newIndex]] = [newFields[newIndex], newFields[index]];
  //     setFields(newFields);
  //   }
  // };

  // Export form schema
  const exportSchema = () => {
    const schema = {
      metadata: formMetadata,
      fields: fields.map(field => ({
        ...field,
        fieldKey: field.id.replace(/[^a-zA-Z0-9]/g, '_')
      }))
    };

    console.log('Form Schema:', JSON.stringify(schema, null, 2));

    // Create downloadable file
    const blob = new Blob([JSON.stringify(schema, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${formMetadata.title.replace(/\s+/g, '_').toLowerCase()}_schema.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="h-screen flex bg-gray-50">
      {/* Sidebar */}
      <div className="w-80 bg-white shadow-lg border-r overflow-y-auto">
        <div className="p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-800">Form Builder</h2>
          <p className="text-sm text-gray-600 mt-1">Drag fields to canvas or click to add</p>
        </div>

        <div className="p-4">
          <h3 className="text-sm font-medium text-gray-700 mb-3 uppercase tracking-wide">Field Types</h3>
          <div className="space-y-2">
            {FIELD_TYPES.map((fieldType) => {
              const Icon = fieldType.icon;
              return (
                <div
                  key={fieldType.type}
                  draggable
                  onDragStart={(e) => handleDragStart(e, fieldType.type)}
                  onClick={() => addField(fieldType.type)}
                  className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300 cursor-pointer hover:border-blue-400 hover:bg-blue-50 transition-all duration-200 group"
                >
                  <Icon className="w-5 h-5 text-gray-600 group-hover:text-blue-600" />
                  <span className="text-sm font-medium text-gray-700 group-hover:text-blue-700">
                    {fieldType.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Form Statistics */}
        <div className="p-4 border-t mt-4">
          <div className="bg-gray-50 rounded-lg p-3">
            <h4 className="text-sm font-medium text-gray-700 mb-2">Form Statistics</h4>
            <div className="space-y-1 text-xs text-gray-600">
              <div>Total Fields: {fields.length}</div>
              <div>Required Fields: {fields.filter(f => f.required).length}</div>
              <div>Optional Fields: {fields.filter(f => !f.required).length}</div>
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
                onChange={(e) => setFormMetadata(prev => ({ ...prev, title: e.target.value }))}
                className="text-xl font-semibold bg-transparent border-none focus:outline-none focus:ring-0 w-full p-0"
                placeholder="Enter form title..."
              />
              <input
                type="text"
                value={formMetadata.description}
                onChange={(e) => setFormMetadata(prev => ({ ...prev, description: e.target.value }))}
                className="text-sm text-gray-600 bg-transparent border-none focus:outline-none focus:ring-0 w-full mt-1 p-0"
                placeholder="Enter form description..."
              />
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowPreview(!showPreview)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${showPreview
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
              >
                <Eye className="w-4 h-4" />
                {showPreview ? 'Edit Mode' : 'Preview'}
              </button>
              <button
                onClick={exportSchema}
                disabled={fields.length === 0}
                className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Save className="w-4 h-4" />
                Export Schema
              </button>
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
                  <h1 className="text-3xl font-bold text-gray-900">{formMetadata.title}</h1>
                  {formMetadata.description && (
                    <p className="text-gray-600 mt-3 text-lg">{formMetadata.description}</p>
                  )}
                </div>

                {fields.length === 0 ? (
                  <div className="text-center py-16 text-gray-500">
                    <div className="mb-4">
                      <Settings className="w-16 h-16 mx-auto text-gray-300" />
                    </div>
                    <h3 className="text-xl font-medium mb-2">No fields added yet</h3>
                    <p>Switch to edit mode to start building your form</p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {fields.map((field) => (
                      <FormField
                        key={field.id}
                        field={field}
                        isSelected={false}
                        onSelect={() => { }}
                        onDelete={() => { }}
                        onEdit={() => { }}
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
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                className={`min-h-96 bg-white rounded-lg shadow-sm border-2 border-dashed p-8 transition-colors ${draggedItem ? 'border-blue-400 bg-blue-50' : 'border-gray-300'
                  }`}
              >
                {fields.length === 0 ? (
                  <div className="text-center py-20 text-gray-500">
                    <div className="mb-6">
                      <Settings className="w-20 h-20 mx-auto text-gray-300" />
                    </div>
                    <h3 className="text-2xl font-medium mb-3">Start Building Your Form</h3>
                    <p className="text-lg mb-4">
                      Drag field types from the sidebar or click them to add to your form
                    </p>
                    <div className="flex justify-center gap-2 text-sm text-gray-400">
                      <span>💡 Tip: Click on any field to edit its properties</span>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {fields.map((field) => (
                      <FormField
                        key={field.id}
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
      {editingField && (
        <FieldEditor
          field={editingField}
          onUpdate={updateField}
          onClose={() => setEditingField(null)}
        />
      )}
    </div>
  );
};

export default FormBuilderCanvas;