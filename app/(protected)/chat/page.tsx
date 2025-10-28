"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { demoProjects } from "@/lib/demoData";
import { Button, Input } from "@/components/UI";

type ChatMsg = {
  id: string;
  projectId: string;
  sender: "designer" | "agent";
  text: string;
  ts: number;
};

const AGENT_NAME = "Agent";

export default function chatPage() {
  // load or seed chat in localStorage
  const [messages, setMessages] = useState<ChatMsg[]>([]);

  useEffect(() => {
    const key = "dc:chat";
    const existing: ChatMsg[] = JSON.parse(localStorage.getItem(key) || "[]");
    if (existing.length === 0) {
      // seed one welcome message per project
      const seed: ChatMsg[] = demoProjects.map((p) => ({
        id: `m_${p.id}_welcome`,
        projectId: p.id,
        sender: "agent",
        text: `Hello! I’m your ${AGENT_NAME}. Share requirements or files here — I’ll guide you end-to-end.`,
        ts: Date.now(),
      }));
      localStorage.setItem(key, JSON.stringify(seed));
      setMessages(seed);
    } else {
      setMessages(existing);
    }
  }, []);

  const [activeProjectId, setActiveProjectId] = useState(
    demoProjects[0]?.id || ""
  );
  const thread = useMemo(
    () => messages.filter((m) => m.projectId === activeProjectId).sort((a,b)=>a.ts-b.ts),
    [messages, activeProjectId]
  );

  const [draft, setDraft] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [thread.length, activeProjectId]);

  function saveMessages(next: ChatMsg[]) {
    setMessages(next);
    localStorage.setItem("dc:chat", JSON.stringify(next));
  }

  function sendDesigner() {
    if (!draft.trim()) return;
    const msg: ChatMsg = {
      id: `m_${Date.now()}`,
      projectId: activeProjectId,
      sender: "designer",
      text: draft.trim(),
      ts: Date.now(),
    };
    const next = [...messages, msg];
    saveMessages(next);
    setDraft("");
  }

  return (
    <main className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 py-6 grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Projects list */}
        <aside className="rounded-2xl border border-zinc-200 bg-[#f2f0ed] p-3">
          <h2 className="text-sm font-semibold text-[#2e2e2e] mb-2">Projects</h2>
          <div className="space-y-1">
            {demoProjects.map((p) => {
              const active = p.id === activeProjectId;
              return (
                <button
                  key={p.id}
                  onClick={() => setActiveProjectId(p.id)}
                  className={`w-full text-left px-3 py-2 rounded-2xl text-sm ${
                    active
                      ? "bg-[#d96857] text-white"
                      : "bg-white text-[#2e2e2e] border border-zinc-200 hover:bg-white/70"
                  }`}
                >
                  {p.name}
                  <div className="text-xs opacity-80">{p.scope}</div>
                </button>
              );
            })}
          </div>
        </aside>

        {/* Chat thread */}
        <section className="md:col-span-2 rounded-2xl border border-zinc-200 overflow-hidden">
          <div className="p-4 border-b border-zinc-200 bg-white">
            <div className="flex items-center gap-3">
              <div className="h-8 w-1.5 rounded-full bg-[#d96857]" />
              <div>
                <div className="text-sm font-semibold text-[#2e2e2e]">
                  {demoProjects.find((p) => p.id === activeProjectId)?.name}
                </div>
                <div className="text-xs text-zinc-500">
                  Chat with {AGENT_NAME}
                </div>
              </div>
            </div>
          </div>

          <div className="h-[60vh] overflow-y-auto bg-[#f9f9f8] p-4">
            {thread.map((m) => (
              <div
                key={m.id}
                className={`mb-3 flex ${
                  m.sender === "designer" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[75%] rounded-2xl px-3 py-2 text-sm shadow-sm ${
                    m.sender === "designer"
                      ? "bg-[#d96857] text-white"
                      : "bg-white text-[#2e2e2e] border border-zinc-200"
                  }`}
                >
                  <div className="whitespace-pre-wrap">{m.text}</div>
                  <div className="mt-1 text-[10px] opacity-70">
                    {new Date(m.ts).toLocaleString()}
                  </div>
                </div>
              </div>
            ))}
            <div ref={bottomRef} />
          </div>

          <div className="p-3 border-t border-zinc-200 bg-white flex gap-2">
            <Input
              placeholder="Type a message…"
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              className="flex-1 rounded-2xl"
            />
            <Button
              onClick={sendDesigner}
              className="rounded-2xl bg-[#d96857] text-white px-4"
            >
              Send
            </Button>
          </div>
        </section>
      </div>
    </main>
  );
}
