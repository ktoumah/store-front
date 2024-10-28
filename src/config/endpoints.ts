export const API_BASE_URL = "http://localhost:8006";
export const API_V1_URL = `${API_BASE_URL}/v1/api`;

export const endpoints = {
  login: `${API_V1_URL}/login`,
  users: {
    getAccount: `${API_V1_URL}/users/get-informations`,
    updateAccount: (userId: string) => `${API_V1_URL}/users/${userId}`,
  },
  articles: {
    userArticles: `${API_V1_URL}/user-articles`,
    add: `${API_V1_URL}/articles`,
    update: (articleId: string) => `${API_V1_URL}/articles/${articleId}`,
    delete: (articleId: string) => `${API_V1_URL}/articles/${articleId}`,
  }
};
