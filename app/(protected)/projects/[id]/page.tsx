"use client";

import AuthGuard from "@/components/AuthGuard";
import { useParams } from "next/navigation";
import { useMemo, useState } from "react";
import {
  demoProjects,
  demoRenders,
  demoChat,
  demoProducts,
  demoProjectProducts,
  demoFiles,
} from "@/lib/demoData";
import { Button, Badge, Input } from "@/components/UI";
import { MessageCircle, ClipboardList, FolderOpen } from "lucide-react";
import AreaModal from "@/components/AreaModal";
import CenterModal from "@/components/CenterModal";
import ChatMessage from "@/components/chat/ChatMessage";

export default function ProjectDetailPage() {
  const params = useParams<{ id: string }>();
  const projectId = params?.id as string;

  const project = useMemo(
    () => (demoProjects ?? []).find((p) => p.id === projectId),
    [projectId]
  );
  if (!project) return <div className="container py-8">Project not found</div>;

  const projectCode = `#DAC-${project.id.slice(0, 6).toUpperCase()}`;

  const linked = (demoProjectProducts ?? []).filter(
    (pp) => pp.projectId === project.id
  );

  const allRendersForProject = (demoRenders ?? []).filter(
    (r) => r.projectId === project.id
  );

  const derivedFromLinks = Array.from(new Set(linked.map((l) => l.area))).filter(
    Boolean
  ) as string[];
  const derivedFromRenders = Array.from(
    new Set(allRendersForProject.map((r) => r.area).filter(Boolean) as string[])
  );
  const areas =
    (derivedFromLinks.length ? derivedFromLinks : derivedFromRenders).length > 0
      ? (derivedFromLinks.length ? derivedFromLinks : derivedFromRenders)
      : ["Living Room", "Dining", "Bedroom", "Kitchen"];

  const screenshotsFor = (area: string) =>
    [1, 2].map((n) => ({
      id: `${area}-${n}`,
      imageUrl: `https://picsum.photos/seed/${encodeURIComponent(
        area + n
      )}/1200/800`,
    }));

  const productsFor = (area: string) =>
    linked
      .filter((l) => l.area === area)
      .map((l) => (demoProducts ?? []).find((p) => p.id === l.productId))
      .filter((p): p is NonNullable<typeof p> => Boolean(p))
      .map((p) => ({
        id: p.id,
        title: p.title,
        imageUrl: p.imageUrl,
        price: p.price,
      }));

  const rendersForArea = (area: string) =>
    allRendersForProject.filter((r) => r.area === area);

  const [openArea, setOpenArea] = useState<string | null>(null);
  const [chatOpen, setChatOpen] = useState(false);
  const [meetOpen, setMeetOpen] = useState(false);
  const [filesOpen, setFilesOpen] = useState(false);

  const messages = (demoChat ?? []).filter((m) => m.projectId === project.id);
  const [chatText, setChatText] = useState("");
  function sendChat() {
    if (!chatText.trim()) return;
    alert("Message sent (demo).");
    setChatText("");
  }
  const files = (demoFiles ?? []).filter((f) => f.projectId === project.id);

  return (
    <AuthGuard>
      <div className="py-4 bg-[#f4f3f0] -mx-4 px-4 rounded-2xl">
        <div className="relative bg-white/90 border rounded-2xl p-5 shadow-lg shadow-black/5">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h1 className="text-[28px] font-semibold leading-tight">
                {project.name}
              </h1>
              <div className="text-sm text-black/60">{projectCode}</div>

              <div className="mt-3">
                <div className="text-sm font-semibold">Address</div>
                <div>{project.address || "—"}</div>
              </div>

              {/* Details = Notes entered at creation */}
              <div className="mt-3">
                <div className="text-sm font-semibold">Details</div>
                {project.notes ? (
                  <div className="text-black/80 whitespace-pre-wrap">
                    {project.notes}
                  </div>
                ) : (
                  <div className="text-black/60">—</div>
                )}
              </div>

              <div className="mt-3 flex items-center gap-2 flex-wrap">
                {project.scope && (
                  <Badge className="text-[13px] px-3 py-1">{project.scope}</Badge>
                )}
                {project.status && (
                  <Badge className="text-[13px] px-3 py-1">{project.status}</Badge>
                )}
              </div>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              <Button
                variant="outline"
                onClick={() => setChatOpen(true)}
                className="px-4 hover:bg-[#d96857] hover:text-white"
              >
                <MessageCircle className="w-4 h-4 mr-1" /> Chat
              </Button>
              <Button
                variant="outline"
                onClick={() => setMeetOpen(true)}
                className="px-4 hover:bg-[#d96857] hover:text-white"
              >
                <ClipboardList className="w-4 h-4 mr-1" /> Meeting Summary
              </Button>
              <Button
                variant="outline"
                onClick={() => setFilesOpen(true)}
                className="px-4 hover:bg-[#d96857] hover:text-white"
              >
                <FolderOpen className="w-4 h-4 mr-1" /> Files
              </Button>
              <Button variant="outline" onClick={() => history.back()} className="px-4">
                Back
              </Button>
            </div>
          </div>
        </div>

        <div className="h-px bg-black/10 my-6 rounded-full" />

        <div className="grid sm:grid-cols-2 gap-5">
          {areas.map((area, idx) => {
            const areaRenders = rendersForArea(area).slice(0, 2);
            const areaScreens = screenshotsFor(area);
            const areaProducts = productsFor(area);

            return (
              <div
                key={area}
                className={`relative rounded-2xl p-3 shadow-lg shadow-black/5 border transition ${
                  idx % 2 ? "bg-[#faf8f6]" : "bg-white"
                } hover:shadow-xl hover:-translate-y-[1px]`}
              >
                <div className="absolute left-0 top-3 bottom-3 w-[3px] bg-[#d96857] rounded-r-full" />
                <div className="mb-2 pl-2">
                  <div className="text-lg font-semibold">{area}</div>
                </div>

                <div className="grid grid-cols-2 gap-3 pl-2">
                  <div className="rounded-2xl p-2 bg-[#f7f4f2] border">
                    <div className="text-xs text-black/60 mb-1">Renders</div>
                    <div className="grid grid-cols-2 gap-2">
                      {areaRenders.map((r) => (
                        <img
                          key={r.id}
                          src={r.imageUrl}
                          className="w-full h-28 object-cover rounded-xl"
                          alt="render"
                          onClick={() => setOpenArea(area)}
                        />
                      ))}
                      {areaRenders.length === 0 && (
                        <div className="text-xs text-black/50 py-6 text-center bg-white/60 rounded-xl border">
                          No renders yet
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="rounded-2xl p-2 bg-[#f7f4f2] border">
                    <div className="text-xs text-black/60 mb-1">Screenshots</div>
                    <div className="grid grid-cols-2 gap-2">
                      {areaScreens.map((s) => (
                        <img
                          key={s.id}
                          src={s.imageUrl}
                          className="w-full h-28 object-cover rounded-xl"
                          alt="screenshot"
                          onClick={() => setOpenArea(area)}
                        />
                      ))}
                    </div>
                  </div>
                </div>

                <div className="mt-3 pl-2">
                  <div className="flex items-center justify-between">
                    <div className="text-xs text-black/60 mb-1">Products</div>
                    <button
                      className="text-xs underline text-black/70 hover:text-black"
                      onClick={() => setOpenArea(area)}
                    >
                      View details →
                    </button>
                  </div>
                  <div className="flex gap-2 overflow-x-auto">
                    {areaProducts.slice(0, 6).map((p) => (
                      <img
                        key={p.id}
                        src={p.imageUrl}
                        className="w-12 h-12 object-cover rounded-xl"
                        alt={p.title}
                        onClick={() => setOpenArea(area)}
                      />
                    ))}
                    {areaProducts.length === 0 && (
                      <div className="text-xs text-black/50 py-3 px-4 bg-white/60 rounded-xl border">
                        No products linked
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {openArea && (
        <AreaModal
          open={true}
          onClose={() => setOpenArea(null)}
          area={openArea}
          renders={rendersForArea(openArea)}
          screenshots={screenshotsFor(openArea)}
          products={productsFor(openArea)}
          projectAddress={project.address || ""}
        />
      )}

      {/* Chat */}
      <CenterModal
        open={chatOpen}
        onClose={() => setChatOpen(false)}
        title="Project Chat"
        maxWidth="max-w-3xl"
      >
        <div className="max-h-[60vh] overflow-auto pr-2 mb-2">
          {(messages ?? []).map((m) => (
            <ChatMessage key={m.id} m={m} isSelf={m.senderId === "demo-user-1"} />
          ))}
          {(!messages || messages.length === 0) && (
            <div className="text-sm text-black/60">No messages yet.</div>
          )}
        </div>
        <div className="flex gap-2">
          <Input
            placeholder="Type a message..."
            value={chatText}
            onChange={(e) => setChatText(e.target.value)}
          />
          <Button onClick={sendChat}>Send</Button>
        </div>
      </CenterModal>

      {/* Meeting summary */}
      <CenterModal
        open={meetOpen}
        onClose={() => setMeetOpen(false)}
        title="Meeting Summary"
        maxWidth="max-w-3xl"
      >
        <div className="text-sm">
          <div className="font-medium mb-1">24 Oct — Kickoff</div>
          <ul className="list-disc pl-4 space-y-1 text-black/80">
            <li>Finalize living room palette</li>
            <li>Dining pendant options to share</li>
            <li>Upload DWG for kitchen by Friday</li>
          </ul>
          <div className="font-medium mt-4 mb-1">18 Oct — Intake</div>
          <ul className="list-disc pl-4 space-y-1 text-black/80">
            <li>Site photos received</li>
            <li>Floor plan PDF uploaded</li>
          </ul>
        </div>
      </CenterModal>

      {/* Files */}
      <CenterModal
        open={filesOpen}
        onClose={() => setFilesOpen(false)}
        title="Project Files"
        maxWidth="max-w-4xl"
      >
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {(files ?? []).map((f) => (
            <a
              key={f.id}
              href={f.url}
              target="_blank"
              rel="noreferrer"
              className="border rounded-2xl p-3 hover:bg-black/5"
            >
              <div className="text-xs text-black/60 mb-1">{f.type.toUpperCase()}</div>
              <div className="flex items-center gap-2">
                <div className="w-14 h-14 rounded-xl bg-black/5 flex items-center justify-center">
                  <span className="text-xs">{f.type.toUpperCase()}</span>
                </div>
                <div className="truncate">{f.url}</div>
              </div>
            </a>
          ))}
          {(!files || files.length === 0) && (
            <div className="text-sm text-black/60">No files uploaded.</div>
          )}
        </div>
      </CenterModal>
    </AuthGuard>
  );
}
