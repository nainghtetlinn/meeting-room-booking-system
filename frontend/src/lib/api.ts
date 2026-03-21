import axios from "axios";

export const api = axios.create({
	baseURL: import.meta.env.VITE_API_URL || "http://localhost:3000",
});

api.interceptors.request.use(
	(config) => {
		const userJson = localStorage.getItem("user");
		if (userJson) {
			try {
				const user = JSON.parse(userJson);
				if (user && user.id) {
					config.headers["x-user-id"] = user.id.toString();
				}
			} catch (e) {
				// Ignore parse error
			}
		}
		return config;
	},
	(error) => Promise.reject(error),
);
