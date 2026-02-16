import axios from "axios";

/* ================= STRAPI API CONFIG ================= */

const RAW_BASE_URL = import.meta.env.VITE_STRAPI_BASE_URL || "http://localhost:1337/api";
const BASE_URL = RAW_BASE_URL.endsWith("/api") ? RAW_BASE_URL : `${RAW_BASE_URL}/api`;

/**
 * Get all resumes for a specific user
 */
export const GetUserResumes = (email) => {
  return axios.get(`${BASE_URL}/user-resumes?filters[userEmail][$eq]=${email}`);
};

/**
 * Create a new resume
 */
export const CreateNewResume = (data) => {
  return axios.post(`${BASE_URL}/user-resumes`, data);
};

/**
 * Get resume by documentId
 * (Used in Edit Resume page)
 */
export const GetResumeById = (documentId) => {
  return axios.get(
    `${BASE_URL}/user-resumes?filters[documentId][$eq]=${documentId}&populate=*`,
  );
};

export const UpdateResumeDetail = (documentId, formData) => {
  return axios.put(`${BASE_URL}/user-resumes/${documentId}`, {
    data: formData,
  });
};

export const DeleteResumeById = (documentId) => {
  return axios.delete(`${BASE_URL}/user-resumes/${documentId}`);
};
