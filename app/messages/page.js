"use client";

import { useState, useEffect } from "react";
import { MessageCircle } from "lucide-react";
import Link from "next/link";

export default function MessagesInboxPage() {
  const [user, setUser] = useState(null);
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);

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

    const fetchConversations = () => {
      fetch(`/api/messages/conversations?userId=${user.id}`)
        .then((res) => res.json())
        .then((data) => {
          setConversations(data.conversations || []);
          setLoading(false);
        });
    };

    fetchConversations();
    const interval = setInterval(fetchConversations, 15000);
    return () => clearInterval(interval);
  }, [user]);

  if (loading) {
    return <p className="p-6">Loading messages...</p>;
  }

  if (!user) {
    return <p className="p-6">Please log in to view your messages.</p>;
  }

  if (user.role !== "tutor") {
    return <p className="p-6">This page is only available to tutors.</p>;
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1
        className="text-2xl font-bold text-gray-900 mb-1 flex items-center gap-2"
        style={{ fontFamily: "var(--font-heading), Georgia, serif" }}
      >
        <MessageCircle size={24} />
        Messages
      </h1>
      <p className="text-gray-600 mb-6">Conversations with fellow tutors.</p>

      {conversations.length === 0 ? (
        <div className="flex flex-col items-center text-center gap-3 py-16 animate-fade-in-scale">
          <div className="relative">
            <div className="absolute inset-0 bg-green-200 rounded-full blur-xl opacity-40 animate-glow-pulse"></div>
            <div className="relative bg-gradient-to-br from-green-700 to-green-900 text-white rounded-full p-4 shadow-lg">
              <MessageCircle size={28} />
            </div>
          </div>
          <p className="text-gray-500 max-w-xs">
            No conversations yet. Visit a tutor's profile to start one.
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          {conversations.map((c, index) => (
            <Link
              key={c.otherId}
              href={`/messages/${c.otherId}?name=${encodeURIComponent(c.otherName)}`}
              className={`bg-white rounded-xl shadow-md p-4 flex items-center justify-between gap-3 card-lift animate-stagger animate-stagger-${Math.min(index + 1, 6)}`}
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-green-800 text-white font-bold flex items-center justify-center">
                  {c.otherName.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="font-medium text-gray-900">{c.otherName}</p>
                  <p className="text-sm text-gray-500 truncate max-w-xs">{c.lastMessage}</p>
                </div>
              </div>
              {c.unread && (
                <span className="w-2.5 h-2.5 bg-red-500 rounded-full flex-shrink-0"></span>
              )}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}