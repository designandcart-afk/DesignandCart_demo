// Demo upload adapter for v2.3
// Today: converts selected Files to blob: URLs for preview.
// Later: replace the function body with Google Drive / storage uploader and
// return the real URLs (keep the shape so you don't touch UI code).

export type IncomingFile = {
  file: File;
};

export type UploadedFile = {
  id: string;
  name: string;
  size: number;
  mime: string;
  url: string; // blob: (demo) or https://... (production)
};

export async function uploadFiles(items: IncomingFile[]): Promise<UploadedFile[]> {
  const out: UploadedFile[] = items.map(({ file }) => ({
    id: `upl_${crypto.randomUUID?.() ?? Date.now()}`,
    name: file.name,
    size: file.size,
    mime: file.type || "application/octet-stream",
    url: URL.createObjectURL(file),
  }));

  // tiny artificial delay for UX parity with real uploads
  await new Promise((r) => setTimeout(r, 200));
  return out;
}
