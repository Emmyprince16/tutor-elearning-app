"use client";

import { useState, useEffect } from "react";
import { MessageCircle, User } from "lucide-react";
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
      <h1 className="text-2xl font-bold text-gray-900 mb-1 flex items-center gap-2">
        <MessageCircle size={24} />
        Messages
      </h1>
      <p className="text-gray-600 mb-6">Conversations with fellow tutors.</p>

      {conversations.length === 0 ? (
        <p className="text-gray-500">
          No conversations yet. Visit a tutor's profile to start one.
        </p>
      ) : (
        <div className="flex flex-col gap-2">
          {conversations.map((c) => (
            <Link
              key={c.otherId}
              href={`/messages/${c.otherId}?name=${encodeURIComponent(c.otherName)}`}
              className="bg-white rounded-lg shadow-md p-4 flex items-center justify-between gap-3 hover:shadow-lg transition-shadow"
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