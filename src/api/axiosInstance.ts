import useAuthStore from "@/store/use-auth-store";
import axios, { type AxiosRequestConfig, type AxiosResponse } from "axios";

const axiosInstance = axios.create({
	baseURL: "https://18c4e0ee0872.ngrok-free.app",
	headers: {
		"Content-Type": "application/json",
	},
});

axiosInstance.interceptors.request.use(
	(config) => {
		const { token } = useAuthStore.getState();

		if (token) {
			config.headers.Authorization = `Token ${token}`;
		}
		return config;
	},
	(error) => {
		return Promise.reject(error);
	},
);

axiosInstance.interceptors.response.use(
	(response) => response,
	(error) => {
		try {
			if (error.response?.status === 403) {
				useAuthStore.getState().doLogOut();
			}
			return Promise.reject(error);
		} catch (error) {
			console.error("error", error);
		}
	},
);

type AxiosRequestConfigType = Omit<AxiosRequestConfig, "method">;

const axiosClient = async <TResponseData>(
	axiosConfig: AxiosRequestConfig,
): Promise<TResponseData> => {
	return axiosInstance({ ...axiosConfig }).then((res) => res.data);
};

export const GET = <TResponseData>(
	config: AxiosRequestConfigType,
): Promise<TResponseData> => axiosClient({ method: "GET", ...config });

export const POST = <TResponseData>(
	config: AxiosRequestConfigType,
): Promise<TResponseData> => axiosClient({ method: "POST", ...config });

export const PUT = <TResponseData>(
	config: AxiosRequestConfigType,
): Promise<TResponseData> => axiosClient({ method: "PUT", ...config });

export const DELETE = <TResponseData>(
	config: AxiosRequestConfigType,
): Promise<AxiosResponse<TResponseData>> =>
	axiosClient({ method: "DELETE", ...config });

export const PATCH = <TResponseData>(
	config: AxiosRequestConfigType,
): Promise<AxiosResponse<TResponseData>> =>
	axiosClient({ method: "PATCH", ...config });
