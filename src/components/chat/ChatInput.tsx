import React, { useState } from "react";

interface ChatInputProps {
  onSend: (message: string, senderId: string) => void | Promise<void>;
  senderId?: string;
}

export default function ChatInput({ onSend, senderId = "user-1" }: ChatInputProps) {
  const [value, setValue] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!value.trim()) return;
    setLoading(true);
    await onSend(value, senderId);
    setValue("");
    setLoading(false);
  };

  return (
    <form onSubmit={handleSend} className="flex gap-2 mt-4">
      <input
        className="input input-bordered flex-1"
        placeholder="پیام خود را بنویسید..."
        value={value}
        onChange={e => setValue(e.target.value)}
        disabled={loading}
      />
      <button type="submit" className="btn btn-primary" disabled={loading || !value.trim()}>
        ارسال
      </button>
    </form>
  );
}
