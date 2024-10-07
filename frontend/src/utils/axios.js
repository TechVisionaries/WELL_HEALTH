import axios from 'axios';

// ----------------------------------------------------------------------

const axiosInstance = axios.create({ baseURL: 'http://localhost:5000' });

axiosInstance.interceptors.response.use(
  (res) => res,
  (error) => Promise.reject((error.response && error.response.data) || 'Something went wrong')
);

export default axiosInstance;

// ----------------------------------------------------------------------

export const fetcher = async (args) => {
  const [url, config] = Array.isArray(args) ? args : [args];

  const res = await axiosInstance.get(url, { ...config });

  return res.data;
};

// ----------------------------------------------------------------------

export const endpoints = {
  chat: '/api/chat',
  kanban: '/api/kanban',
  calendar: '/api/calendar',
  auth: {
    me: '/api/auth/me',
    login: '/api/auth/login',
    register: '/api/auth/register',
    refresh_token: '/api/auth/refresh_token',
  },
  quatation: {
    create: '/api/quatation/create',
    get_by_user_id: '/api/quatation/get-quatation-by-user-id',
    get_by_admin_id: '/api/quatation/get-quatation-by-admin-id',
    get_by_staff_id: '/api/quatation/get-quatation-by-staff-id',
    reply: '/api/quatation/reply',
  },
  document: {
    confirm_upload_document: '/api/documents/confirm-upload',
    create_new_document: '/api/documents',
    get_documents_by_user_id: '/api/documents/user',
    get_document_by_id: '/api/documents/get-document-by-id',
    get_all: '/api/documents',
    mark_as_read_document_by_id: '/api/documents/read',
    create_new_user_document: '/api/documents/user',
  },
  user: {
    update_account: '/api/user/update_account',
    update_password: '/api/user/update_password',
    get_users_for_admin: '/api/user/get-all-users-to-admin',
    update_user: '/api/user/update_user',
    get_staff_for_admin: '/api/user/get-all-staff-for-admin',
  },
  mail: {
    list: '/api/mail/list',
    details: '/api/mail/details',
    labels: '/api/mail/labels',
  },
  post: {
    list: '/api/post/list',
    details: '/api/post/details',
    latest: '/api/post/latest',
    search: '/api/post/search',
  },
  product: {
    list: '/api/product/list',
    details: '/api/product/details',
    search: '/api/product/search',
  },
  health_card: {
    create: '/api/health_card/create',
  },
};
