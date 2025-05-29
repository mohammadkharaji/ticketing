import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import chatService from "@/services/chatService";
import ChatRoom from "@/components/chat/ChatRoom";
import ChatInput from "@/components/chat/ChatInput";
import ChatMessage from "@/components/chat/ChatMessage";

export default function ChatRoomPage() {
  const router = useRouter();
  const { id } = router.query;
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id || typeof id !== "string") return;
    async function fetchMessages() {
      setLoading(true);
      const msgs = await chatService.getMessages(id as string);
      setMessages(msgs);
      setLoading(false);
    }
    fetchMessages();
  }, [id]);

  const handleSend = async (message: string, senderId: string) => {
    if (!id || typeof id !== "string") return;
    await chatService.sendMessage(id as string, message, senderId);
    // Refresh messages after sending
    const msgs = await chatService.getMessages(id as string);
    setMessages(msgs);
  };

  return (
    <div className="container py-8">
      <ChatRoom>
        {loading ? (
          <div>در حال بارگذاری...</div>
        ) : (
          <div className="space-y-2">
            {messages.map((msg, idx) => (
              <ChatMessage key={idx} message={msg} />
            ))}
          </div>
        )}
        <ChatInput onSend={handleSend} />
      </ChatRoom>
    </div>
  );
}
