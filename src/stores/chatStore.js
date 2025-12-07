import { defineStore } from "pinia";
import axiosClient from "../api/axiosClient";

export const useChatStore = defineStore("chat", {
  state: () => ({
    messages: [],
    isLoading: false,
  }),
  actions: {
    async fetchMessages() {
      try {
        const res = await axiosClient.get("/chat/recent");
        this.messages = res.data;
      } catch (error) {
        console.error("Lỗi tải chat:", error);
      }
    },

    async sendMessage(content) {
      try {
        await axiosClient.post("/chat/send", { content });
        await this.fetchMessages(); // Gửi xong tải lại luôn cho nóng
      } catch (error) {
        alert("Gửi thất bại: " + (error.response?.data || "Lỗi mạng"));
      }
    },
  },
});
