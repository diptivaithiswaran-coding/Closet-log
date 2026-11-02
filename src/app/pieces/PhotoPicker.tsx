"use client";

import { useRef, useState } from "react";
import { createClient } from "@/lib/supabase/client";

// Shrink big phone photos before uploading: max 1200px on the long side, saved as JPEG.
async function shrink(file: File): Promise<Blob> {
  const bitmap = await createImageBitmap(file);
  const scale = Math.min(1, 1200 / Math.max(bitmap.width, bitmap.height));
  const canvas = document.createElement("canvas");
  canvas.width = Math.round(bitmap.width * scale);
  canvas.height = Math.round(bitmap.height * scale);
  canvas.getContext("2d")!.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
  return new Promise((resolve, reject) =>
    canvas.toBlob((b) => (b ? resolve(b) : reject(new Error("resize failed"))), "image/jpeg", 0.85)
  );
}

export default function PhotoPicker({ initialUrl }: { initialUrl: string | null }) {
  const [url, setUrl] = useState<string | null>(initialUrl);
  const [status, setStatus] = useState<"idle" | "uploading" | "error">("idle");
  const [message, setMessage] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setStatus("error");
      setMessage("That file isn't a photo. Try a JPG or PNG.");
      return;
    }

    setStatus("uploading");
    setMessage("");
    try {
      const blob = await shrink(file);
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("not logged in");

      const path = `${user.id}/${crypto.randomUUID()}.jpg`;
      const { error } = await supabase.storage.from("photos").upload(path, blob, { contentType: "image/jpeg" });
      if (error) throw error;

      setUrl(supabase.storage.from("photos").getPublicUrl(path).data.publicUrl);
      setStatus("idle");
    } catch {
      setStatus("error");
      setMessage("Couldn't upload that photo. Try a JPG or PNG under 10 MB.");
    } finally {
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  return (
    <div className="field">
      <span>Photo</span>
      <div className="photo-picker">
        <div className="photo photo-thumb">
          {url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={url} alt="Photo of this piece" />
          ) : (
            <span className="photo-empty small">No photo</span>
          )}
        </div>
        <div className="stack" style={{ gap: "0.5rem" }}>
          <label className="btn btn-secondary file-btn">
            {status === "uploading" ? "Uploading…" : url ? "Change photo" : "Add photo"}
            <input
              ref={inputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp,image/*"
              onChange={handleFile}
              disabled={status === "uploading"}
            />
          </label>
          {url && status !== "uploading" && (
            <button type="button" className="btn-link small" onClick={() => setUrl(null)}>
              Remove photo
            </button>
          )}
          {status === "error" && <span className="field-error">{message}</span>}
        </div>
      </div>
      <input type="hidden" name="photo_url" value={url ?? ""} />
    </div>
  );
}
