import React, { useState, useEffect, useRef, useMemo } from "react";
import { io } from "socket.io-client";
import { useAuth } from "../../context/authContext";
import {
  getConversations,
  getMessages,
  markConversationRead,
  sendMessage,
} from "../../axios/api";

export default function HostMessages({ currentUserId = 3 }) {
  const { user } = useAuth();
  const effectiveUserId = Number(user?.id || currentUserId);

  const [conversations, setConversations] = useState([]);
  const [activeConv, setActiveConv] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessageText, setNewMessageText] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const [loadingConversations, setLoadingConversations] = useState(true);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [sending, setSending] = useState(false);

  const messagesEndRef = useRef(null);
  const socketRef = useRef(null);

  // Auto-scroll to bottom of chat thread when messages update
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // 1. Fetch conversations for the host user
  useEffect(() => {
    fetchConversations();
  }, [effectiveUserId]);

  const fetchConversations = async () => {
    setLoadingConversations(true);
    try {
      const result = await getConversations(effectiveUserId);

      // Support both axios-unwrapped responses (`{ success, data }`) and
      // wrapped responses (`{ data: { success, data } }`) depending on interceptor
      if (result?.success) {
        setConversations(result.data || []);
        if ((result.data || []).length > 0 && !activeConv) {
          selectConversation(result.data[0]);
        }
      } else if (result?.data?.success) {
        setConversations(result.data.data || []);
        if ((result.data.data || []).length > 0 && !activeConv) {
          selectConversation(result.data.data[0]);
        }
      }
    } catch (err) {
      console.error("Error fetching conversations:", err);
    } finally {
      setLoadingConversations(false);
    }
  };

  // 2. Select conversation, load messages, and mark unread items as read
  const selectConversation = async (conv) => {
    setActiveConv(conv);
    setLoadingMessages(true);

    try {
      const result = await getMessages(conv.conversation_id);

      if (result?.success) {
        setMessages(result.data || []);
      } else if (result?.data?.success) {
        setMessages(result.data.data || []);
      }

      if (conv.unread_count > 0) {
        await markConversationRead(conv.conversation_id, effectiveUserId);

        setConversations((prev) =>
          prev.map((item) =>
            item.conversation_id === conv.conversation_id
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

  // Socket.io: join user's room and listen for incoming messages
  useEffect(() => {
    if (!effectiveUserId) return;

    const SOCKET_URL =
      import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";
    const socket = io(SOCKET_URL, { withCredentials: true });
    socketRef.current = socket;

    socket.on("connect", () => {
      socket.emit("join", effectiveUserId);
    });

    socket.on("new_message", (msg) => {
      console.log("HostMessages socket new_message:", msg);
      if (!msg || !msg.id) return;

      // Update messages if the message belongs to the currently open conversation
      const msgConvId = Number(msg.conversation_id || msg.conversationId || 0);
      const activeId = Number(
        activeConv?.conversation_id || activeConv?.id || 0,
      );

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
            partner_name: msg.sender_name || msg.partner_name || "Guest",
            last_message: msg.message_text,
            unread_count: msg.sender_id !== effectiveUserId ? 1 : 0,
          };
          return [newConv, ...prev];
        }

        const updated = [...prev];
        updated[idx] = {
          ...updated[idx],
          last_message: msg.message_text,
          unread_count:
            updated[idx].unread_count +
            (msg.sender_id !== effectiveUserId ? 1 : 0),
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
  }, [effectiveUserId, activeConv]);

  const filteredConversations = useMemo(() => {
    const q = (searchTerm || "").trim().toLowerCase();
    if (!q) return conversations;
    return conversations.filter((c) =>
      (c.partner_name || "").toLowerCase().includes(q),
    );
  }, [conversations, searchTerm]);

  // 3. Send message handler
  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessageText.trim() || !activeConv || sending) return;

    setSending(true);
    const textToSend = newMessageText.trim();

    try {
      const result = await sendMessage(activeConv.conversation_id, {
        sender_id: effectiveUserId,
        message_text: textToSend,
      });

      // normalize response shapes
      let sentRow = null;
      if (result?.success) {
        sentRow = result.data;
      } else if (result?.data?.success) {
        sentRow = result.data.data;
      }

      if (sentRow) {
        setNewMessageText("");
        const sentMsg = { ...sentRow, sender_id: effectiveUserId };

        setMessages((prev) => [...prev, sentMsg]);

        setConversations((prev) =>
          prev.map((item) =>
            item.conversation_id === activeConv.conversation_id
              ? {
                  ...item,
                  last_message: sentMsg.message_text,
                  last_message_time:
                    sentMsg.sent_at || new Date().toISOString(),
                }
              : item,
          ),
        );
      } else {
        console.error("Unexpected response structure:", result);
        alert("Failed to send message. Check console for details.");
      }
    } catch (err) {
      console.error("Error sending message:", err);
      alert("Failed to send message. Check console for details.");
    } finally {
      setSending(false);
    }
  };

  return (
    <div
      style={{
        display: "flex",
        height: "80vh",
        border: "1px solid #e0e0e0",
        borderRadius: "8px",
        overflow: "hidden",
        fontFamily: "sans-serif",
      }}
    >
      {/* LEFT SIDEBAR: Conversations List */}
      <div
        style={{
          width: "320px",
          borderRight: "1px solid #e0e0e0",
          display: "flex",
          flexDirection: "column",
          backgroundColor: "#ffffff",
        }}
      >
        <div
          style={{
            padding: "12px 16px",
            borderBottom: "1px solid #e0e0e0",
            backgroundColor: "#f8f9fa",
            display: "flex",
            alignItems: "center",
            gap: 12,
          }}
        >
          <h2
            style={{
              margin: 0,
              fontSize: "1.1rem",
              color: "#333",
              flex: "0 0 auto",
            }}
          >
            Messages
          </h2>
          <input
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search guests by name"
            style={{
              flex: 1,
              padding: "8px 12px",
              borderRadius: 20,
              border: "1px solid #ddd",
              background: "white",
            }}
          />
        </div>

        <div style={{ flex: 1, overflowY: "auto" }}>
          {loadingConversations ? (
            <p style={{ padding: "16px", color: "#666" }}>
              Loading conversations...
            </p>
          ) : conversations.length === 0 ? (
            <p style={{ padding: "16px", color: "#666" }}>
              No conversations found.
            </p>
          ) : (
            filteredConversations.map((conv) => {
              const isActive =
                activeConv?.conversation_id === conv.conversation_id;
              return (
                <div
                  key={conv.conversation_id}
                  onClick={() => selectConversation(conv)}
                  style={{
                    padding: "12px 16px",
                    borderBottom: "1px solid #f0f0f0",
                    cursor: "pointer",
                    backgroundColor: isActive ? "#eaf2ff" : "transparent",
                    display: "flex",
                    alignItems: "center",
                    gap: "12px",
                  }}
                >
                  <img
                    src={
                      conv.partner_avatar || "https://via.placeholder.com/40"
                    }
                    alt={conv.partner_name || "User"}
                    style={{
                      width: "40px",
                      height: "40px",
                      borderRadius: "50%",
                      objectFit: "cover",
                    }}
                  />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        marginBottom: "4px",
                      }}
                    >
                      <strong
                        style={{
                          fontSize: "0.95rem",
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                        }}
                      >
                        {conv.partner_name || "Guest"}
                      </strong>
                      {conv.last_message_time && (
                        <span style={{ fontSize: "0.75rem", color: "#888" }}>
                          {new Date(conv.last_message_time).toLocaleTimeString(
                            [],
                            {
                              hour: "2-digit",
                              minute: "2-digit",
                            },
                          )}
                        </span>
                      )}
                    </div>
                    {conv.property_title && (
                      <div
                        style={{
                          fontSize: "0.8rem",
                          color: "#0066cc",
                          marginBottom: "2px",
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                        }}
                      >
                        {conv.property_title}
                      </div>
                    )}
                    <p
                      style={{
                        margin: 0,
                        fontSize: "0.85rem",
                        color: "#666",
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                    >
                      {conv.last_message || "No messages yet"}
                    </p>
                  </div>
                  {conv.unread_count > 0 && (
                    <span
                      style={{
                        backgroundColor: "#ff3b30",
                        color: "#fff",
                        borderRadius: "10px",
                        padding: "2px 8px",
                        fontSize: "0.75rem",
                        fontWeight: "bold",
                      }}
                    >
                      {conv.unread_count}
                    </span>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* RIGHT SIDEBAR: Chat Window */}
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          backgroundColor: "#ffffff",
        }}
      >
        {activeConv ? (
          <>
            {/* Header */}
            <div
              style={{
                padding: "16px",
                borderBottom: "1px solid #e0e0e0",
                backgroundColor: "#f8f9fa",
                display: "flex",
                alignItems: "center",
                gap: "12px",
              }}
            >
              <img
                src={
                  activeConv.partner_avatar || "https://via.placeholder.com/40"
                }
                alt={activeConv.partner_name || "User"}
                style={{
                  width: "40px",
                  height: "40px",
                  borderRadius: "50%",
                  objectFit: "cover",
                }}
              />
              <div>
                <h3 style={{ margin: 0, fontSize: "1.1rem" }}>
                  {activeConv.partner_name || "Guest"}
                </h3>
                {activeConv.property_title && (
                  <span style={{ fontSize: "0.85rem", color: "#666" }}>
                    Property: {activeConv.property_title}
                  </span>
                )}
              </div>
            </div>

            {/* Messages Thread Container */}
            <div
              style={{
                flex: 1,
                padding: "16px",
                overflowY: "auto",
                display: "flex",
                flexDirection: "column",
                gap: "12px",
                backgroundColor: "#fafafa",
              }}
            >
              {loadingMessages ? (
                <p style={{ color: "#666", textAlign: "center" }}>
                  Loading messages...
                </p>
              ) : messages.length === 0 ? (
                <p style={{ color: "#666", textAlign: "center" }}>
                  No messages yet. Send a message to start chatting!
                </p>
              ) : (
                messages.map((msg) => {
                  // Standardized ID comparisons using Number casting
                  const msgSenderId = Number(msg.sender_id || msg.senderId);
                  const activeUserId = Number(currentUserId);
                  const isMe = msgSenderId === activeUserId;

                  return (
                    <div
                      key={msg.id}
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        alignSelf: isMe ? "flex-end" : "flex-start",
                        maxWidth: "65%",
                      }}
                    >
                      {/* Message Bubble */}
                      <div
                        style={{
                          padding: "10px 14px",
                          borderRadius: "16px",
                          backgroundColor: isMe ? "#0066cc" : "#e9ecef",
                          color: isMe ? "#ffffff" : "#212529",
                          borderBottomRightRadius: isMe ? "2px" : "16px",
                          borderBottomLeftRadius: isMe ? "16px" : "2px",
                          boxShadow: "0 1px 2px rgba(0,0,0,0.05)",
                        }}
                      >
                        <p
                          style={{
                            margin: 0,
                            fontSize: "0.95rem",
                            wordBreak: "break-word",
                            lineHeight: "1.4",
                          }}
                        >
                          {msg.message_text}
                        </p>
                      </div>

                      {/* Timestamp */}
                      <span
                        style={{
                          fontSize: "0.7rem",
                          color: "#888888",
                          marginTop: "4px",
                          textAlign: isMe ? "right" : "left",
                          paddingLeft: isMe ? "0" : "4px",
                          paddingRight: isMe ? "4px" : "0",
                        }}
                      >
                        {msg.sent_at
                          ? new Date(msg.sent_at).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })
                          : ""}
                      </span>
                    </div>
                  );
                })
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Form */}
            <form
              onSubmit={handleSendMessage}
              style={{
                padding: "16px",
                borderTop: "1px solid #e0e0e0",
                display: "flex",
                gap: "8px",
                backgroundColor: "#ffffff",
              }}
            >
              <input
                type="text"
                placeholder="Type your message..."
                value={newMessageText}
                onChange={(e) => setNewMessageText(e.target.value)}
                style={{
                  flex: 1,
                  padding: "10px 16px",
                  borderRadius: "20px",
                  border: "1px solid #ccc",
                  outline: "none",
                  fontSize: "0.95rem",
                }}
              />
              <button
                type="submit"
                disabled={sending || !newMessageText.trim()}
                style={{
                  padding: "10px 20px",
                  borderRadius: "20px",
                  backgroundColor: "#0066cc",
                  color: "#ffffff",
                  border: "none",
                  cursor:
                    sending || !newMessageText.trim()
                      ? "not-allowed"
                      : "pointer",
                  opacity: sending || !newMessageText.trim() ? 0.5 : 1,
                  fontWeight: "600",
                }}
              >
                Send
              </button>
            </form>
          </>
        ) : (
          <div
            style={{
              flex: 1,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#888888",
            }}
          >
            Select a conversation from the sidebar to start chatting
          </div>
        )}
      </div>
    </div>
  );
}
