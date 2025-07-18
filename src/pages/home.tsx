import { Edit, Eye, Plus, Search } from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { useListForms } from "../api/service";
import { Button } from "@/components/ui/button";
import useAuthStore from "@/store/use-auth-store";

const FormListManager = () => {
  const { data: forms } = useListForms();

  const navigate = useNavigate();

  const [searchTerm, setSearchTerm] = useState("");

  const { doLogOut } = useAuthStore();

  const handleLogout = () => {
    doLogOut();
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Form Management
            </h1>
            <p className="text-gray-600">
              Manage your forms and view their details
            </p>
          </div>
          <Button variant="destructive" onClick={handleLogout}>
            Logout
          </Button>
        </div>

        {/* Controls */}
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search forms..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {/* Create Form Button */}
            <Link
              to={"/form/create"}
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
            >
              <Plus className="w-5 h-5 mr-2" />
              Create Form
            </Link>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                    ID
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                    Name
                  </th>

                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                    Description
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                    Status
                  </th>
                  <th className="px-6 py-4 text-center text-sm font-semibold text-gray-900">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {forms?.length === 0 ? (
                  <tr>
                    <td
                      colSpan={4}
                      className="px-6 py-12 text-center text-gray-500"
                    >
                      {searchTerm
                        ? "No forms found matching your search."
                        : "No forms created yet."}
                    </td>
                  </tr>
                ) : (
                  forms?.map((form) => (
                    <tr
                      key={form.id}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">
                        #{form.id}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {form.name}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {form.description}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-3 py-1 text-xs font-medium rounded-full
    ${
      form?.approval_status === 2
        ? "bg-amber-100 text-amber-800"
        : form?.approval_status === 3
        ? "bg-emerald-100 text-emerald-800"
        : "bg-red-100 text-red-800"
    }`}
                        >
                          {form?.approval_status === 2
                            ? "Pending"
                            : form?.approval_status === 3
                            ? "Approved"
                            : "Rejected"}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <div className="flex items-center justify-center space-x-2">
                          <Link
                            to={`/form/view/${form.id}`}
                            className="inline-flex items-center px-3 py-1.5 text-sm text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-md transition-colors"
                          >
                            <Eye className="w-4 h-4 mr-1" />
                            View
                          </Link>
                          <Link
                            to={`/form/update/${form.id}`}
                            className="inline-flex items-center px-3 py-1.5 text-sm text-green-600 hover:text-green-800 hover:bg-green-50 rounded-md transition-colors"
                            title="Edit Form"
                          >
                            <Edit className="w-4 h-4 mr-1" />
                            Edit
                          </Link>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FormListManager;
