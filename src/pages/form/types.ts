export interface GetFormDetails {
  id: number;
  name: string;
  description: string;
  form_fields: Formfield[];
  created_at: string;
  updated_at: string;
  status: boolean;
}

export interface Formfield {
  id: number;
  label: string;
  field_type_id: number;
  field_type: Fieldtype;
  fieldoption: { id: string; value: string; label: string }[];
  fieldconstraintvalue: (Fieldconstraintvalue | Fieldconstraintvalue2)[];
  status: boolean;
}

interface Fieldconstraintvalue2 {
  id: number;
  value: string;
  form_field: number;
  constraint: Constraint2;
  status: boolean;
}

interface Constraint2 {
  id: number;
  name: string;
  defaultValue: null;
  value: null | string;
}

interface Fieldconstraintvalue {
  id: number;
  value: string;
  form_field: number;
  constraint: Constraint;
  status: boolean;
}

interface Constraint {
  id: number;
  name: string;
  defaultValue: null;
  value: string;
}

interface Fieldtype {
  id: number;
  name: string;
  label: string;
}

export interface RenderFormField {
  name: FieldType;
  label: string;
  options: FieldOption[];
  validation: FieldValidation;
  id: number | null;
}

export type FieldType =
  | "text"
  | "textarea"
  | "select"
  | "radio"
  | "checkbox"
  | "number"
  | "email"
  | "date";

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
  disabled: boolean;
  multiple: boolean;
  placeholder: string;
  defaultValue: string;
  required: boolean;
}

export interface ApprovalPayload {
  is_sequential: boolean;
  approval_levels: { level: number; role_id: string }[];
}


export interface FormApprovalList {
  is_sequential: boolean;
  approval_levels: Approvallevel[];
  overall_approval_status: 2 | 3 | 4;
  current_level:2 | 3 | 4;
}

export interface Approvallevel {
  id: number;
  level: number;
  approver_role: string;
  approver_name?: string;
  approver_date?: string;
  comments?: string;
  current_approval_status:  2 | 3 | 4;
  latest_history: {
  id: number;
  approval_status: number;
  remarks: string;
  approver_name: string;
  created_at: string;
} | null
}