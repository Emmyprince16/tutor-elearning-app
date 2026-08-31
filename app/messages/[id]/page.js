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
        className="inline-flex items-center gap-1 text-green-800 mb-4 link-sweep"
      >
        <ArrowLeft size={18} />
        Back to Messages
      </Link>

      <div className="bg-gradient-to-r from-green-900 to-green-800 rounded-xl px-5 py-4 mb-4 flex items-center gap-3 shadow-md">
        <div className="w-10 h-10 rounded-full bg-white/15 text-white font-bold flex items-center justify-center">
          {otherName.charAt(0).toUpperCase()}
        </div>
        <h1
          className="text-lg font-bold text-white"
          style={{ fontFamily: "var(--font-heading), Georgia, serif" }}
        >
          {otherName}
        </h1>
      </div>

      <div className="flex-1 overflow-y-auto bg-white rounded-xl shadow-md p-4 flex flex-col gap-3">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center text-center gap-2 mt-12">
            <p className="text-gray-400">No messages yet. Say hello!</p>
          </div>
        ) : (
          messages.map((m) => {
            const isMine = m.senderId === user.id;
            const initial = (isMine ? user.firstName : otherName).charAt(0).toUpperCase();

            return (
              <div
                key={m.id}
                className={`flex items-end gap-2 max-w-[80%] animate-fade-in ${
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
                    isMine ? "bg-green-800 text-white" : "bg-gray-100 text-gray-900"
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
          className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-green-700 focus:border-transparent transition-shadow"
        />
        <button
          type="submit"
          disabled={sending}
          className="bg-green-800 text-white px-4 py-2.5 rounded-lg hover:bg-green-900 hover:scale-[1.02] transition-all duration-200 disabled:opacity-60"
        >
          <Send size={18} />
        </button>
      </form>
    </div>
  );
}