import { BrainCircuit, Send, Sparkles, User } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import FeedbackBanner from "../components/FeedbackBanner";
import SectionHeader from "../components/SectionHeader";
import useDocumentTitle from "../hooks/useDocumentTitle";
import {
  listInterviewCategories,
  sendInterviewChatMessage
} from "../services/interviewsService";

const AIChatPage = () => {
  useDocumentTitle("AI Interview Chat");

  const [categories, setCategories] = useState([]);
  const [activeCategory, setActiveCategory] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const scrollRef = useRef(null);

  useEffect(() => {
    const loadCategories = async () => {
      try {
        setCategories(await listInterviewCategories());
      } catch {
        // Categories are optional for chat, so free-form mode still works if this request fails.
      }
    };

    loadCategories();
  }, []);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, sending]);

  const handleCategoryClick = (category) => {
    setActiveCategory((current) => (current?._id === category._id ? null : category));
  };

  const sendMessage = async (textOverride) => {
    const text = (textOverride ?? input).trim();

    if (!text || sending) {
      return;
    }

    const userMessage = { role: "user", content: text };

    setMessages((current) => [...current, userMessage]);
    setInput("");
    setError("");
    setSending(true);

    try {
      const data = await sendInterviewChatMessage({
        message: text,
        categoryId: activeCategory?._id || null,
        history: messages
      });

      setMessages((current) => [...current, { role: "assistant", content: data.reply }]);
    } catch (requestError) {
      setError(
        requestError.response?.data?.message || "Something went wrong. Please try again."
      );
    } finally {
      setSending(false);
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    sendMessage();
  };

  const starterPrompt = (category) =>
    `Let's practice for a ${category.sampleRoles?.[0] || category.name} interview. Start by asking me one question.`;

  return (
    <div className="page-wrap space-y-8">
      <SectionHeader
        eyebrow="AI Interview Chat"
        title="Ask anything, or pick a track and get quizzed"
        description="Chat freely about interview prep, or choose a category below to focus the AI on a specific role."
      />

      <div className="glass-panel-strong flex h-[calc(100vh-11rem)] min-h-[32rem] max-h-[52rem] flex-col overflow-hidden sm:min-h-[38rem] lg:h-[70vh]">
        {categories.length > 0 ? (
          <div className="border-b border-slate-200/70 p-4 dark:border-slate-800">
            <div className="-mx-1 overflow-x-auto px-1">
              <div className="flex w-max min-w-full gap-2 sm:flex-wrap">
                {categories.map((category) => (
                  <button
                    key={category._id}
                    type="button"
                    onClick={() => handleCategoryClick(category)}
                    className={`tag-pill whitespace-nowrap transition ${
                      activeCategory?._id === category._id
                        ? "bg-tide text-white dark:bg-tide"
                        : "hover:bg-tide/10"
                    }`}
                  >
                    {category.name}
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : null}

        <div ref={scrollRef} className="flex-1 space-y-4 overflow-y-auto p-4 sm:p-6">
          {messages.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center gap-4 text-center">
              <div className="rounded-2xl bg-tide/10 p-4 text-tide dark:bg-tide/20 dark:text-teal-100">
                <BrainCircuit size={28} />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-slate-950 dark:text-white sm:text-xl">
                  {activeCategory
                    ? `Ready to practice ${activeCategory.name}`
                    : "Ask me anything about interview prep"}
                </h3>
                <p className="mt-2 max-w-md text-sm text-slate-500 dark:text-slate-400">
                  {activeCategory
                    ? "Tap below to jump into a mock question, or type your own message."
                    : "Pick a category above for focused practice, or just start typing your question."}
                </p>
              </div>
              {activeCategory ? (
                <button
                  type="button"
                  className="btn-secondary w-full sm:w-auto"
                  onClick={() => sendMessage(starterPrompt(activeCategory))}
                >
                  <Sparkles size={16} />
                  Start mock question
                </button>
              ) : null}
            </div>
          ) : (
            messages.map((msg, index) => (
              <div
                key={`${msg.role}-${index}`}
                className={`flex gap-2 sm:gap-3 ${msg.role === "user" ? "flex-row-reverse" : ""}`}
              >
                <div
                  className={`flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full ${
                    msg.role === "user"
                      ? "bg-slate-200 text-slate-700 dark:bg-slate-700 dark:text-slate-200"
                      : "bg-tide/10 text-tide dark:bg-tide/20 dark:text-teal-100"
                  }`}
                >
                  {msg.role === "user" ? <User size={16} /> : <BrainCircuit size={16} />}
                </div>
                <div
                  className={`max-w-[85%] whitespace-pre-wrap break-words rounded-2xl px-4 py-3 text-sm leading-relaxed sm:max-w-[75%] ${
                    msg.role === "user"
                      ? "bg-tide text-white"
                      : "border border-slate-200 bg-white/80 text-slate-700 dark:border-slate-800 dark:bg-slate-950/40 dark:text-slate-200"
                  }`}
                >
                  {msg.content}
                </div>
              </div>
            ))
          )}

          {sending ? (
            <div className="flex gap-2 sm:gap-3">
              <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-tide/10 text-tide dark:bg-tide/20 dark:text-teal-100">
                <BrainCircuit size={16} />
              </div>
              <div className="rounded-2xl border border-slate-200 bg-white/80 px-4 py-3 text-sm text-slate-500 dark:border-slate-800 dark:bg-slate-950/40 dark:text-slate-400">
                Thinking...
              </div>
            </div>
          ) : null}
        </div>

        {error ? (
          <div className="px-4 sm:px-6">
            <FeedbackBanner type="error" message={error} />
          </div>
        ) : null}

        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-3 border-t border-slate-200/70 p-4 dark:border-slate-800 sm:flex-row sm:items-center"
        >
          <input
            type="text"
            value={input}
            onChange={(event) => setInput(event.target.value)}
            placeholder={
              activeCategory
                ? `Ask about ${activeCategory.name}, or say "quiz me"...`
                : "Type your question... e.g. How do I answer 'Tell me about yourself'?"
            }
            className="field flex-1"
            disabled={sending}
          />
          <button
            type="submit"
            className="btn-primary w-full sm:w-auto"
            disabled={sending || !input.trim()}
          >
            <Send size={16} />
            Send
          </button>
        </form>
      </div>
    </div>
  );
};

export default AIChatPage;
