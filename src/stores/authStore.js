import { defineStore } from "pinia";
import axiosClient from "../api/axiosClient";
import router from "../router";

export const useAuthStore = defineStore("auth", {
  state: () => ({
    user: JSON.parse(localStorage.getItem("user")) || null,
    token: localStorage.getItem("token") || null,
    wallet: null, // Thêm state ví tiền
    isLoading: false,
    error: null,
  }),
  getters: {
    isAuthenticated: (state) => !!state.token,
  },
  actions: {
    async login(credentials) {
      this.isLoading = true;
      this.error = null;
      try {
        const response = await axiosClient.post("/auth/login", credentials);
        const { token, username, role } = response.data;

        this.token = token;
        this.user = { username, role };

        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(this.user));

        // Sau khi login, lấy luôn thông tin ví
        await this.fetchProfile();

        router.push("/");
      } catch (err) {
        console.error(err);
        this.error = err.response?.data?.message || "Đăng nhập thất bại!";
      } finally {
        this.isLoading = false;
      }
    },

    // Hàm mới: Lấy thông tin User kèm Wallet
    async fetchProfile() {
      if (!this.token) return;
      try {
        const res = await axiosClient.get("/user/me");
        this.user = { ...this.user, ...res.data }; // Merge thông tin
        this.wallet = res.data.wallet; // Lưu ví riêng để dễ dùng
      } catch (error) {
        console.error("Lỗi tải profile:", error);
        if (error.response?.status === 401) this.logout();
      }
    },

    async register(registerData) {
      this.isLoading = true;
      this.error = null;
      try {
        await axiosClient.post("/auth/register", registerData);
        alert("Đăng ký thành công! Hãy đăng nhập.");
        router.push("/login");
      } catch (err) {
        this.error = err.response?.data || "Đăng ký thất bại!";
      } finally {
        this.isLoading = false;
      }
    },

    logout() {
      this.token = null;
      this.user = null;
      this.wallet = null;
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      router.push("/login");
    },
  },
});
