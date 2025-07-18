import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "../ui/button";
import { Save } from "lucide-react";
import { useListRoles } from "@/api/service";
import type { ApprovalPayload } from "@/pages/form/types";

const FormApprovalDialog = ({
  disabled,
  onConfirm,
  isLoading,
}: {
  isLoading?: boolean;
  disabled: boolean;
  onConfirm: (approvalData: ApprovalPayload) => Promise<void>;
}) => {
  const [open, setOpen] = useState(false);
  const [approvalType, setApprovalType] = useState("");
  const [approvalRoles, setApprovalRoles] = useState<string[]>([]);
  const [approvalWorkflowType, setApprovalWorkflowType] = useState<string>("1");

  const { data: roles } = useListRoles();

  const availableRoles =
    roles?.map((role) => ({ label: role.name, value: role.id })) || [];

  useEffect(() => {
    const count = parseInt(approvalType);
    if (count > 0) {
      setApprovalRoles(new Array(count).fill(""));
    } else {
      setApprovalRoles([]);
    }
  }, [approvalType]);

  const handleRoleChange = (index: number, role: string) => {
    const updatedRoles = [...approvalRoles];
    updatedRoles[index] = role;
    setApprovalRoles(updatedRoles);
  };

  const handleSubmit = async () => {
    if (!approvalType) {
      alert("Please select approval type");
      return;
    }

    const emptyRoles = approvalRoles.some((role) => !role);
    if (emptyRoles) {
      alert("Please select all approval roles");
      return;
    }

    // Handle form submission here
    console.log("Approval Type:", approvalType);
    console.log("Approval Roles:", approvalRoles);

    const approvalPayload = {
      approval_levels: approvalRoles.map((role_id, index) => ({
        level: index + 1,
        role_id,
      })),

      is_sequential: approvalWorkflowType === "1",
    };

    await onConfirm(approvalPayload);

    setOpen(false);
    setApprovalType("");
    setApprovalRoles([]);
    setApprovalWorkflowType("");
  };

  const handleCancel = () => {
    setOpen(false);
    setApprovalType("");
    setApprovalRoles([]);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          disabled={disabled}
          className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Save className="w-4 h-4" /> Create form
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Form Approval System</DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Form Approval Type Dropdown */}
          <div className="space-y-2">
            <label
              htmlFor="approval-type"
              className="text-sm font-medium text-gray-700"
            >
              Form Approval Type
            </label>
            <input
              type="number"
              min={1}
              max={5}
              id="approval-type"
              value={approvalType}
              onChange={(e) => {
                const value = e.target.value;
                if (value >= "1" && value <= "5") {
                  setApprovalType(value);
                } else {
                  setApprovalType("0");
                }
              }}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            ></input>
          </div>

          {/* Dynamic Role Selection */}
          {approvalRoles.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-sm font-medium text-gray-700">
                Approval Roles
              </h3>
              {approvalRoles.map((role, index) => (
                <div key={index} className="space-y-2">
                  <label
                    htmlFor={`role-${index}`}
                    className="text-sm text-gray-600"
                  >
                    Level {index + 1} Approver
                  </label>
                  <select
                    id={`role-${index}`}
                    value={role}
                    onChange={(e) => handleRoleChange(index, e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Select role</option>
                    {availableRoles.map((availableRole) => (
                      <option
                        key={`role-${index}-${availableRole.value}`}
                        value={availableRole.value}
                      >
                        {availableRole.label}
                      </option>
                    ))}
                  </select>
                </div>
              ))}
            </div>
          )}

          {approvalRoles.length > 1 && (
            <div className="space-y-4">
              <div className="space-y-2">
                <label
                  htmlFor={`approval-type`}
                  className="text-sm text-gray-600"
                >
                  Approval Type
                </label>
                <select
                  id={"approval-type"}
                  value={approvalWorkflowType}
                  onChange={(e) => {
                    const value = e.target.value;
                    setApprovalWorkflowType(value);
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="1">Sequential</option>
                  <option value="2">Parallel</option>
                </select>
              </div>
            </div>
          )}
        </div>

        <DialogFooter className="flex justify-end space-x-2">
          <button
            onClick={handleCancel}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
          >
            Cancel
          </button>
          <Button
            onClick={handleSubmit}
            loading={isLoading}
            disabled={!approvalType || approvalRoles.some((role) => !role)}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed rounded-md transition-colors"
          >
            Create Form
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default FormApprovalDialog;
