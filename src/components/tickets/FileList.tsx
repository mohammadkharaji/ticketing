import { useState } from "react";
import { FileIcon, Download, Trash2, FileText, Image, Archive } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatPersianRelativeTime } from "@/lib/date-utils"; // مسیر صحیح
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import fileService, { FileInfo } from "@/services/fileservice";

interface FileListProps {
  files: FileInfo[];
  canDelete?: boolean;
  onFileDeleted?: (fileId: string) => void;
}

export function FileList({ files, canDelete = false, onFileDeleted }: FileListProps) {
  const [isDeleting, setIsDeleting] = useState<string | null>(null);

  const getFileIcon = (fileType: string) => {
    if (fileType.startsWith("image/")) {
      return <Image className="h-5 w-5 text-blue-500" aria-label="تصویر" />;
    } else if (fileType.includes("pdf")) {
      return <FileText className="h-5 w-5 text-red-500" aria-label="PDF" />;
    } else if (fileType.includes("word") || fileType.includes("doc")) {
      return <FileText className="h-5 w-5 text-blue-600" aria-label="Word" />;
    } else if (fileType.includes("excel") || fileType.includes("sheet") || fileType.includes("xls")) {
      return <FileText className="h-5 w-5 text-green-600" aria-label="Excel" />;
    } else if (fileType.includes("zip") || fileType.includes("rar") || fileType.includes("archive")) {
      return <Archive className="h-5 w-5 text-yellow-600" aria-label="فایل فشرده" />;
    } else {
      return <FileIcon className="h-5 w-5 text-gray-500" aria-label="فایل" />;
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const handleDelete = async (fileId: string) => {
    setIsDeleting(fileId);
    try {
      await fileService.deleteFile(fileId);
      onFileDeleted?.(fileId);
      // پیام موفقیت حذف فایل
    } catch (error) {
      console.error("Error deleting file:", error);
      // پیام خطا در حذف فایل
    } finally {
      setIsDeleting(null);
    }
  };

  if (files.length === 0) {
    return <p className="text-sm text-muted-foreground">هیچ فایلی پیوست نشده است</p>;
  }

  return (
    <div className="space-y-2">
      {files.map((file) => (
        <div
          key={file.id}
          className="flex items-center justify-between p-3 border rounded-md bg-muted/30"
        >
          <div className="flex items-center gap-3">
            {getFileIcon(file.type)}
            <div>
              <div className="font-medium text-sm">{file.name}</div>
              <div className="text-xs text-muted-foreground flex gap-2">
                <span>{formatFileSize(file.size)}</span>
                <span>•</span>
                <span>{formatPersianRelativeTime(file.createdAt)}</span>
                {file.createdByName && (
                  <>
                    <span>•</span>
                    <span>آپلود توسط: {file.createdByName}</span>
                  </>
                )}
              </div>
            </div>
          </div>          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="icon"
              asChild
              title="دانلود فایل"
            >
              <a href={file.url} target="_blank" rel="noopener noreferrer" download>
                <Download className="h-4 w-4" />
              </a>
            </Button>
            
            {canDelete && (
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    disabled={isDeleting === file.id}
                    title="حذف فایل"
                  >
                    <Trash2 className="h-4 w-4 text-destructive" /><span className="sr-only">حذف فایل</span>
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>حذف فایل</AlertDialogTitle>
                    <AlertDialogDescription>
                      آیا از حذف این فایل اطمینان دارید؟ این عمل غیرقابل بازگشت است.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>انصراف</AlertDialogCancel>
                    <AlertDialogAction onClick={() => handleDelete(file.id)}>حذف</AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
