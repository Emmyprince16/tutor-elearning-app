"use client";

import { useState, useEffect, useRef, use } from "react";
import { ArrowLeft, Send } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

export default function MessageThreadPage({ params }) {
  const resolvedParams = use(params);
  const searchParams = useSearchParams();
  const otherName = searchParams.get("name") || "Tutor";

  const [user, setUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    } else {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!user) return;

    const fetchMessages = () => {
      fetch(`/api/messages?userId=${user.id}&otherUserId=${resolvedParams.id}`)
        .then((res) => res.json())
        .then((data) => {
          setMessages(data.messages || []);
          setLoading(false);
        });
    };

    fetchMessages();

    // Mark as read when opening the thread
    fetch("/api/messages/mark-read", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId: user.id, otherUserId: resolvedParams.id }),
    });

    const interval = setInterval(fetchMessages, 8000);
    return () => clearInterval(interval);
  }, [user, resolvedParams.id]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function handleSend(e) {
    e.preventDefault();
    if (!newMessage.trim()) return;

    setSending(true);
    try {
      const res = await fetch("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          senderId: user.id,
          senderName: `${user.firstName}, ${user.lastName}`,
          receiverId: resolvedParams.id,
          receiverName: otherName,
          content: newMessage,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        setMessages((prev) => [...prev, data.message]);
        setNewMessage("");
      }
    } catch (err) {
      console.error("Error sending message:", err);
    } finally {
      setSending(false);
    }
  }

  if (loading) {
    return <p className="p-6">Loading conversation...</p>;
  }

  if (!user) {
    return <p className="p-6">Please log in to view messages.</p>;
  }

  return (
    <div className="max-w-2xl mx-auto p-6 flex flex-col h-[85vh]">
      <Link
        href="/messages"
        className="inline-flex items-center gap-1 text-green-800 mb-4 hover:underline"
      >
        <ArrowLeft size={18} />
        Back to Messages
      </Link>

      <h1 className="text-xl font-bold text-gray-900 mb-4">{otherName}</h1>

      <div className="flex-1 overflow-y-auto bg-white rounded-lg shadow-md p-4 flex flex-col gap-3">
        {messages.length === 0 ? (
          <p className="text-gray-400 text-center mt-8">
            No messages yet. Say hello!
          </p>
        ) : (
          messages.map((m) => {
  const isMine = m.senderId === user.id;
  const initial = (isMine ? user.firstName : otherName).charAt(0).toUpperCase();

  return (
    <div
      key={m.id}
      className={`flex items-end gap-2 max-w-[80%] ${
        isMine ? "self-end flex-row-reverse" : "self-start"
      }`}
    >
      <div
        className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${
          isMine ? "bg-green-800 text-white" : "bg-gray-300 text-gray-700"
        }`}
      >
        {initial}
      </div>
      <div
        className={`px-4 py-2 rounded-lg ${
          isMine
            ? "bg-green-800 text-white"
            : "bg-gray-100 text-gray-900"
        }`}
      >
        <p className="text-sm">{m.content}</p>
      </div>
    </div>
  );
})
        )}
        <div ref={bottomRef}></div>
      </div>

      <form onSubmit={handleSend} className="flex gap-2 mt-4">
        <input
  type="text"
  value={newMessage}
  onChange={(e) => setNewMessage(e.target.value)}
  placeholder="Type a message..."
  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-green-700"
/>
        <button
          type="submit"
          disabled={sending}
          className="bg-green-800 text-white px-4 py-2 rounded-lg hover:bg-green-900 transition-colors disabled:opacity-60"
        >
          <Send size={18} />
        </button>
      </form>
    </div>
  );
}