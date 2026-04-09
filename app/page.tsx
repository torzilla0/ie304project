"use client";

import { useState, useRef, useEffect } from "react";
import {
  Send,
  Paperclip,
  Search,
  UserCircle,
  Menu,
  GraduationCap,
  MessageSquare,
  History,
  BookOpen,
  Archive,
  Settings,
  HelpCircle,
  Sparkles,
  Bot,
  User,
  Plus,
} from "lucide-react";

interface Message {
  role: "user" | "assistant";
  content: string;
}

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height =
        Math.min(textareaRef.current.scrollHeight, 120) + "px";
    }
  }, [input]);

  async function sendMessage(text?: string) {
    const msg = (text ?? input).trim();
    if (!msg || loading) return;

    const userMessage: Message = { role: "user", content: msg };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [...messages, userMessage],
        }),
      });

      if (!res.ok) throw new Error("Failed to get response");

      const data = await res.json();
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: data.reply },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            "Sorry, I encountered an error. Please try again later.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  }

  function handleSuggestion(text: string) {
    sendMessage(text);
  }

  const hasMessages = messages.length > 0;

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/30 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 z-50 flex flex-col h-screen w-72 bg-surface-container-low transition-transform duration-300 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0`}
      >
        <div className="p-6 flex items-center gap-3">
          <div className="w-10 h-10 rounded-full signature-gradient flex items-center justify-center text-white shrink-0">
            <GraduationCap size={20} />
          </div>
          <div>
            <h2 className="font-bold uppercase tracking-widest text-primary text-sm">
              IE Consultant
            </h2>
            <p className="text-[10px] text-on-surface-variant/60 font-medium tracking-wide">
              Academic Advisor
            </p>
          </div>
        </div>

        <div className="px-4 mb-6">
          <button
            onClick={() => {
              setMessages([]);
              setSidebarOpen(false);
            }}
            className="w-full signature-gradient text-white flex items-center justify-center gap-2 py-3 rounded-2xl font-semibold text-sm transition-transform active:scale-95 shadow-lg shadow-primary/20"
          >
            <Plus size={16} />
            New Chat
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto px-2 space-y-1">
          <p className="px-4 text-[11px] font-bold text-on-surface-variant/50 uppercase tracking-widest mb-2">
            Navigation
          </p>
          <a
            href="#"
            className="flex items-center gap-3 py-3 px-4 border-l-4 border-primary-container text-on-surface font-bold transition-all"
          >
            <MessageSquare size={20} />
            <span className="text-sm">Current Chat</span>
          </a>
          <a
            href="#"
            className="flex items-center gap-3 py-3 pl-4 text-[#5a5a5a] font-medium hover:bg-surface-container-highest transition-colors rounded-r-2xl"
          >
            <History size={20} />
            <span className="text-sm">Past Practice</span>
          </a>
          <a
            href="#"
            className="flex items-center gap-3 py-3 pl-4 text-[#5a5a5a] font-medium hover:bg-surface-container-highest transition-colors rounded-r-2xl"
          >
            <BookOpen size={20} />
            <span className="text-sm">Guidelines</span>
          </a>
          <a
            href="#"
            className="flex items-center gap-3 py-3 pl-4 text-[#5a5a5a] font-medium hover:bg-surface-container-highest transition-colors rounded-r-2xl"
          >
            <Archive size={20} />
            <span className="text-sm">Archives</span>
          </a>
        </nav>

        <div className="p-4 mt-auto space-y-1">
          <a
            href="#"
            className="flex items-center gap-3 py-2 px-4 text-[#5a5a5a] text-sm font-medium hover:bg-surface-container-highest transition-colors rounded-2xl"
          >
            <Settings size={20} />
            <span>Settings</span>
          </a>
          <a
            href="#"
            className="flex items-center gap-3 py-2 px-4 text-[#5a5a5a] text-sm font-medium hover:bg-surface-container-highest transition-colors rounded-2xl"
          >
            <HelpCircle size={20} />
            <span>Support</span>
          </a>
          <div className="mt-4 pt-4 border-t border-outline-variant/10 flex items-center gap-3 px-2">
            <div className="w-8 h-8 rounded-full bg-surface-container-highest flex items-center justify-center">
              <User size={14} />
            </div>
            <div className="flex-1">
              <p className="text-xs font-bold truncate">Student</p>
              <p className="text-[10px] text-on-surface-variant/70">
                METU IE Department
              </p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 lg:ml-72 flex flex-col h-screen relative bg-surface">
        {/* Header */}
        <header className="fixed top-0 right-0 left-0 lg:left-72 z-30 bg-surface h-16 flex items-center justify-between px-6 border-b border-outline-variant/10">
          <div className="flex items-center gap-4">
            <button
              className="lg:hidden p-2 text-on-surface"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu size={24} />
            </button>
            <h1 className="text-lg font-bold text-primary font-[family-name:var(--font-headline)] tracking-tight">
              METU-IE Summer Practice Consultant
            </h1>
          </div>
          <div className="flex items-center gap-4">
            <button className="p-2 text-[#5a5a5a] hover:opacity-80 transition-all">
              <Search size={20} />
            </button>
            <button className="p-2 text-[#5a5a5a] hover:opacity-80 transition-all">
              <UserCircle size={20} />
            </button>
          </div>
        </header>

        {/* Chat Area */}
        <section className="flex-1 overflow-y-auto pt-24 pb-36 px-6 md:px-12 chat-scroll">
          <div className="max-w-4xl mx-auto space-y-8">
            {/* Welcome State */}
            {!hasMessages && (
              <div className="flex flex-col items-center text-center space-y-6 pt-12">
                <div className="w-20 h-20 rounded-xl signature-gradient flex items-center justify-center text-white mb-4 custom-shadow">
                  <Sparkles size={36} />
                </div>
                <h2 className="text-4xl font-[family-name:var(--font-headline)] font-extrabold text-on-surface tracking-tight">
                  How can I assist your practice today?
                </h2>
                <p className="text-on-surface-variant max-w-lg text-lg leading-relaxed">
                  Your institutional guide for IE 300 and IE 400 summer
                  internships. Accurate, professional, and updated for the
                  2024 academic year.
                </p>
                <div className="flex flex-wrap justify-center gap-3 pt-6">
                  {[
                    "What are the requirements for IE 300?",
                    "What are the application steps?",
                    "Required documents?",
                  ].map((q) => (
                    <button
                      key={q}
                      onClick={() => handleSuggestion(q)}
                      className="glass-pill ghost-border px-6 py-3 rounded-full text-sm font-medium hover:bg-primary-container hover:text-white hover:border-transparent transition-all duration-300 shadow-sm cursor-pointer"
                    >
                      {q}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Messages */}
            {messages.map((msg, i) => (
              <div key={i}>
                {msg.role === "assistant" ? (
                  <div className="flex items-start gap-4 mr-12">
                    <div className="w-8 h-8 rounded-lg signature-gradient flex items-center justify-center text-white shrink-0 mt-1">
                      <Bot size={14} />
                    </div>
                    <div className="bg-surface-container-lowest p-6 rounded-2xl rounded-tl-none custom-shadow max-w-2xl border border-outline-variant/5">
                      <p className="text-sm leading-relaxed text-on-surface whitespace-pre-wrap">
                        {msg.content}
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-start gap-4 justify-end ml-12">
                    <div className="signature-gradient p-6 rounded-2xl rounded-tr-none text-white max-w-xl custom-shadow">
                      <p className="text-sm leading-relaxed font-medium">
                        {msg.content}
                      </p>
                    </div>
                    <div className="w-8 h-8 rounded-lg bg-surface-container-highest flex items-center justify-center shrink-0 mt-1">
                      <User size={14} />
                    </div>
                  </div>
                )}
              </div>
            ))}

            {/* Loading indicator */}
            {loading && (
              <div className="flex items-start gap-4 mr-12">
                <div className="w-8 h-8 rounded-lg signature-gradient flex items-center justify-center text-white shrink-0 mt-1">
                  <Bot size={14} />
                </div>
                <div className="bg-surface-container-lowest p-6 rounded-2xl rounded-tl-none custom-shadow border border-outline-variant/5">
                  <div className="flex gap-1.5">
                    <span className="typing-dot w-2 h-2 bg-primary rounded-full" />
                    <span className="typing-dot w-2 h-2 bg-primary rounded-full" />
                    <span className="typing-dot w-2 h-2 bg-primary rounded-full" />
                  </div>
                </div>
              </div>
            )}

            <div ref={chatEndRef} />
          </div>
        </section>

        {/* Input Area */}
        <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-surface via-surface to-transparent">
          <div className="max-w-4xl mx-auto relative">
            <div className="flex items-end gap-3 bg-surface-container-lowest p-3 rounded-2xl custom-shadow border border-outline-variant/10 inset-carve">
              <button className="p-2 text-on-surface-variant hover:text-primary transition-colors">
                <Paperclip size={20} />
              </button>
              <textarea
                ref={textareaRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                className="flex-1 bg-transparent border-none focus:outline-none text-sm py-2 resize-none placeholder:text-on-surface-variant/50"
                placeholder="Ask a question about summer practice..."
                rows={1}
              />
              <button
                onClick={() => sendMessage()}
                disabled={loading || !input.trim()}
                className="w-10 h-10 signature-gradient text-white rounded-lg flex items-center justify-center transition-all hover:scale-105 active:scale-95 shadow-md disabled:opacity-50 disabled:hover:scale-100"
              >
                <Send size={16} />
              </button>
            </div>
            <div className="mt-2 text-center">
              <p className="text-[10px] text-on-surface-variant/40 font-medium">
                METU IE Summer Practice Consultant uses AI and official
                guidelines. Always verify with your department coordinator.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
