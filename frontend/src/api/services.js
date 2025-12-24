/**
 * AUTH SERVICE
 */
import apiClient from './client';

export const authAPI = {
  login: async (email, matKhau) => {
    const { data } = await apiClient.post('/auth/login', { email, matKhau });
    return data.data;
  },

  registerStudent: async (payload) => {
    const { data } = await apiClient.post('/auth/register', {
      ...payload,
      role: 'HocVien',
    });
    return data.data;
  },

  registerTutor: async (payload) => {
    const { data } = await apiClient.post('/auth/register', {
      ...payload,
      role: 'GiaSu',
    });
    return data.data;
  },

  getProfile: async () => {
    const { data } = await apiClient.get('/auth/profile');
    return data.data;
  },
};

export const adminAPI = {
  getDashboard: async () => {
    const { data } = await apiClient.get('/admin/dashboard');
    return data.data;
  },

  // Quản lý tài khoản
  getAccounts: async (params) => {
    const { data } = await apiClient.get('/admin/tai-khoan', { params });
    return data; // Return full response with pagination
  },

  createAdmin: async (payload) => {
    const { data } = await apiClient.post('/admin/tai-khoan/admin', payload);
    return data.data;
  },

  updateAccountStatus: async (id, trangThai) => {
    const { data } = await apiClient.put(`/admin/tai-khoan/${id}/trang-thai`, { trangThai });
    return data.data;
  },

  deleteAccount: async (id) => {
    const { data } = await apiClient.delete(`/admin/tai-khoan/${id}`);
    return data.data;
  },

  // Quản lý lớp học
  getClasses: async (params) => {
    const { data } = await apiClient.get('/admin/lop-hoc', { params });
    return data; // Return full response with pagination
  },

  assignTutor: async (classId, payload) => {
    const { data } = await apiClient.post(`/admin/lop-hoc/${classId}/gan-gia-su`, payload);
    return data.data;
  },

  deleteClass: async (classId) => {
    const { data } = await apiClient.delete(`/admin/lop-hoc/${classId}`);
    return data.data;
  },

  // Quản lý đăng ký
  getRegistrations: async (params) => {
    const { data } = await apiClient.get('/admin/dang-ky', { params });
    return data.data;
  },

  getUsers: async (params) => {
    const { data } = await apiClient.get('/admin/users', { params });
    return data.data;
  },
};

export const tutorAPI = {
  getMyProfile: async () => {
    const { data } = await apiClient.get('/gia-su/me');
    return data.data;
  },

  updateProfile: async (payload) => {
    const { data } = await apiClient.put('/gia-su/profile', payload);
    return data.data;
  },

  getMyClasses: async (params) => {
    const { data } = await apiClient.get('/gia-su/me/lop-hoc', { params });
    return data.data;
  },

  getMyRegistrations: async (params) => {
    const { data } = await apiClient.get('/gia-su/me/dang-ky', { params });
    return data.data;
  },
};

export const studentAPI = {
  getMyProfile: async () => {
    const { data } = await apiClient.get('/hoc-vien/profile');
    return data.data;
  },

  updateProfile: async (payload) => {
    const { data } = await apiClient.put('/hoc-vien/profile', payload);
    return data.data;
  },

  getMyRegistrations: async (params) => {
    const { data } = await apiClient.get('/hoc-vien/dang-ky', { params });
    return data.data;
  },

  registerForClass: async (payload) => {
    const { data } = await apiClient.post('/hoc-vien/dang-ky', payload);
    return data.data;
  },

  cancelRegistration: async (id) => {
    const { data } = await apiClient.delete(`/hoc-vien/dang-ky/${id}`);
    return data.data;
  },
};

export const classAPI = {
  getClasses: async (params) => {
    const { data } = await apiClient.get('/lop-hoc', { params });
    return data.data;
  },

  getClassDetail: async (id) => {
    const { data } = await apiClient.get(`/lop-hoc/${id}`);
    return data.data;
  },

  createClass: async (payload) => {
    const { data } = await apiClient.post('/lop-hoc', payload);
    return data.data;
  },

  updateClass: async (id, payload) => {
    const { data } = await apiClient.put(`/lop-hoc/${id}`, payload);
    return data.data;
  },

  getClassRegistrations: async (id) => {
    const { data } = await apiClient.get(`/lop-hoc/${id}/dang-ky`);
    return data.data;
  },

  approveRegistration: async (classId, registrationId, payload) => {
    const { data } = await apiClient.put(`/lop-hoc/${classId}/duyet-dang-ky/${registrationId}`, payload);
    return data.data;
  },
};

export const subjectAPI = {
  getSubjects: async (params) => {
    const { data } = await apiClient.get('/mon-hoc', { params });
    return data; // Return full response with pagination
  },

  getAllSubjects: async () => {
    const { data } = await apiClient.get('/mon-hoc/all');
    return data.data;
  },

  getSubjectDetail: async (id) => {
    const { data } = await apiClient.get(`/mon-hoc/${id}`);
    return data.data;
  },

  createSubject: async (payload) => {
    const { data } = await apiClient.post('/mon-hoc', payload);
    return data.data;
  },

  updateSubject: async (id, payload) => {
    const { data } = await apiClient.put(`/mon-hoc/${id}`, payload);
    return data.data;
  },

  deleteSubject: async (id) => {
    const { data } = await apiClient.delete(`/mon-hoc/${id}`);
    return data.data;
  },
};
