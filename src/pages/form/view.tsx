import {
  Settings,
  Clock,
  CheckCircle,
  XCircle,
  User,
  ArrowRight,
  Users,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useParams } from "react-router";
import FormField from "./form-field";
import {
  useChangeFormStatus,
  useGetFormApprovalLevels,
  useGetFormById,
} from "./service";
import type { Approvallevel, RenderFormField } from "./types";
import { convertApiFieldToConfig } from "../../helpers";
import useAuthStore from "@/store/use-auth-store";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { DialogTitle } from "@radix-ui/react-dialog";

const View = () => {
  const [formMetadata, setFormMetadata] = useState<{
    name: string;
    description: string;
    form_fields: RenderFormField[];
  }>();
  const [showCommentModal, setShowCommentModal] = useState(false);
  const [selectedLevel, setSelectedLevel] = useState<Approvallevel | null>(
    null
  );
  const [comments, setComments] = useState("");

  const { role } = useAuthStore();

  const { formId } = useParams();

  const { data: formData } = useGetFormById(formId);

  const { mutateAsync: changeFormStatusMutation } = useChangeFormStatus();

  const { data: approvalData, refetch } = useGetFormApprovalLevels(formId);

  useEffect(() => {
    if (formId) {
      const convertedFields = formData?.form_fields
        ? formData.form_fields.map(convertApiFieldToConfig)
        : [];

      setFormMetadata({
        name: formData?.name || "",
        description: formData?.description || "",
        form_fields: convertedFields,
      });
    }
  }, [formId, formData]);

  const canUserApprove = (level: Approvallevel): boolean => {
    if (!approvalData) return false;

    if (level.approver_role !== role) return false;

    // Check if level is pending
    if (level.current_approval_status === 3) return false;

    // For sequential approval, check if it's the current level
    if (approvalData.is_sequential) {
      return level.level === approvalData.current_level;
    }

    // For parallel approval, user can approve any pending level they have access to
    return true;
  };

  const processApproval = async (approvalStatus: 3 | 4) => {
    try {
      if (!approvalData) return;

      console.log(selectedLevel);

      await changeFormStatusMutation({
        data: {
          approval_status: approvalStatus,
          remarks: comments,
        },
        levelId: selectedLevel?.id,
      });

      setShowCommentModal(false);
      setComments("");
      setSelectedLevel(null);
      alert("Form status changed");

      refetch();
    } catch (error) {
      console.log("Error processing approval:", error);
      alert("Error processing approval");
    }
  };

  const getStatusColor = (status: number) => {
    switch (status) {
      case 3:
        return "text-green-600 bg-green-100";
      case 4:
        return "text-red-600 bg-red-100";
      case 2:
        return "text-yellow-600 bg-yellow-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

  const getApprovalStatus = (status: number) => {
    switch (status) {
      case 3:
        return "Approved";
      case 4:
        return "Rejected";
      case 2:
        return "Pending";
      default:
        return "Pending";
    }
  };

  const getStatusIcon = (status: number) => {
    switch (status) {
      case 3:
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 4:
        return <XCircle className="w-5 h-5 text-red-600" />;
      case 2:
        return <Clock className="w-5 h-5 text-yellow-600" />;
      default:
        return <Clock className="w-5 h-5 text-gray-600" />;
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-8">
      <div className="bg-white rounded-lg shadow-sm border p-8">
        {/* Form Header */}
        <div className="mb-8">
          <div className="flex w-full justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                {formMetadata?.name}
              </h1>
              <p className="text-gray-600 mt-3 text-lg">
                {formMetadata?.description}
              </p>
            </div>

            {/* Overall Status Badge */}
            <div className="flex flex-col items-end gap-2">
              {approvalData && (
                <span
                  className={`px-4 py-2 text-sm font-medium rounded-full ${getStatusColor(
                    approvalData?.overall_approval_status
                  )}`}
                >
                  {approvalData?.overall_approval_status === 2
                    ? "Pending"
                    : approvalData?.overall_approval_status === 3
                    ? "Approved"
                    : "Rejected"}
                </span>
              )}
              <span className="text-sm text-gray-500">
                {approvalData?.is_sequential
                  ? "Sequential Approval"
                  : "Parallel Approval"}
              </span>
            </div>
          </div>
        </div>

        {/* Approval Timeline */}
        {approvalData && (
          <div className="mb-8 p-6 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-2 mb-6">
              {approvalData.is_sequential ? (
                <ArrowRight className="w-5 h-5 text-blue-600" />
              ) : (
                <Users className="w-5 h-5 text-blue-600" />
              )}
              <h3 className="text-lg font-semibold text-gray-900">
                Approval Timeline
              </h3>
            </div>

            <div className="space-y-4">
              {approvalData.approval_levels.map((level) => (
                <div
                  key={level.id}
                  className="flex items-start gap-4 p-4 bg-white rounded-lg border"
                >
                  <div className="flex-shrink-0">
                    {getStatusIcon(level.current_approval_status)}
                  </div>

                  <div className="flex-grow">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-semibold text-gray-900">
                          Level {level.level}: {level.approver_role}
                        </h4>
                        {level.latest_history?.approver_name && (
                          <p className="text-sm text-gray-600 flex items-center gap-1">
                            <User className="w-4 h-4" />
                            {level.latest_history.approver_name}
                          </p>
                        )}
                      </div>

                      <div className="flex items-center gap-2">
                        <span
                          className={`px-3 py-1 text-xs font-medium rounded-full ${getStatusColor(
                            level.current_approval_status
                          )}`}
                        >
                          {getApprovalStatus(level.current_approval_status)}
                        </span>

                        {canUserApprove(level) && (
                          <Button
                            className="bg-blue-600 text-white"
                            onClick={() => {
                              setShowCommentModal(true);
                              setSelectedLevel(level);
                            }}
                          >
                            Approve/Reject
                          </Button>
                        )}
                      </div>
                    </div>

                    {level.latest_history?.remarks && (
                      <div className="mt-2 p-2 bg-gray-100 rounded text-sm">
                        <strong>Comments:</strong>{" "}
                        {level.latest_history?.remarks}
                      </div>
                    )}

                    {level.latest_history?.created_at && (
                      <p className="text-xs text-gray-500 mt-1">
                        {level.current_approval_status === 3
                          ? `Approved on ${new Date(
                              level.latest_history?.created_at
                            ).toLocaleDateString()}`
                          : level.current_approval_status === 4
                          ? `Rejected on ${new Date(
                              level.latest_history.created_at
                            ).toLocaleDateString()}`
                          : ""}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Form Fields */}
        {formMetadata?.form_fields.length === 0 ? (
          <div className="text-center py-16 text-gray-500">
            <div className="mb-4">
              <Settings className="w-16 h-16 mx-auto text-gray-300" />
            </div>
            <h3 className="text-xl font-medium mb-2">No fields added yet</h3>
            <p>Switch to edit mode to start building your form</p>
          </div>
        ) : (
          <div className="space-y-6">
            {formMetadata?.form_fields.map((field, index) => (
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
          </div>
        )}
      </div>

      {/* Comments Modal */}
      {showCommentModal && selectedLevel && (
        <Dialog open>
          <DialogContent className="bg-white rounded-lg p-6 w-full max-w-md">
            <DialogTitle>Add Comments (Optional)</DialogTitle>
            <textarea
              value={comments}
              onChange={(e) => setComments(e.target.value)}
              placeholder="Add your comments here..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={4}
            />
            <div className="flex justify-end gap-2 mt-4">
              <button
                onClick={() => {
                  setShowCommentModal(false);
                  setComments("");
                  setSelectedLevel(null);
                }}
                className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={() => processApproval(3)}
                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
              >
                Approve
              </button>
              <button
                onClick={() => processApproval(4)}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
              >
                Reject
              </button>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default View;
