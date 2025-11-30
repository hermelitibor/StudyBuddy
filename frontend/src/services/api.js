import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const api = axios.create({
  baseURL: `${API_URL}`,  // http://localhost:5000/
  headers: {
    "Content-Type": "application/json",
  },
});

const authService = {
  register: async (email, password, name, major) => {
    try {
      const response = await api.post("/register", {
        email,
        password,
        name,
        major,
      });
      
      if (response.data.token) {
        localStorage.setItem("authToken", response.data.token);
      }
      if (response.data.user) {
        localStorage.setItem("authUser", JSON.stringify(response.data.user));
      }
      return response.data;
    } catch (error) {
      throw error.response?.data || "Registration failed";
    }
  },

  login: async (email, password) => {
    try {
      const response = await api.post("/login", { email, password });
      if (response.data.token) {
        localStorage.setItem("authToken", response.data.token);
      }
      if (response.data.user) {
        localStorage.setItem("authUser", JSON.stringify(response.data.user));
      }
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || "Login failed";
    }
  },

  logout: () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("authUser");
  },

  getUser: () => {
    const user = localStorage.getItem("authUser");
    return user ? JSON.parse(user) : null;
  },

  isAuthenticated: () => {
    return !!localStorage.getItem("authToken");
  },
};

export default authService;