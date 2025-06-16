import {Calendar, CheckSquare, Circle, FileText, Hash, List, Mail, Type} from 'lucide-react';

// Field type definitions with icons
export const FIELD_TYPES = [
  { type: 'text', label: 'Text Input', icon: Type, id: "1" },
  { type: 'textarea', label: 'Text Area', icon: FileText, id: "2" },
  { type: 'select', label: 'Select Dropdown', icon: List, id: "3" },
  { type: 'radio', label: 'Radio Buttons', icon: Circle, id: "4" },
  { type: 'checkbox', label: 'Checkbox Group', icon: CheckSquare, id: "5" },
  { type: 'number', label: 'Number Input', icon: Hash, id: "6" },
  { type: 'email', label: 'Email Input', icon: Mail, id: "7" },
  { type: 'date', label: 'Date Picker', icon: Calendar, id: "8" }
];