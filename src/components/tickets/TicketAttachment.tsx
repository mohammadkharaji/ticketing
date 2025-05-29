import { useState } from "react";

interface TicketAttachmentProps {
  fileName: string;
  fileUrl: string;
  fileType?: string;
  fileSize?: number;
}

export default function TicketAttachment({ fileName, fileUrl, fileType, fileSize }: TicketAttachmentProps) {
  return (
    <div className="flex items-center gap-2 border rounded p-2 bg-muted">
      <span className="font-bold">{fileName}</span>
      {fileType && <span className="text-xs text-muted-foreground">({fileType})</span>}
      {fileSize && <span className="text-xs text-muted-foreground">{(fileSize / 1024).toFixed(1)} KB</span>}
      <a href={fileUrl} target="_blank" rel="noopener noreferrer" className="btn btn-sm btn-primary ml-auto">دانلود</a>
    </div>
  );
}
