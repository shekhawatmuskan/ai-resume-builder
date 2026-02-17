import axios from "axios";

/* ================= STRAPI API CONFIG ================= */

const RAW_BASE_URL = import.meta.env.VITE_STRAPI_BASE_URL || "http://localhost:1337/api";
const BASE_URL = RAW_BASE_URL.endsWith("/api") ? RAW_BASE_URL : `${RAW_BASE_URL}/api`;

const axiosClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add a request interceptor (optional: can be used for debugging or adding headers later)
axiosClient.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

/**
 * Get all resumes for a specific user
 */
export const GetUserResumes = (email) => {
  return axiosClient.get(`/user-resumes?filters[userEmail][$eq]=${email}`);
};

/**
 * Create a new resume
 */
export const CreateNewResume = (data) => {
  return axiosClient.post("/user-resumes", data);
};

/**
 * Get resume by documentId
 * (Used in Edit Resume page)
 */
export const GetResumeById = (documentId) => {
  return axiosClient.get(
    `/user-resumes?filters[documentId][$eq]=${documentId}&populate=*`,
  );
};

export const UpdateResumeDetail = (documentId, formData) => {
  return axiosClient.put(`/user-resumes/${documentId}`, {
    data: formData,
  });
};

export const DeleteResumeById = (documentId) => {
  return axiosClient.delete(`/user-resumes/${documentId}`);
};
