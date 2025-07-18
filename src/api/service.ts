import type { FormApprovalList, GetFormDetails } from "../pages/form/types";
import { useMutation, useQuery } from "@tanstack/react-query";
import { GET, POST, PUT } from "@/api/axiosInstance";

export const useCreateForm = () =>
	useMutation({
		mutationFn: async (data) => POST({ url: "/core/form-builder/", data }),
	});

export const useListForms = () =>
	useQuery({
		queryKey: ["form-list"],
		queryFn: () => GET<GetFormDetails[]>({ url: "/core/form-builder-list/" }),
	});

export const useGetFormById = (id?: string) =>
	useQuery({
		queryKey: ["form-detail", id],
		queryFn: () =>
			GET<GetFormDetails>({ url: `/core/api/forms-update/${id}/` }),
		enabled: !!id,
	});

export const useUpdateForm = (id: string) =>
	useMutation({
		mutationFn: (data) => PUT({ url: `/core/form-builder/${id}/`, data }),
	});

export const useGetFormTypes = () =>
	useQuery({
		queryKey: ["form-types"],
		queryFn: () => GET({ url: "/core/field-types/" }),
	});

export const useChangeFormStatus = () =>
	useMutation({
		mutationFn: ({
			levelId,
			data,
		}: {
			data: { approval_status: 3 | 4; remarks?: string };
			levelId?: number;
		}) => POST({ url: `/core/form-level-approvel/${levelId}/`, data }),
	});

export const useListRoles = () =>
	useQuery({
		queryKey: ["roles"],
		queryFn: () => GET<{ id: string; name: string }[]>({ url: "/core/roles/" }),
	});

export const useCreateFormApproval = () =>
	useMutation({
		mutationFn: ({
			data,
			formId,
		}: {
			data: {
				is_sequential: boolean;
				approval_levels: { level: number; role_id: string }[];
			};
			formId: string;
		}) => POST({ url: `/core/form-level-create/${formId}/`, data }),
	});

export const useGetFormApprovalLevels = (formId?: string) =>
	useQuery({
		queryKey: ["approval_level", formId],
		queryFn: () =>
			GET<FormApprovalList>({ url: `/core/form-level-retrieve/${formId}` }),
		enabled: !!formId,
	});

export const useCreateDynamicFormV2 = () =>
	useMutation({
		mutationFn: (data: unknown) =>
			POST({ url: "/core/v2/form-builder/", data }),
	});

export const useGetDynamicForm2 = (formId?: string) =>
	useQuery({
		queryKey: ["dynamicForm2", formId],
		queryFn: () =>
			GET<{ id: string; name: string }[]>({
				url: `core/v2/form-builder/${formId}/`,
			}),
		enabled: !!formId,
	});

export const useUpdateDynamicForm2 = (id?: string) =>
	useMutation({
		mutationFn: (data: unknown) =>
			PUT({ url: `/core/v2/form-builder/${id}/`, data }),
	});
