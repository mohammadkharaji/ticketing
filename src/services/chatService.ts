// سرویس مدیریت چت
const chatService = {
  async getMessages(roomId: string) {
    // TODO: دریافت پیام‌های چت
    return [];
  },
  async sendMessage(roomId: string, message: string, senderId: string) {
    // TODO: ارسال پیام چت
    return { id: 'new', message, senderId };
  }
};

export default chatService;
