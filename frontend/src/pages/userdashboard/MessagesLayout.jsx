import React, { useState, useEffect, useRef, useMemo } from "react";
import { io } from "socket.io-client";
import { useAuth } from "../../context/authContext";
import {
  getConversations,
  getMessages,
  sendMessage,
  markConversationRead,
} from "../../axios/api";
import { useLocation } from "react-router-dom";

const MessagesLayout = () => {
  const { user } = useAuth() || {};
  const currentUserId = user?.id || user?.user_id || null;
  const location = useLocation();

  const [conversations, setConversations] = useState([]);
  const [loadingConversations, setLoadingConversations] = useState(false);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [messages, setMessages] = useState([]);
  const [activeConv, setActiveConv] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [sending, setSending] = useState(false);
  const [newMessageText, setNewMessageText] = useState("");

  const messagesEndRef = useRef(null);
  const socketRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const fetchConversations = async () => {
    setLoadingConversations(true);
    try {
      if (!currentUserId) {
        setConversations([]);
        setLoadingConversations(false);
        return;
      }

      const res = await getConversations(currentUserId);
      if (res && res.success) {
        const convs = res.data || [];
        setConversations(convs);

        // If navigation passed an open conversation, ensure it's opened
        const openPassed = location?.state?.openConversationData;
        const openId = location?.state?.openConversationId;
        if (openPassed && openId) {
          const found = convs.find(
            (c) => Number(c.conversation_id || c.id) === Number(openId),
          );
          if (found) {
            selectConversation(found);
          } else {
            selectConversation(openPassed);
          }
        } else if (convs.length > 0 && !activeConv) {
          // Auto-select first conversation if none is active
          selectConversation(convs[0]);
        }
      }
    } catch (err) {
      console.error("Error fetching conversations:", err);
    } finally {
      setLoadingConversations(false);
    }
  };

  useEffect(() => {
    if (currentUserId) {
      fetchConversations();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUserId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Socket.io: join user's room and listen for incoming messages
  useEffect(() => {
    if (!currentUserId) return;

    const SOCKET_URL =
      import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";
    const socket = io(SOCKET_URL, { withCredentials: true });
    socketRef.current = socket;

    socket.on("connect", () => {
      socket.emit("join", currentUserId);
    });

    socket.on("new_message", (msg) => {
      console.log("UserMessages socket new_message:", msg);
      if (!msg || !msg.id) return;

      const msgConvId = Number(msg.conversation_id || msg.conversationId || 0);
      const activeId = Number(
        activeConv?.conversation_id || activeConv?.id || 0,
      );

      // Append message to active thread if it belongs there
      if (activeId && activeId === msgConvId) {
        setMessages((prev) => {
          if (prev.some((m) => Number(m.id) === Number(msg.id))) return prev;
          return [...prev, msg];
        });
      }

      // Update conversations list: move conversation to top and update last_message/unread_count
      setConversations((prev) => {
        const convId = msgConvId;
        const idx = prev.findIndex(
          (c) => Number(c.conversation_id || c.id) === convId,
        );
        if (idx === -1) {
          const newConv = {
            conversation_id: convId,
            partner_name: msg.sender_name || msg.partner_name || "Host",
            last_message: msg.message_text,
            last_message_time: msg.sent_at || new Date().toISOString(),
            unread_count: msg.sender_id !== currentUserId ? 1 : 0,
          };
          return [newConv, ...prev];
        }

        const updated = [...prev];
        updated[idx] = {
          ...updated[idx],
          last_message: msg.message_text,
          unread_count:
            updated[idx].unread_count +
            (msg.sender_id !== currentUserId ? 1 : 0),
          last_message_time: msg.sent_at || new Date().toISOString(),
        };

        // move to top
        const item = updated.splice(idx, 1)[0];
        return [item, ...updated];
      });
    });

    return () => {
      socket.disconnect();
      socketRef.current = null;
    };
  }, [currentUserId, activeConv]);

  const selectConversation = async (conv) => {
    setActiveConv(conv);
    setLoadingMessages(true);

    try {
      const id = conv.conversation_id || conv.id;
      const result = await getMessages(id);
      if (result.success) setMessages(result.data || []);

      if (conv.unread_count > 0) {
        await markConversationRead(id, currentUserId);
        setConversations((prev) =>
          prev.map((item) =>
            (item.conversation_id || item.id) === id
              ? { ...item, unread_count: 0 }
              : item,
          ),
        );
      }
    } catch (err) {
      console.error("Error fetching messages:", err);
    } finally {
      setLoadingMessages(false);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessageText.trim() || !activeConv || sending) return;

    setSending(true);
    const textToSend = newMessageText.trim();

    try {
      const convId = activeConv.conversation_id || activeConv.id;
      const result = await sendMessage(convId, {
        sender_id: currentUserId,
        message_text: textToSend,
      });

      let sentRow = null;
      if (result?.success) {
        sentRow = result.data;
      } else if (result?.data?.success) {
        sentRow = result.data.data;
      }

      if (sentRow) {
        setNewMessageText("");

        const sentMsg = {
          ...sentRow,
          sender_id: sentRow.sender_id || currentUserId,
        };
        setMessages((prev) => [...prev, sentMsg]);

        setConversations((prev) =>
          prev.map((item) =>
            (item.conversation_id || item.id) === convId
              ? {
                  ...item,
                  last_message: sentMsg.message_text,
                  last_message_time:
                    sentMsg.sent_at || new Date().toISOString(),
                }
              : item,
          ),
        );
      }
    } catch (err) {
      console.error("Error sending message:", err);
      alert("Failed to send message. Check console for details.");
    } finally {
      setSending(false);
    }
  };

  const filteredConversations = useMemo(() => {
    const q = searchTerm.trim().toLowerCase();

    return conversations
      .filter((c) => {
        const hasMessages =
          Boolean(c.last_message) ||
          Number(c.message_count || c.messages_count || 0) > 0 ||
          c.has_messages ||
          (Array.isArray(c.messages) && c.messages.length > 0);

        const openPassed = location?.state?.openConversationData;
        const isOpenPassed =
          openPassed &&
          Number(openPassed.id || openPassed.conversation_id) ===
            Number(location?.state?.openConversationId);

        return (
          hasMessages ||
          isOpenPassed ||
          (activeConv &&
            Number(c.id || c.conversation_id) ===
              Number(activeConv.id || activeConv.conversation_id))
        );
      })
      .filter((c) => {
        if (!q) return true;
        const name = (c.partner_name || c.partner || "").toLowerCase();
        return name.includes(q);
      });
  }, [conversations, searchTerm, activeConv, location]);

  return (
    <div className="max-w-7xl mx-auto px-4">
      <h1 className="text-2xl font-semibold mb-4">Messages</h1>

      <div className="flex gap-6" style={{ height: "calc(100vh - 120px)" }}>
        <div style={{ width: 420 }}>
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-4 flex items-center justify-between">
            <strong>Conversations</strong>
            <div className="ml-4 flex items-center gap-2">
              <input
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search host name"
                className="px-3 py-1.5 rounded-full border border-gray-200 text-sm w-60 focus:outline-none focus:ring-1 focus:ring-blue-400"
              />
            </div>
          </div>

          <div
            className="space-y-2 overflow-y-auto"
            style={{ maxHeight: "calc(100vh - 200px)" }}
          >
            {loadingConversations ? (
              <div className="p-4 bg-white rounded-xl border">Loading...</div>
            ) : filteredConversations.length === 0 ? (
              <div className="p-4 bg-white rounded-xl border">
                No conversations
              </div>
            ) : (
              filteredConversations.map((conv) => {
                const id = conv.conversation_id || conv.id;
                const isActive =
                  (activeConv?.conversation_id || activeConv?.id) === id;
                return (
                  <div
                    key={id}
                    onClick={() => selectConversation(conv)}
                    className={`cursor-pointer p-3 rounded-lg border flex items-center gap-3 transition-colors ${isActive ? "bg-linear-to-r from-blue-50 to-white border-blue-200" : "bg-white hover:bg-gray-50"}`}
                  >
                    <div className="shrink-0">
                      <div className="w-12 h-12 rounded-full bg-linear-to-br from-indigo-400 to-pink-400 flex items-center justify-center text-white font-semibold">
                        {((conv.partner_name || "?")[0] || "").toUpperCase()}
                      </div>
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="font-semibold truncate">
                        {conv.partner_name || conv.partner || "Unknown"}
                      </div>
                      <div className="text-sm text-gray-500 truncate">
                        {conv.last_message || "No messages yet"}
                      </div>
                    </div>

                    {conv.unread_count > 0 && (
                      <div className="text-xs bg-red-500 text-white px-2 py-1 rounded">
                        {conv.unread_count}
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>

        <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-4 flex-shrink-0">
            {activeConv ? (
              <div className="flex items-center gap-3">
                <img
                  src={
                    activeConv.partner_avatar ||
                    "https://via.placeholder.com/40"
                  }
                  className="w-10 h-10 rounded-full object-cover"
                  alt="partner"
                />
                <div>
                  <div className="font-semibold">{activeConv.partner_name}</div>
                  <div className="text-sm text-gray-500">
                    {activeConv.property_title}
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-gray-500">
                Select a conversation to view messages
              </div>
            )}
          </div>

          <div
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 flex-1 overflow-y-auto"
            style={{ display: "flex", flexDirection: "column" }}
          >
            {loadingMessages ? (
              <div>Loading messages...</div>
            ) : messages.length === 0 ? (
              <div className="text-gray-500">No messages yet</div>
            ) : (
              <div className="space-y-3">
                {messages.map((msg) => {
                  const msgSenderId = Number(msg.sender_id || msg.senderId);
                  const isMe = Number(currentUserId) === msgSenderId;
                  return (
                    <div
                      key={msg.id}
                      className={`p-3 rounded-lg ${isMe ? "bg-blue-600 text-white ml-auto max-w-[65%]" : "bg-gray-100 text-gray-900 max-w-[65%]"}`}
                    >
                      <div>{msg.message_text}</div>
                      <div className="text-xs text-gray-400 mt-1">
                        {msg.sent_at
                          ? new Date(msg.sent_at).toLocaleString()
                          : ""}
                      </div>
                    </div>
                  );
                })}
                <div ref={messagesEndRef} />
              </div>
            )}
          </div>

          <form
            onSubmit={handleSendMessage}
            className="flex gap-2 flex-shrink-0 mt-4 p-4 bg-white rounded-xl shadow-sm border border-gray-200"
          >
            <input
              value={newMessageText}
              onChange={(e) => setNewMessageText(e.target.value)}
              placeholder={
                activeConv ? "Type a message..." : "Select conversation"
              }
              className="flex-1 rounded-md border px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-400"
              disabled={!activeConv}
            />
            <button
              disabled={!activeConv || sending || !newMessageText.trim()}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {sending ? "Sending..." : "Send"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default MessagesLayout;
