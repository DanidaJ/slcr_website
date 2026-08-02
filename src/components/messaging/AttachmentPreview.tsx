"use client";

import { useState } from "react";
import { Expand, FileDown, FileText, Paperclip } from "lucide-react";
import {
  attachmentMetaLabel,
  isImageAttachment,
  isPdfAttachment,
} from "@/lib/message-query";
import PdfViewerModal from "@/components/newsletters/PdfViewerModal";

type AttachmentPreviewProps = {
  fileUrl: string;
  fileName?: string;
  fileSize?: number;
  fileContentType?: string;
  /** Optional button colour override (e.g. gold for certificates). */
  accent?: "navy" | "gold";
};

export function AttachmentLabel({
  fileName,
  fileUrl,
  fileSize,
  fileContentType,
}: {
  fileName?: string;
  fileUrl?: string;
  fileSize?: number;
  fileContentType?: string;
}) {
  if (!fileName && !fileUrl) return null;
  const meta = attachmentMetaLabel({
    fileName,
    fileUrl,
    fileSize,
    fileContentType,
  });
  return (
    <span className="inline-flex items-center gap-1">
      <Paperclip className="h-3 w-3" />
      {meta}
    </span>
  );
}

export default function AttachmentPreview({
  fileUrl,
  fileName,
  fileSize,
  fileContentType,
  accent = "navy",
}: AttachmentPreviewProps) {
  const [pdfOpen, setPdfOpen] = useState(false);
  const isImage = isImageAttachment(fileName, fileUrl);
  const isPdf = isPdfAttachment(fileName, fileUrl);
  const meta = attachmentMetaLabel({
    fileName,
    fileUrl,
    fileSize,
    fileContentType,
  });
  const btnCls =
    accent === "gold"
      ? "bg-gold-dark hover:bg-gold"
      : "bg-navy hover:bg-navy-light";

  return (
    <div className="space-y-3">
      <p className="text-xs font-medium text-navy/50">{meta}</p>

      {isImage && (
        <a
          href={fileUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="block overflow-hidden rounded-xl border border-navy/10 bg-navy/[0.02]"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={fileUrl}
            alt={fileName ?? "Attachment"}
            className="max-h-[32rem] w-full object-contain"
          />
        </a>
      )}

      {isPdf && (
        <div className="overflow-hidden rounded-xl border border-navy/10 bg-navy/[0.02]">
          <div className="flex items-center justify-between gap-2 border-b border-navy/10 bg-white/80 px-3 py-2">
            <span className="inline-flex items-center gap-1.5 text-xs font-medium text-navy/60">
              <FileText className="h-3.5 w-3.5" />
              PDF preview
            </span>
            <button
              type="button"
              onClick={() => setPdfOpen(true)}
              className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs font-semibold text-navy/70 transition hover:bg-navy/5 hover:text-navy"
            >
              <Expand className="h-3.5 w-3.5" />
              Fullscreen
            </button>
          </div>
          <iframe
            src={`${fileUrl}#toolbar=0&navpanes=0`}
            title={fileName ?? "PDF attachment"}
            className="h-[28rem] w-full bg-white sm:h-[36rem]"
          />
        </div>
      )}

      <div className="flex flex-wrap gap-2">
        <a
          href={fileUrl}
          target="_blank"
          rel="noopener noreferrer"
          className={`inline-flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold text-white transition-colors ${btnCls}`}
        >
          <FileDown className="h-4 w-4" />
          {fileName ?? "Download attachment"}
        </a>
        {isPdf && (
          <button
            type="button"
            onClick={() => setPdfOpen(true)}
            className="inline-flex items-center gap-2 rounded-lg border border-navy/15 bg-white px-4 py-2.5 text-sm font-semibold text-navy transition hover:border-navy/30 hover:bg-navy/5"
          >
            <Expand className="h-4 w-4" />
            Open viewer
          </button>
        )}
      </div>

      {pdfOpen && (
        <PdfViewerModal
          url={fileUrl}
          title={fileName ?? "Attachment"}
          onClose={() => setPdfOpen(false)}
        />
      )}
    </div>
  );
}
