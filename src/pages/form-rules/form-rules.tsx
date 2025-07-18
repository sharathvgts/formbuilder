import React, { useState, useEffect } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Plus, Trash2, Eye, EyeOff, Settings, Play, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";

// Types
interface FormField {
  id: string;
  type:
    | "text"
    | "email"
    | "number"
    | "select"
    | "checkbox"
    | "radio"
    | "textarea"
    | "date";
  label: string;
  placeholder?: string;
  required: boolean;
  options?: string[];
}

interface FormRule {
  id: string;
  name: string;
  trigger: {
    field: string;
    condition: string;
    value: string;
  };
  actions: {
    type:
      | "show"
      | "hide"
      | "enable"
      | "disable"
      | "require"
      | "unrequire"
      | "set_value";
    target: string;
    value?: string;
  }[];
  enabled: boolean;
}

interface FormSchema {
  fields: FormField[];
  rules: FormRule[];
}

// Zod schemas
const fieldSchema = z.object({
  id: z.string().min(1, "Field ID is required"),
  type: z.enum([
    "text",
    "email",
    "number",
    "select",
    "checkbox",
    "radio",
    "textarea",
    "date",
  ]),
  label: z.string().min(1, "Label is required"),
  placeholder: z.string().optional(),
  required: z.boolean(),
  options: z.array(z.string()).optional(),
});

const ruleSchema = z.object({
  id: z.string().min(1, "Rule ID is required"),
  name: z.string().min(1, "Rule name is required"),
  trigger: z.object({
    field: z.string().min(1, "Trigger field is required"),
    condition: z.string().min(1, "Condition is required"),
    value: z.string().min(1, "Trigger value is required"),
  }),
  actions: z
    .array(
      z.object({
        type: z.enum([
          "show",
          "hide",
          "enable",
          "disable",
          "require",
          "unrequire",
          "set_value",
        ]),
        target: z.string().min(1, "Action target is required"),
        value: z.string().optional(),
      })
    )
    .min(1, "At least one action is required"),
  enabled: z.boolean(),
});

// Constants
const FIELD_TYPES = [
  { value: "text", label: "Text" },
  { value: "email", label: "Email" },
  { value: "number", label: "Number" },
  { value: "select", label: "Select" },
  { value: "checkbox", label: "Checkbox" },
  { value: "radio", label: "Radio" },
  { value: "textarea", label: "Textarea" },
  { value: "date", label: "Date" },
];

const RULE_CONDITIONS = [
  { value: "equals", label: "Equals" },
  { value: "not_equals", label: "Not Equals" },
  { value: "contains", label: "Contains" },
  { value: "not_contains", label: "Not Contains" },
  { value: "is_empty", label: "Is Empty" },
  { value: "is_not_empty", label: "Is Not Empty" },
  { value: "greater_than", label: "Greater Than" },
  { value: "less_than", label: "Less Than" },
];

const RULE_ACTIONS = [
  { value: "show", label: "Show Field" },
  { value: "hide", label: "Hide Field" },
  { value: "enable", label: "Enable Field" },
  { value: "disable", label: "Disable Field" },
  { value: "require", label: "Make Required" },
  { value: "unrequire", label: "Make Optional" },
  { value: "set_value", label: "Set Value" },
];

// Main Component
export default function DynamicFormBuilder() {
  const [activeTab, setActiveTab] = useState("form-builder");
  const [formSchema, setFormSchema] = useState<FormSchema>({
    fields: [],
    rules: [],
  });
  const [selectedField, setSelectedField] = useState<string>("");
  const [previewData, setPreviewData] = useState({});

  // Form Builder Form
  const formBuilderForm = useForm({
    resolver: zodResolver(
      z.object({
        fields: z.array(fieldSchema),
      })
    ),
    defaultValues: {
      fields: [],
    },
  });

  const {
    fields: formFields,
    append: appendField,
    remove: removeField,
  } = useFieldArray({
    control: formBuilderForm.control,
    name: "fields",
  });

  // Rules Builder Form
  const rulesBuilderForm = useForm({
    resolver: zodResolver(
      z.object({
        rules: z.array(ruleSchema),
      })
    ),
    defaultValues: {
      rules: [],
    },
  });

  const {
    fields: ruleFields,
    append: appendRule,
    remove: removeRule,
  } = useFieldArray({
    control: rulesBuilderForm.control,
    name: "rules",
  });

  // Dynamic Form Preview
  const previewForm = useForm();

  // Add new field
  const addField = () => {
    const newField: FormField = {
      id: `field_${Date.now()}`,
      type: "text",
      label: "New Field",
      required: false,
      options: [],
    };
    appendField(newField);
  };

  // Add new rule
  const addRule = () => {
    const newRule: FormRule = {
      id: `rule_${Date.now()}`,
      name: "New Rule",
      trigger: {
        field: "",
        condition: "equals",
        value: "",
      },
      actions: [
        {
          type: "show",
          target: "",
          value: "",
        },
      ],
      enabled: true,
    };
    appendRule(newRule);
  };

  // Save form schema
  const saveFormSchema = () => {
    const fields = formBuilderForm.getValues("fields");
    const rules = rulesBuilderForm.getValues("rules");
    setFormSchema({ fields, rules });
    alert("Form schema saved!");
  };

  // Field Builder Component
  const FieldBuilder = React.memo(({ fieldIndex }: { fieldIndex: number }) => {
    const fieldData = formBuilderForm.watch(`fields.${fieldIndex}`);
    const [localOptions, setLocalOptions] = useState(
      fieldData?.options?.join("\n") || ""
    );

    const handleOptionsChange = (value: string) => {
      setLocalOptions(value);
      const options = value.split("\n").filter((opt) => opt.trim());
      formBuilderForm.setValue(`fields.${fieldIndex}.options`, options);
    };

    return (
      <Card className="mb-4">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">Field {fieldIndex + 1}</CardTitle>
            <Button
              variant="destructive"
              size="sm"
              onClick={() => removeField(fieldIndex)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor={`field-${fieldIndex}-id`}>Field ID</Label>
              <Input
                key={`field-${fieldIndex}-id`}
                id={`field-${fieldIndex}-id`}
                {...formBuilderForm.register(`fields.${fieldIndex}.id`)}
                placeholder="field_name"
              />
            </div>
            <div>
              <Label htmlFor={`field-${fieldIndex}-type`}>Field Type</Label>
              <Select
                value={fieldData?.type || "text"}
                onValueChange={(value) =>
                  formBuilderForm.setValue(
                    `fields.${fieldIndex}.type`,
                    value as any
                  )
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  {FIELD_TYPES.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label htmlFor={`field-${fieldIndex}-label`}>Label</Label>
            <Input
              key={`field-${fieldIndex}-label`}
              id={`field-${fieldIndex}-label`}
              {...formBuilderForm.register(`fields.${fieldIndex}.label`)}
              placeholder="Field label"
            />
          </div>

          <div>
            <Label htmlFor={`field-${fieldIndex}-placeholder`}>
              Placeholder
            </Label>
            <Input
              key={`field-${fieldIndex}-placeholder`}
              id={`field-${fieldIndex}-placeholder`}
              {...formBuilderForm.register(`fields.${fieldIndex}.placeholder`)}
              placeholder="Placeholder text"
            />
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id={`field-${fieldIndex}-required`}
              checked={fieldData?.required || false}
              onCheckedChange={(checked) =>
                formBuilderForm.setValue(
                  `fields.${fieldIndex}.required`,
                  checked
                )
              }
            />
            <Label htmlFor={`field-${fieldIndex}-required`}>Required</Label>
          </div>

          {(fieldData?.type === "select" || fieldData?.type === "radio") && (
            <div>
              <Label htmlFor={`field-${fieldIndex}-options`}>
                Options (one per line)
              </Label>
              <Textarea
                key={`field-${fieldIndex}-options`}
                id={`field-${fieldIndex}-options`}
                placeholder="Option 1&#10;Option 2&#10;Option 3"
                value={localOptions}
                onChange={(e) => handleOptionsChange(e.target.value)}
              />
            </div>
          )}
        </CardContent>
      </Card>
    );
  });

  // Rule Builder Component
  const RuleBuilder = React.memo(({ ruleIndex }: { ruleIndex: number }) => {
    const ruleData = rulesBuilderForm.watch(`rules.${ruleIndex}`);
    const availableFields = formBuilderForm.watch("fields") || [];

    return (
      <Card className="mb-4">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <CardTitle className="text-lg">Rule {ruleIndex + 1}</CardTitle>
              <Switch
                checked={ruleData?.enabled || false}
                onCheckedChange={(checked) =>
                  rulesBuilderForm.setValue(
                    `rules.${ruleIndex}.enabled`,
                    checked
                  )
                }
              />
            </div>
            <Button
              variant="destructive"
              size="sm"
              onClick={() => removeRule(ruleIndex)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor={`rule-${ruleIndex}-name`}>Rule Name</Label>
            <Input
              key={`rule-${ruleIndex}-name`}
              id={`rule-${ruleIndex}-name`}
              {...rulesBuilderForm.register(`rules.${ruleIndex}.name`)}
              placeholder="Rule name"
            />
          </div>

          <div className="border rounded-lg p-4">
            <h4 className="font-semibold mb-3">Trigger Condition</h4>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label>Field</Label>
                <Select
                  value={ruleData?.trigger?.field || ""}
                  onValueChange={(value) =>
                    rulesBuilderForm.setValue(
                      `rules.${ruleIndex}.trigger.field`,
                      value
                    )
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select field" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableFields.map((field) => (
                      <SelectItem key={field.id} value={field.id}>
                        {field.label} ({field.id})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Condition</Label>
                <Select
                  value={ruleData?.trigger?.condition || "equals"}
                  onValueChange={(value) =>
                    rulesBuilderForm.setValue(
                      `rules.${ruleIndex}.trigger.condition`,
                      value
                    )
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select condition" />
                  </SelectTrigger>
                  <SelectContent>
                    {RULE_CONDITIONS.map((condition) => (
                      <SelectItem key={condition.value} value={condition.value}>
                        {condition.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Value</Label>
                <Input
                  key={`rule-${ruleIndex}-trigger-value`}
                  {...rulesBuilderForm.register(
                    `rules.${ruleIndex}.trigger.value`
                  )}
                  placeholder="Trigger value"
                />
              </div>
            </div>
          </div>

          <div className="border rounded-lg p-4">
            <h4 className="font-semibold mb-3">Actions</h4>
            {ruleData?.actions?.map((action, actionIndex) => (
              <div key={actionIndex} className="grid grid-cols-3 gap-4 mb-3">
                <div>
                  <Label>Action Type</Label>
                  <Select
                    value={action?.type || "show"}
                    onValueChange={(value) =>
                      rulesBuilderForm.setValue(
                        `rules.${ruleIndex}.actions.${actionIndex}.type`,
                        value as any
                      )
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select action" />
                    </SelectTrigger>
                    <SelectContent>
                      {RULE_ACTIONS.map((actionType) => (
                        <SelectItem
                          key={actionType.value}
                          value={actionType.value}
                        >
                          {actionType.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Target Field</Label>
                  <Select
                    value={action?.target || ""}
                    onValueChange={(value) =>
                      rulesBuilderForm.setValue(
                        `rules.${ruleIndex}.actions.${actionIndex}.target`,
                        value
                      )
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select target" />
                    </SelectTrigger>
                    <SelectContent>
                      {availableFields.map((field) => (
                        <SelectItem key={field.id} value={field.id}>
                          {field.label} ({field.id})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Value (if needed)</Label>
                  <Input
                    key={`rule-${ruleIndex}-action-${actionIndex}-value`}
                    {...rulesBuilderForm.register(
                      `rules.${ruleIndex}.actions.${actionIndex}.value`
                    )}
                    placeholder="Action value"
                  />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  });

  // Form Preview Component
  const FormPreview = () => {
    const [fieldVisibility, setFieldVisibility] = useState<
      Record<string, boolean>
    >({});
    const [fieldRequirement, setFieldRequirement] = useState<
      Record<string, boolean>
    >({});

    const watchedValues = previewForm.watch();

    // Apply rules
    useEffect(() => {
      const newVisibility = { ...fieldVisibility };
      const newRequirement = { ...fieldRequirement };

      formSchema.rules?.forEach((rule) => {
        if (!rule.enabled) return;

        const triggerField = rule.trigger.field;
        const triggerValue = watchedValues[triggerField];
        const conditionMet = evaluateCondition(
          triggerValue,
          rule.trigger.condition,
          rule.trigger.value
        );

        if (conditionMet) {
          rule.actions.forEach((action) => {
            switch (action.type) {
              case "show":
                newVisibility[action.target] = true;
                break;
              case "hide":
                newVisibility[action.target] = false;
                break;
              case "require":
                newRequirement[action.target] = true;
                break;
              case "unrequire":
                newRequirement[action.target] = false;
                break;
              case "set_value":
                previewForm.setValue(action.target, action.value || "");
                break;
            }
          });
        }
      });

      setFieldVisibility(newVisibility);
      setFieldRequirement(newRequirement);
    }, [watchedValues, formSchema.rules]);

    const evaluateCondition = (
      fieldValue: any,
      condition: string,
      targetValue: string
    ): boolean => {
      switch (condition) {
        case "equals":
          return fieldValue === targetValue;
        case "not_equals":
          return fieldValue !== targetValue;
        case "contains":
          return String(fieldValue).includes(targetValue);
        case "not_contains":
          return !String(fieldValue).includes(targetValue);
        case "is_empty":
          return !fieldValue || fieldValue === "";
        case "is_not_empty":
          return fieldValue && fieldValue !== "";
        case "greater_than":
          return Number(fieldValue) > Number(targetValue);
        case "less_than":
          return Number(fieldValue) < Number(targetValue);
        default:
          return false;
      }
    };

    const renderField = (field: FormField) => {
      const isVisible = fieldVisibility[field.id] !== false;
      const isRequired = fieldRequirement[field.id] || field.required;

      if (!isVisible) return null;

      switch (field.type) {
        case "text":
        case "email":
        case "number":
        case "date":
          return (
            <div key={field.id} className="space-y-2">
              <Label htmlFor={field.id}>
                {field.label}{" "}
                {isRequired && <span className="text-red-500">*</span>}
              </Label>
              <Input
                id={field.id}
                type={field.type}
                placeholder={field.placeholder}
                {...previewForm.register(field.id, { required: isRequired })}
              />
            </div>
          );
        case "textarea":
          return (
            <div key={field.id} className="space-y-2">
              <Label htmlFor={field.id}>
                {field.label}{" "}
                {isRequired && <span className="text-red-500">*</span>}
              </Label>
              <Textarea
                id={field.id}
                placeholder={field.placeholder}
                {...previewForm.register(field.id, { required: isRequired })}
              />
            </div>
          );
        case "select":
          return (
            <div key={field.id} className="space-y-2">
              <Label htmlFor={field.id}>
                {field.label}{" "}
                {isRequired && <span className="text-red-500">*</span>}
              </Label>
              <Select
                value={watchedValues[field.id] || ""}
                onValueChange={(value) => previewForm.setValue(field.id, value)}
              >
                <SelectTrigger>
                  <SelectValue
                    placeholder={field.placeholder || "Select option"}
                  />
                </SelectTrigger>
                <SelectContent>
                  {field.options?.map((option) => (
                    <SelectItem key={option} value={option}>
                      {option}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          );
        case "checkbox":
          return (
            <div key={field.id} className="flex items-center space-x-2">
              <input
                id={field.id}
                type="checkbox"
                className="h-4 w-4"
                {...previewForm.register(field.id, { required: isRequired })}
              />
              <Label htmlFor={field.id}>
                {field.label}{" "}
                {isRequired && <span className="text-red-500">*</span>}
              </Label>
            </div>
          );
        case "radio":
          return (
            <div key={field.id} className="space-y-2">
              <Label>
                {field.label}{" "}
                {isRequired && <span className="text-red-500">*</span>}
              </Label>
              <div className="space-y-2">
                {field.options?.map((option) => (
                  <div key={option} className="flex items-center space-x-2">
                    <input
                      id={`${field.id}-${option}`}
                      type="radio"
                      value={option}
                      className="h-4 w-4"
                      {...previewForm.register(field.id, {
                        required: isRequired,
                      })}
                    />
                    <Label htmlFor={`${field.id}-${option}`}>{option}</Label>
                  </div>
                ))}
              </div>
            </div>
          );
        default:
          return null;
      }
    };

    return (
      <Card>
        <CardHeader>
          <CardTitle>Form Preview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {formSchema.fields?.map(renderField)}
            <Button
              onClick={() => {
                const data = previewForm.getValues();
                console.log("Form Data:", data);
                alert("Form submitted! Check console for data.");
              }}
              className="mt-4"
            >
              Submit Form
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">
            Dynamic Form Builder
          </h1>
          <p className="text-gray-600 mt-2">
            Create dynamic forms with conditional rules and validation
          </p>
        </div>

        <div className="mb-4 flex justify-between items-center">
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full"
          >
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="form-builder">Form Builder</TabsTrigger>
              <TabsTrigger value="rules-builder">Rules Builder</TabsTrigger>
              <TabsTrigger value="preview">Preview</TabsTrigger>
            </TabsList>
          </Tabs>
          <Button onClick={saveFormSchema} className="ml-4">
            <Save className="h-4 w-4 mr-2" />
            Save Schema
          </Button>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsContent value="form-builder">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <Card>
                  <CardHeader>
                    <div className="flex justify-between items-center">
                      <CardTitle>Form Fields</CardTitle>
                      <Button onClick={addField}>
                        <Plus className="h-4 w-4 mr-2" />
                        Add Field
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {formFields.length === 0 ? (
                      <div className="text-center py-8 text-gray-500">
                        No fields added yet. Click "Add Field" to get started.
                      </div>
                    ) : (
                      formFields.map((field, index) => (
                        <FieldBuilder key={field.id} fieldIndex={index} />
                      ))
                    )}
                  </CardContent>
                </Card>
              </div>
              <div>
                <Card>
                  <CardHeader>
                    <CardTitle>Form Summary</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span>Total Fields:</span>
                        <Badge>{formFields.length}</Badge>
                      </div>
                      <div className="flex justify-between">
                        <span>Required Fields:</span>
                        <Badge>
                          {formFields.filter((f) => f.required).length}
                        </Badge>
                      </div>
                      <div className="flex justify-between">
                        <span>Rules:</span>
                        <Badge>{formSchema.rules?.length || 0}</Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="rules-builder">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle>Form Rules</CardTitle>
                  <Button onClick={addRule}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Rule
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {ruleFields.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    No rules added yet. Click "Add Rule" to create conditional
                    logic.
                  </div>
                ) : (
                  ruleFields.map((rule, index) => (
                    <RuleBuilder key={rule.id} ruleIndex={index} />
                  ))
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="preview">
            <FormPreview />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
